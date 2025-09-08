from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import re
import PyPDF2
from typing import Dict, List, Tuple
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# run_both.py
import subprocess
import sys

# Run both scripts
process1 = subprocess.Popen([sys.executable, "main.py"])
process2 = subprocess.Popen([sys.executable, "main2.py"])

# Wait for both to complete
process1.wait()
process2.wait()
