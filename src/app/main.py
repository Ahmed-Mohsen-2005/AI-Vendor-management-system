from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil, os
from Python_Scripts.NDA.NDA_Dates import extract_entities_from_pdf
from Python_Scripts.NDA.NDA_Signatures import annotate_pdf
from Python_Scripts.NDA.NDA_OCR import validate_nda
from fastapi.responses import FileResponse

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
