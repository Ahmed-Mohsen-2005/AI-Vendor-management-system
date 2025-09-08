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

app = FastAPI()

# 🚀 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# # ---- Extraction helpers ----
# def extract_submission_date(text: str):
#     labeled = re.search(
#         r"(submission\s*date|due\s*date|deadline)\s*[:\-–]\s*([^\n\r]+)", text, re.I
#     )
#     if labeled:
#         return {"found": True, "value": labeled.group(2).strip(), "confidence": 95}
#     any_date = re.search(r"\d{4}[-/]\d{1,2}[-/]\d{1,2}", text)
#     if any_date:
#         return {"found": True, "value": any_date.group(0), "confidence": 60}
#     return {"found": False, "confidence": 0}

# def extract_payment_terms(text: str):
#     match = re.search(r"(net\s*\d+\s*days?)", text, re.I)
#     if match:
#         return {"found": True, "value": match.group(1), "confidence": 80}
#     return {"found": False, "confidence": 0}

# def extract_currency(text: str):
#     for c in ["USD", "EUR", "EGP", "SAR", "AED", "GBP"]:
#         if c in text:
#             return {"found": True, "value": c, "confidence": 85}
#     for sym, code in {"$": "USD", "€": "EUR", "£": "GBP"}.items():
#         if sym in text:
#             return {"found": True, "value": code, "confidence": 70}
#     return {"found": False, "confidence": 0}

# def extract_timeline(text: str):
#     match = re.search(r"(\d+\s*(days?|weeks?|months?))", text, re.I)
#     if match:
#         return {"found": True, "value": match.group(1), "confidence": 70}
#     return {"found": False, "confidence": 0}

# def extract_governing_law(text: str):
#     match = re.search(r"(law\s*of\s*[^\n\r]+)", text, re.I)
#     if match:
#         return {"found": True, "value": match.group(1), "confidence": 90}
#     return {"found": False, "confidence": 0}

# def parse_rfp(text: str):
#     return {
#         "Submission Date": extract_submission_date(text),
#         "Payment Terms": extract_payment_terms(text),
#         "Currency": extract_currency(text),
#         "Timeline": extract_timeline(text),
#         "Governing Law": extract_governing_law(text),
#     }

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

@app.post("/analyze-nda")
async def analyze_nda(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    entities = extract_entities_from_pdf(file_path)
    stamps = validate_nda(file_path, debug=False)
    annotated_path = os.path.join(UPLOAD_DIR, "annotated_" + file.filename)
    annotate_pdf(file_path, annotated_path, tmp_dir="./tmp")

    return {
        "entities": entities,
        "stamps": stamps,
        "annotated_pdf": f"/files/{os.path.basename(annotated_path)}"
    }

@app.get("/files/{filename}")
async def get_file(filename: str):
    return FileResponse(os.path.join(UPLOAD_DIR, filename))
