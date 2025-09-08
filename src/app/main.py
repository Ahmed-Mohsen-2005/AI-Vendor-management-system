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
