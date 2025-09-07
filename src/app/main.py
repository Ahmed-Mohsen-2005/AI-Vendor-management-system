# backend/main.py
from fastapi import FastAPI, UploadFile, File
import shutil
import os
from Python_Scripts.NDA.NDA_Dates import extract_entities_from_pdf
from Python_Scripts.NDA.NDA_Signatures import annotate_pdf
from Python_Scripts.NDA.NDA_OCR import validate_nda
app = FastAPI()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/analyze-nda")
async def analyze_nda(file: UploadFile = File(...)):
    # Save file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run extractions
    entities = extract_entities_from_pdf(file_path)
    stamps = validate_nda(file_path, debug=False)
    annotated_path = os.path.join(UPLOAD_DIR, "annotated_" + file.filename)
    annotate_pdf(file_path, annotated_path, tmp_dir="./tmp")

    return {
        "entities": entities,
        "stamps": stamps,
        "annotated_pdf": annotated_path
    }
