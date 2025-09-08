# import re
# import PyPDF2
# import csv

# def extract_text_from_pdf(file_path):
#     """Extract text from a PDF file page by page"""
#     text = ""
#     try:
#         with open(file_path, "rb") as f:
#             reader = PyPDF2.PdfReader(f)
#             for page in reader.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#     except Exception as e:
#         print("❌ Error reading PDF:", e)
#     return text

# def check_contract(file_path, output_file="contract_clauses_status.csv", duration_file="contract_duration.csv"):
#     # Arabic clauses mapped to English
#     clause_map = {
#         "شروط الدفع": "Payment Terms",
#         "الغرامات والجزاءات": "Penalties",
#         "أحكام العقد": "Contract Provisions",
#         "مدة العقد": "Contract Duration"
#     }

#     clause_content = {eng: "" for eng in clause_map.values()}
#     current_clause = None

#     try:
#         # 🔹 Extract text from PDF
#         pdf_text = extract_text_from_pdf(file_path)
#         lines = pdf_text.split("\n")

#         for line in lines:
#             trimmed = line.strip()
#             normalized = re.sub(r"^[0-9.\-:()]+", "", trimmed).strip()

#             # ✅ Check if line matches one of the Arabic clauses
#             for ar_clause, en_clause in clause_map.items():
#                 if normalized.startswith(ar_clause):
#                     current_clause = en_clause
#                     clause_content[current_clause] = ""  # reset content
#                     break
#             else:
#                 if current_clause:
#                     if normalized.startswith("البند"):  # start of a new clause
#                         current_clause = None
#                     else:
#                         if clause_content[current_clause]:
#                             clause_content[current_clause] += " " + trimmed
#                         else:
#                             clause_content[current_clause] = trimmed

#         # ✅ Write results to main CSV with English names + English status
#         with open(output_file, "w", encoding="utf-8-sig", newline="") as csvfile:
#             writer = csv.writer(csvfile)
#             writer.writerow(["Clause", "Status"])
#             for en_clause in clause_map.values():
#                 content = clause_content.get(en_clause)
#                 status = "Present" if content else "Missing"
#                 writer.writerow([en_clause, status])

#         print(f"✅ Main table saved as {output_file}")

#         # ✅ If Contract Duration exists, save it separately
#         duration_text = clause_content.get("Contract Duration", "")
#         if duration_text:
#             with open(duration_file, "w", encoding="utf-8-sig", newline="") as csvfile:
#                 writer = csv.writer(csvfile)
#                 writer.writerow(["Clause", "Content"])
#                 writer.writerow(["Contract Duration", duration_text])
#             print(f"✅ Contract Duration saved as {duration_file}")
#         else:
#             print("⚠ No Contract Duration found, so no separate file created.")

#     except Exception as e:
#         print("Error processing contract:", e)


# if __name__ == "_main_":
#     check_contract("contractnew.pdf")

# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import shutil
# import os
# import re
# import PyPDF2
# import csv
# import json
# from typing import Dict, List, Tuple

# app = FastAPI()

# # Allow CORS for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # restrict in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# UPLOAD_FOLDER = "uploaded_files"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# def extract_text_from_pdf(file_path: str) -> str:
#     """Extract text from a PDF file page by page"""
#     text = ""
#     try:
#         with open(file_path, "rb") as f:
#             reader = PyPDF2.PdfReader(f)
#             for page in reader.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#     except Exception as e:
#         print("❌ Error reading PDF:", e)
#     return text

# def process_contract_content(file_path: str) -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
#     """Process contract and return existing/missing data and contract content"""
#     # Arabic clauses mapped to English
#     clause_map = {
#         "شروط الدفع": "Payment Terms",
#         "الغرامات والجزاءات": "Penalties",
#         "أحكام العقد": "Contract Provisions",
#         "مدة العقد": "Contract Duration"
#     }

#     clause_content = {eng: "" for eng in clause_map.values()}
#     current_clause = None

#     # Extract text from PDF
#     pdf_text = extract_text_from_pdf(file_path)
#     lines = pdf_text.split("\n")

#     for line in lines:
#         trimmed = line.strip()
#         normalized = re.sub(r"^[0-9.\-:()]+", "", trimmed).strip()

#         # Check if line matches one of the Arabic clauses
#         for ar_clause, en_clause in clause_map.items():
#             if normalized.startswith(ar_clause):
#                 current_clause = en_clause
#                 clause_content[current_clause] = ""  # reset content
#                 break
#         else:
#             if current_clause:
#                 if normalized.startswith("البند"):  # start of a new clause
#                     current_clause = None
#                 else:
#                     if clause_content[current_clause]:
#                         clause_content[current_clause] += " " + trimmed
#                     else:
#                         clause_content[current_clause] = trimmed

#     # Prepare data for response
#     existing_missing = []
#     contract_content = []

#     for en_clause in clause_map.values():
#         content = clause_content.get(en_clause)
#         status = "Exists" if content else "Missing"
#         existing_missing.append({"item": en_clause, "status": status})
        
#         if content:
#             contract_content.append({"section": en_clause, "detail": content})

#     return existing_missing, contract_content

# @app.post("/upload-contract/")
# async def upload_contract(file: UploadFile = File(...)):
#     file_path = os.path.join(UPLOAD_FOLDER, file.filename)
#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)
#     return {"filename": file.filename, "message": "File uploaded successfully"}

# @app.post("/process-contract/")
# async def process_contract(filename: str):
#     file_path = os.path.join(UPLOAD_FOLDER, filename)
#     if not os.path.exists(file_path):
#         return {"error": "File not found"}

#     try:
#         # Process the contract using your logic
#         existing_missing, contract_content = process_contract_content(file_path)
        
#         return {
#             "existing_missing": existing_missing,
#             "contract_content": contract_content,
#         }
#     except Exception as e:
#         return {"error": f"Processing failed: {str(e)}"}


from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import re
import PyPDF2
from typing import Dict, List, Tuple
from pydantic import BaseModel

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploaded_files"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

def process_contract_content(file_path: str) -> Tuple[List[Dict[str, str]], List[Dict[str, str]]]:
    """Process contract and return existing/missing data and contract content"""
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

    # Prepare data for response
    existing_missing = []
    contract_content = []

    for en_clause in clause_map.values():
        content = clause_content.get(en_clause, "").strip()
        status = "Exists" if content else "Missing"
        existing_missing.append({"item": en_clause, "status": status})
        
        if content:
            contract_content.append({"section": en_clause, "detail": content})

    return existing_missing, contract_content

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
        existing_missing, contract_content = process_contract_content(file_path)
        
        return {
            "existing_missing": existing_missing,
            "contract_content": contract_content,
        }
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}