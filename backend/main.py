from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from typing import List
import shutil
from pathlib import Path
from api.review import extract_text_from_pdf, analyze_paper
from api.citations import find_citations

class FileRequest(BaseModel):
    filename: str

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/api/upload-paper")
async def upload_paper(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Save the file
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return JSONResponse(
            status_code=200,
            content={"message": "File uploaded successfully", "filename": file.filename}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/review-paper")
async def review_paper(request: FileRequest):
    try:
        file_path = UPLOAD_DIR / request.filename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Extract text from PDF
        text = extract_text_from_pdf(file_path)
        
        # Analyze the paper
        review_result = analyze_paper(text)
        
        if review_result["status"] == "error":
            raise HTTPException(status_code=500, detail=review_result["review"])
        
        return JSONResponse(
            status_code=200,
            content={"review": review_result["review"]}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/find-citations")
async def get_citations(request: FileRequest):
    try:
        file_path = UPLOAD_DIR / request.filename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Extract text from PDF
        text = extract_text_from_pdf(file_path)
        
        # Find citations
        citations = find_citations(text)
        
        return JSONResponse(
            status_code=200,
            content={"citations": citations}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 