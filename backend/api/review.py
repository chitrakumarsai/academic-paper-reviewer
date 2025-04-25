from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path
import PyPDF2
from typing import Dict, List

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extract text from a PDF file."""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def analyze_paper(text: str) -> Dict[str, str]:
    """Analyze the paper using OpenAI's API."""
    try:
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": """You are an expert academic paper reviewer. 
                Analyze the paper and provide a detailed review focusing on:
                1. Summary of the paper
                2. Key contributions
                3. Methodology and approach
                4. Strengths and weaknesses
                5. Suggestions for improvement
                6. Overall assessment
                Format your response in clear sections with appropriate headings."""},
                {"role": "user", "content": text}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        return {
            "review": response.choices[0].message.content,
            "status": "success"
        }
    except Exception as e:
        return {
            "review": f"Error analyzing paper: {str(e)}",
            "status": "error"
        }

def find_citations(text: str) -> List[Dict[str, str]]:
    """Find relevant citations using Semantic Scholar and arXiv."""
    # This is a placeholder for the actual implementation
    # We'll implement this in the next step
    return [] 