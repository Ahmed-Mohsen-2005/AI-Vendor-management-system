from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil, os
from fastapi import FastAPI, UploadFile, File, Form
from Python_Scripts.NDA.NDA_Dates import extract_entities_from_pdf
from Python_Scripts.NDA.NDA_Signatures import annotate_pdf
from Python_Scripts.NDA.NDA_OCR import validate_nda
from Python_Scripts.RFP_and_Proposals.rfp_checker import check_rfp_file
from fastapi import HTTPException
from fastapi.responses import FileResponse
import re
import os
import uuid
import shutil
import csv
from typing import List, Dict, Tuple
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse, PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

import pdfplumber
from PIL import Image
import pytesseract
import PyPDF2

pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

UPLOAD_FOLDER = "uploaded_files"
TMP_DIR = "tmp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TMP_DIR, exist_ok=True)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}

# =============================================================================
# INVOICE PROCESSING FUNCTIONS (from main 1)
# =============================================================================

def extract_po_total(po_image_path):
    text = pytesseract.image_to_string(Image.open(po_image_path))
    print("DEBUG PO OCR TEXT:\n", text)

    numbers = re.findall(r"[\d,]+\.\d+", text)
    if not numbers:
        return None

    values = [float(num.replace(",", "")) for num in numbers]
    return max(values)

def extract_invoice_data(invoice_pdf_path):
    with pdfplumber.open(invoice_pdf_path) as pdf:
        # Try multiple extraction strategies
        text = ""
        for page in pdf.pages:
            # Try table extraction for structured data
            tables = page.extract_tables()
            if tables:
                for table in tables:
                    for row in table:
                        if any(row):
                            text += " | ".join(str(cell) for cell in row if cell) + "\n"

            # Fall back to text extraction
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    print(f"\n--- DEBUG INVOICE TEXT ({invoice_pdf_path}) ---\n", text[:2000] + "..." if len(text) > 2000 else text)

    # Extract PO reference
    match_po = re.search(r"PO Reference[:\s]*([A-Za-z0-9/]+)", text, re.IGNORECASE)
    po_reference = match_po.group(1) if match_po else None

    # Extract line items: multiple patterns to handle different formats
    line_items = []
    line_patterns = [
        r"(\d+)\s*(?:/\s*\w+)?\s+([\d,]+\.\d{2,3})\s+([\d,]+\.\d{2,3})",  # Qty / Unit Price LineTotal
        r"(\d+)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})",  # Qty UnitPrice LineTotal (2 decimals)
        r"(\d+)\s+([\d,]+\.\d{3})\s+([\d,]+\.\d{3})",  # Qty UnitPrice LineTotal (3 decimals)
        r"(\d+)[\s\S]{1,20}?([\d,]+\.\d{2})[\s\S]{1,20}?([\d,]+\.\d{2})",  # Flexible spacing
    ]

    print("DEBUG: Testing line item patterns...")
    for i, pattern in enumerate(line_patterns):
        matches = re.findall(pattern, text)
        print(f"Pattern {i}: Found {len(matches)} matches - {matches}")
        if matches:
            line_items = []
            for match in matches:
                try:
                    qty = int(match[0])
                    unit_price = float(match[1].replace(",", ""))
                    line_total = float(match[2].replace(",", ""))
                    line_items.append((qty, unit_price, line_total))
                except (ValueError, IndexError) as e:
                    print(f"Error parsing match {match}: {e}")
            if line_items:
                print(f"Using pattern {i} with {len(line_items)} valid line items")
                break

    print("DEBUG line_items extracted:", line_items)

    # Extract totals with multiple pattern options
    def extract_number(patterns):
        for pattern in patterns:
            m = re.search(pattern, text, re.IGNORECASE)
            if m:
                try:
                    return float(m.group(1).replace(",", ""))
                except (ValueError, AttributeError):
                    continue
        return None

    total_sales = extract_number([
        r"Total Sales[^\d]*([\d,]+\.\d+)",
        r"Subtotal[^\d]*([\d,]+\.\d+)",
        r"Net Amount[^\d]*([\d,]+\.\d+)"
    ])

    discount = extract_number([
        r"Total discount[^\d]*([\d,]+\.\d+)",
        r"Discount[^\d]*([\d,]+\.\d+)",
        r"Less Discount[^\d]*([\d,]+\.\d+)"
    ])

    tax = extract_number([
        r"Value added tax[^\d]*([\d,]+\.\d+)",
        r"VAT[^\d]*([\d,]+\.\d+)",
        r"Tax[^\d]*([\d,]+\.\d+)"
    ])

    grand_total = extract_number([
        r"Total Amount[^\d]*([\d,]+\.\d+)",
        r"Grand Total[^\d]*([\d,]+\.\d+)",
        r"Amount Due[^\d]*([\d,]+\.\d+)",
        r"TOTAL[^\d]*([\d,]+\.\d+)"
    ])

    # Debug print
    print(f"\n--- Extracted Data for {invoice_pdf_path} ---")
    print(f"PO Reference: {po_reference}")
    print("Line Items:")
    for i, (q, u, l) in enumerate(line_items):
        expected = round(q * u, 2)
        status = "✅" if abs(expected - l) < 0.01 else "❌"
        print(f"  Item {i + 1}: Qty={q}, Unit={u}, LineTotal={l} {status} (expected: {expected})")
    print(f"Totals: Sales={total_sales}, Discount={discount}, Tax={tax}, GrandTotal={grand_total}")

    # Validation checks
    checks = {}

    # (a) Check each line total = qty * unit price (with rounding for currency)
    if line_items:
        checks["Line Items"] = all(abs(round(q * u, 2) - round(l, 2)) < 0.01 for q, u, l in line_items)
    else:
        checks["Line Items"] = False
        print("WARNING: No line items found")

    # (b) Check total sales = sum of line totals
    if total_sales is not None and line_items:
        line_total_sum = sum(round(l, 2) for _, _, l in line_items)
        checks["Sales Total"] = abs(line_total_sum - round(total_sales, 2)) < 0.01
    else:
        checks["Sales Total"] = False

    # (c) Check grand total = sales - discount + tax
    if all(v is not None for v in [grand_total, total_sales]):
        d = discount if discount is not None else 0
        t = tax if tax is not None else 0
        expected = round(total_sales - d + t, 2)
        checks["Grand Total"] = abs(expected - round(grand_total, 2)) < 0.01
    else:
        checks["Grand Total"] = False

    print("\nValidation Results:")
    for k, v in checks.items():
        print(f"  {k}: {'✅ OK' if v else '❌ FAIL'}")

    return {
        "po_reference": po_reference,
        "line_items": line_items,
        "totals": {
            "sales": total_sales,
            "discount": discount,
            "tax": tax,
            "grand": grand_total
        },
        "checks": checks
    }

def check_multiple_invoices(po_image_path, invoice_files, csv_filename="report.csv"):
    po_total = extract_po_total(po_image_path)
    if not po_total:
        raise ValueError("❌ PO total not found")

    print(f"\nPO Total: {po_total}")
    remaining = po_total
    results = []

    # Process in the order provided (no sorting to preserve upload order)
    for i, inv_file in enumerate(invoice_files):
        print(f"\n{'=' * 50}")
        print(f"PROCESSING INVOICE {i + 1}/{len(invoice_files)}: {inv_file}")
        print(f"{'=' * 50}")

        data = extract_invoice_data(inv_file)
        invoice_total = data["totals"]["grand"]
        po_ref = data["po_reference"]

        if not invoice_total or not po_ref:
            results.append({
                "Invoice": os.path.basename(inv_file),
                "Invoice_Total": invoice_total or 0,
                "Sufficient": "Error",
                "Vendor": "Unknown",  # Add vendor field
                "Due_Date": "N/A",    # Add due_date field
                "Status": "Error",     # Add status field
                "Checks": data["checks"]
            })
            continue

        remaining_after = remaining - invoice_total
        sufficient = "Yes" if remaining_after >= -0.01 else "No"
        status = "Approved" if sufficient == "Yes" else "Pending Approval"
        
        results.append({
            "Invoice": os.path.basename(inv_file),
            "Invoice_Total": invoice_total,
            "Sufficient": sufficient,
            "Vendor": f"Vendor {i+1}",  # You might want to extract actual vendor names
            "Due_Date": "2024-12-31",   # You might want to extract actual due dates
            "Status": status,
            "Checks": data["checks"]
        })
        
        remaining = remaining_after  # Update remaining for next invoice
        print(f"Invoice processed. Remaining PO balance: {remaining_after:.2f}")

    # Write results to CSV
    csv_path = os.path.join(TMP_DIR, csv_filename)
    if results:
        with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=results[0].keys())
            writer.writeheader()
            writer.writerows(results)
        print(f"\nReport saved to: {csv_path}")

    return {
        "PO_Total": po_total,
        "Final_Remaining": remaining,
        "Report_File": csv_path,
        "Results": results,
        "PO_Ref": po_ref or "Not Found"  # Changed from PO_REF to PO_Ref
    }


# =============================================================================
# CONTRACT PROCESSING FUNCTIONS (from main 2)
# =============================================================================

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file page by page"""
    text = ""
    try:
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("❌ Error reading PDF:", e)
    return text

def format_date(date_str: str) -> str:
    """Convert 2-digit year to 4-digit year if needed"""
    if re.match(r"\d{1,2}/\d{1,2}/\d{2}$", date_str):
        day, month, year = date_str.split('/')
        # Assuming years 00-79 are 2000-2079, 80-99 are 1980-1999
        if int(year) <= 79:
            return f"{day}/{month}/20{year}"
        else:
            return f"{day}/{month}/19{year}"
    return date_str

def extract_expiry_date(text: str) -> str:
    """Extract contract expiry date from text with more specific patterns"""
    # More specific expiry date patterns in Arabic contracts
    expiry_patterns = [
        # Patterns that specifically mention expiry/end
        r"تاريخ الانتهاء[\s:]*(\d{1,2}/\d{1,2}/\d{2,4})",
        r"ينتهي في[\s:]*(\d{1,2}/\d{1,2}/\d{2,4})",
        r"مدة العقد حتى[\s:]*(\d{1,2}/\d{1,2}/\d{2,4})",
        r"تنتهي في[\s:]*(\d{1,2}/\d{1,2}/\d{2,4})",
        r"تاريخ نهاية العقد[\s:]*(\d{1,2}/\d{1,2}/\d{2,4})",
        r"انتهاء العقد في[\s:]*(\d{1,2}/\d{1,2}/\d{2,4})",
        r"ينتهي هذا العقد في[\s:]*(\d{1,2}/\d{1,2}/\d{2,4})",
        
        # Patterns with specific context around the date
        r"(?:ينتهي|تنتهي|انتهاء)[\s\S]{1,50}?(\d{1,2}/\d{1,2}/\d{2,4})",
        r"(\d{1,2}/\d{1,2}/\d{2,4})[\s\S]{1,30}?(?:ينتهي|تنتهي|انتهاء)",
    ]
    
    # First pass: look for specific expiry patterns
    for pattern in expiry_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            date_str = match.group(1)
            return format_date(date_str)
    
    # Second pass: look for dates near expiry keywords in the same line
    lines = text.split('\n')
    expiry_keywords = ["انتهاء", "ينتهي", "تنتهي", "الانتهاء", "نهاية", "ينتهي العقد", "تنتهي المدة"]
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        for keyword in expiry_keywords:
            if keyword in line_lower:
                # Look for dates in the same line
                date_match = re.search(r"(\d{1,2}/\d{1,2}/\d{2,4})", line)
                if date_match:
                    date_str = date_match.group(1)
                    return format_date(date_str)
                
                # Look for dates in the next 2 lines
                for j in range(i+1, min(i+3, len(lines))):
                    next_line = lines[j]
                    date_match = re.search(r"(\d{1,2}/\d{1,2}/\d{2,4})", next_line)
                    if date_match:
                        date_str = date_match.group(1)
                        return format_date(date_str)
    
    # Third pass: if still not found, look for the latest date in the document
    # (assuming expiry date is usually the latest date mentioned)
    all_dates = re.findall(r"(\d{1,2}/\d{1,2}/\d{2,4})", text)
    if all_dates:
        # Convert to datetime objects for comparison
        date_objects = []
        for date_str in all_dates:
            try:
                formatted_date = format_date(date_str)
                day, month, year = map(int, formatted_date.split('/'))
                if year < 100:  # Handle 2-digit years
                    year += 2000 if year <= 79 else 1900
                date_objects.append((datetime(year, month, day), formatted_date))
            except:
                continue
        
        if date_objects:
            # Return the latest date
            latest_date = max(date_objects, key=lambda x: x[0])
            return latest_date[1]
    
    return "Not found"

def extract_contract_value(text: str) -> str:
    """Extract contract value from text"""
    # Currency patterns in Arabic contracts
    currency_patterns = [
        r"قيمة العقد[\s:]*([\d,]+\.?\d*)\s*(ريال|ر\.س|SAR|رس)",  # قيمة العقد: X ريال
        r"المبلغ[\s:]*([\d,]+\.?\d*)\s*(ريال|ر\.س|SAR|رس)",      # المبلغ: X ريال
        r"القيمة الإجمالية[\s:]*([\d,]+\.?\d*)\s*(ريال|ر\.س|SAR|رس)",  # القيمة الإجمالية: X ريال
        r"([\d,]+\.?\d*)\s*(ريال|ر\.س|SAR|رس)",                  # Any amount with currency
        r"ريال[\s:]*([\d,]+\.?\d*)",                             # ريال: X
        r"ر\.س[\s:]*([\d,]+\.?\d*)",                             # ر.س: X
        r"قيمه العقد:\s*([\d,]+\.?\d*)",                         # قيمه العقد: 1500000
        r"قيمة العقد:\s*([\d,]+\.?\d*)",                         # قيمة العقد: 1500000
    ]
    
    for pattern in currency_patterns:
        match = re.search(pattern, text)
        if match:
            amount = match.group(1)
            # Format the amount with commas
            try:
                amount_num = float(amount.replace(',', ''))
                return f"{amount_num:,.2f} SAR"
            except ValueError:
                return f"{amount} SAR"
    
    # Try to find numbers that might be contract values (large numbers)
    # Look for numbers with 5+ digits that might be contract values
    large_numbers = re.findall(r"(\d{5,})", text)
    if large_numbers:
        # Filter out likely dates and other non-value numbers
        for num in large_numbers:
            num_value = int(num)
            # Assume contract values are typically above 10,000
            if num_value > 10000 and num_value < 1000000000:  # Between 10K and 1B
                try:
                    return f"{num_value:,.2f} SAR"
                except:
                    return f"{num} SAR"
    
    return "Not found"

def process_contract_content(file_path: str) -> Tuple[List[Dict[str, str]], List[Dict[str, str]], Dict[str, str]]:
    """Process contract and return existing/missing data, contract content, and additional info"""
    # Arabic clauses mapped to English
    clause_map = {
        "شروط الدفع": "Payment Terms",
        "الغرامات والجزاءات": "Penalties",
        "أحكام العقد": "Contract Provisions",
        "مدة العقد": "Contract Duration"
    }

    clause_content = {eng: "" for eng in clause_map.values()}
    current_clause = None

    # Extract text from PDF
    pdf_text = extract_text_from_pdf(file_path)
    lines = pdf_text.split("\n")

    for line in lines:
        trimmed = line.strip()
        normalized = re.sub(r"^[0-9.\-:()]+", "", trimmed).strip()

        matched = False
        for ar_clause, en_clause in clause_map.items():
            if normalized.startswith(ar_clause):
                current_clause = en_clause
                clause_content[current_clause] = normalized[len(ar_clause):].strip().lstrip(":").strip()  # Add content after title if any
                matched = True
                break

        if not matched and current_clause:
            if normalized.startswith("البند"):  # start of a new clause
                current_clause = None
            else:
                if normalized:
                    if clause_content[current_clause]:
                        clause_content[current_clause] += " " + normalized
                    else:
                        clause_content[current_clause] = normalized

    # Extract additional information
    expiry_date = extract_expiry_date(pdf_text)
    contract_value = extract_contract_value(pdf_text)
    
    additional_info = {
        "expiry_date": expiry_date,
        "contract_value": contract_value
    }

    # Prepare data for response - ALWAYS return all expected clauses
    existing_missing = []
    contract_content = []

    for en_clause in clause_map.values():
        content = clause_content.get(en_clause, "").strip()
        status = "Exists" if content else "Missing"
        existing_missing.append({"item": en_clause, "status": status})
        
        if content:
            contract_content.append({"section": en_clause, "detail": content})
        else:
            # Even if missing, include it with empty detail
            contract_content.append({"section": en_clause, "detail": "-"})

    return existing_missing, contract_content, additional_info

# =============================================================================
# API ENDPOINTS
# =============================================================================

# Invoice processing endpoints
@app.post("/process_invoices")
async def process_invoices(
    po_file: UploadFile = File(...),
    invoices: list[UploadFile] = File(...)
):
    # ✅ Save PO file
    po_path = os.path.join(TMP_DIR, f"{uuid.uuid4()}_{po_file.filename}")
    with open(po_path, "wb") as out:
        shutil.copyfileobj(po_file.file, out)

    # ✅ Save all invoice files
    inv_paths = []
    for inv in invoices:
        p = os.path.join(TMP_DIR, f"{uuid.uuid4()}_{inv.filename}")
        with open(p, "wb") as out:
            shutil.copyfileobj(inv.file, out)
        inv_paths.append(p)

    try:
        # ✅ Generate CSV filename inside TMP_DIR
        csv_filename = f"report_{uuid.uuid4()}.csv"
        result = check_multiple_invoices(po_path, inv_paths, csv_filename=csv_filename)

        # ✅ Add only the CSV filename to the response (cleaner for frontend)
        result["Report_File"] = csv_filename

    except Exception as e:
        print(f"❌ Error in check_multiple_invoices: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})

    finally:
        # ✅ Cleanup temp PO and invoice PDFs (but keep the CSV report)
        try:
            os.remove(po_path)
            for p in inv_paths:
                os.remove(p)
        except Exception as e:
            print(f"⚠️ Cleanup error: {e}")

    return result

@app.get("/get_csv/")
async def get_csv(filename: str):
    file_path = os.path.join(TMP_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="CSV file not found")
    
    return FileResponse(
        file_path,
        media_type="text/csv",
        filename=filename
    )
# Alternative: Return CSV content as text
@app.get("/get_csv_content/")
async def get_csv_content(filename: str):
    """Return CSV content as plain text"""
    try:
        # Security check: ensure the file is in the tmp_uploads directory
        if not filename.startswith("tmp_uploads/"):
            filename = os.path.join(TMP_DIR, filename)
            
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                content = f.read()
            return PlainTextResponse(content)
        else:
            return JSONResponse(
                status_code=404, 
                content={"error": f"CSV file not found: {filename}"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": f"Error reading CSV file: {str(e)}"}
        )

# Contract processing endpoints
@app.post("/upload-contract/")
async def upload_contract(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "message": "File uploaded successfully"}

class ProcessInput(BaseModel):
    filename: str

@app.post("/process-contract/")
async def process_contract(input: ProcessInput):
    file_path = os.path.join(UPLOAD_FOLDER, input.filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}

    try:
        # Process the contract using your logic
        existing_missing, contract_content, additional_info = process_contract_content(file_path)
        
        return {
            "existing_missing": existing_missing,
            "contract_content": contract_content,
            "additional_info": additional_info
        }
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}

# =============================================================================
# MAIN EXECUTION
# =============================================================================


# ---- API ----
@app.post("/analyze-rfp")
async def analyze_rfp(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run your checker
        result = check_rfp_file(file_path)

        return {"success": True, "result": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)


@app.get("/files/{filename}")
async def get_file(filename: str):
    return FileResponse(os.path.join(UPLOAD_DIR, filename))
