import os, uuid, shutil, re, csv
from typing import List
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

import pdfplumber
from PIL import Image
import pytesseract

# Set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}

# ---------------------------
# Helper functions from invoice.py
# ---------------------------

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
    # if results:
    #     with open(csv_filename, mode="w", newline="", encoding="utf-8") as f:
    #         writer = csv.DictWriter(f, fieldnames=results[0].keys())
    #         writer.writeheader()
    #         writer.writerows(results)
    #     print(f"\nReport saved to: {csv_filename}")

    return {
        "PO_Total": po_total,
        "Final_Remaining": remaining,
        "Report_File": csv_filename,
        "Results": results,
        "PO_Ref": po_ref or "Not Found"  # Changed from PO_REF to PO_Ref
    }

# ---------------------------
# API endpoint
# ---------------------------

@app.post("/process_invoices/")
async def process_invoices(po_file: UploadFile = File(...), invoices: List[UploadFile] = File(...)):
    tmp_dir = "tmp_uploads"
    os.makedirs(tmp_dir, exist_ok=True)

    # save PO file
    po_path = os.path.join(tmp_dir, f"{uuid.uuid4()}_{po_file.filename}")
    with open(po_path, "wb") as out:
        shutil.copyfileobj(po_file.file, out)

    # save invoice files
    inv_paths = []
    for inv in invoices:
        p = os.path.join(tmp_dir, f"{uuid.uuid4()}_{inv.filename}")
        with open(p, "wb") as out:
            shutil.copyfileobj(inv.file, out)
        inv_paths.append(p)

    try:
        result = check_multiple_invoices(po_path, inv_paths, csv_filename=os.path.join(tmp_dir, "report.csv"))
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

    # cleanup
    try:
        os.remove(po_path)
        for p in inv_paths:
            os.remove(p)
    except:
        pass

    return result

from fastapi.responses import FileResponse, PlainTextResponse

# ... (keep your existing code)

@app.get("/get_csv/")
async def get_csv(filename: str):
    """Serve the generated CSV file"""
    try:
        # Security check: ensure the file is in the tmp_uploads directory
        if not filename.startswith("tmp_uploads/"):
            filename = "tmp_uploads/" + filename
            
        if os.path.exists(filename):
            return FileResponse(
                filename, 
                media_type='text/csv', 
                filename=os.path.basename(filename)
            )
        else:
            return JSONResponse(
                status_code=404, 
                content={"error": f"CSV file not found: {filename}"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": f"Error serving CSV file: {str(e)}"}
        )

# Alternative: Return CSV content as text
@app.get("/get_csv_content/")
async def get_csv_content(filename: str):
    """Return CSV content as plain text"""
    try:
        # Security check: ensure the file is in the tmp_uploads directory
        if not filename.startswith("tmp_uploads/"):
            filename = "tmp_uploads/" + filename
            
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