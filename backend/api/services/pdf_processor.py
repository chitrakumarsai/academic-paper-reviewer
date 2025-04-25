from PyPDF2 import PdfReader
import magic
import os
from typing import Dict, List, Optional

class PDFProcessor:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.reader = PdfReader(file_path)
        self.text = ""
        self.sections: Dict[str, str] = {}

    def validate_pdf(self) -> bool:
        """Validate if the file is a PDF"""
        mime = magic.Magic(mime=True)
        file_mime = mime.from_file(self.file_path)
        return file_mime == 'application/pdf'

    def extract_text(self) -> str:
        """Extract all text from the PDF"""
        text = ""
        for page in self.reader.pages:
            text += page.extract_text() + "\n"
        self.text = text
        return text

    def extract_sections(self) -> Dict[str, str]:
        """Extract main sections from the paper"""
        if not self.text:
            self.extract_text()

        # Common section headers in academic papers
        section_headers = [
            "Abstract",
            "Introduction",
            "Related Work",
            "Methodology",
            "Methods",
            "Results",
            "Discussion",
            "Conclusion",
            "References"
        ]

        sections: Dict[str, str] = {}
        current_section = "Preamble"
        current_text = []

        lines = self.text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if line matches any section header
            is_section_header = False
            for header in section_headers:
                if line.lower().startswith(header.lower()):
                    # Save previous section
                    if current_section and current_text:
                        sections[current_section] = '\n'.join(current_text)
                    current_section = header
                    current_text = []
                    is_section_header = True
                    break

            if not is_section_header:
                current_text.append(line)

        # Save the last section
        if current_section and current_text:
            sections[current_section] = '\n'.join(current_text)

        self.sections = sections
        return sections

    def get_metadata(self) -> Dict[str, str]:
        """Extract metadata from the PDF"""
        metadata = self.reader.metadata
        return {
            "title": metadata.title or "Untitled",
            "author": metadata.author or "Unknown",
            "subject": metadata.subject or "",
            "keywords": metadata.keywords or "",
        }

    def cleanup(self):
        """Remove the temporary file"""
        if os.path.exists(self.file_path):
            os.remove(self.file_path) 