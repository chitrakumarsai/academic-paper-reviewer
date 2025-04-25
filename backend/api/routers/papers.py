from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import Dict, List
import os
from datetime import datetime
from api.services.pdf_processor import PDFProcessor

router = APIRouter(
    prefix="/papers",
    tags=["papers"],
    responses={404: {"description": "Not found"}},
)

@router.post("/upload")
async def upload_paper(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Create uploads directory if it doesn't exist
    os.makedirs("uploads", exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join("uploads", filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    
    # Process the PDF
    processor = PDFProcessor(file_path)
    
    if not processor.validate_pdf():
        processor.cleanup()
        raise HTTPException(status_code=400, detail="Invalid PDF file")
    
    # Extract metadata and sections
    metadata = processor.get_metadata()
    sections = processor.extract_sections()
    
    # Clean up the file in the background
    if background_tasks:
        background_tasks.add_task(processor.cleanup)
    
    return {
        "message": "File uploaded and processed successfully",
        "filename": filename,
        "metadata": metadata,
        "sections": sections
    }

@router.post("/review")
async def review_paper(paper_id: str):
    # TODO: Implement AI review logic
    # This will be implemented later with OpenAI integration
    return {"message": "Review in progress", "paper_id": paper_id}

@router.get("/citations")
async def get_citations(paper_id: str):
    # TODO: Implement citation search logic
    # This will be implemented later with Semantic Scholar integration
    return {"message": "Citations search in progress", "paper_id": paper_id} 