from semanticscholar import SemanticScholar
import arxiv
from typing import List, Dict
import re

sch = SemanticScholar()

def extract_keywords(text: str) -> List[str]:
    """Extract potential keywords from the text."""
    # Simple keyword extraction - can be improved
    words = re.findall(r'\b\w{4,}\b', text.lower())
    return list(set(words))[:5]  # Return top 5 unique words

def search_semantic_scholar(keywords: List[str]) -> List[Dict]:
    """Search for papers using Semantic Scholar API."""
    try:
        results = []
        for keyword in keywords:
            papers = sch.search_paper(keyword, limit=5)
            for paper in papers:
                if paper not in results:
                    results.append({
                        'title': paper.title,
                        'authors': [author.name for author in paper.authors],
                        'year': paper.year,
                        'url': paper.url,
                        'abstract': paper.abstract,
                        'source': 'Semantic Scholar'
                    })
        return results
    except Exception as e:
        print(f"Error searching Semantic Scholar: {str(e)}")
        return []

def search_arxiv(keywords: List[str]) -> List[Dict]:
    """Search for papers using arXiv API."""
    try:
        results = []
        for keyword in keywords:
            search = arxiv.Search(
                query=keyword,
                max_results=5,
                sort_by=arxiv.SortCriterion.Relevance
            )
            for paper in search.results():
                results.append({
                    'title': paper.title,
                    'authors': [author.name for author in paper.authors],
                    'year': paper.published.year,
                    'url': paper.entry_id,
                    'abstract': paper.summary,
                    'source': 'arXiv'
                })
        return results
    except Exception as e:
        print(f"Error searching arXiv: {str(e)}")
        return []

def extract_references(text: str) -> List[Dict]:
    """Extract references from the document text."""
    # Common patterns for reference sections
    section_headers = [
        r'References?[\n\s]',
        r'Bibliography[\n\s]',
        r'Works Cited[\n\s]',
        r'References Cited[\n\s]'
    ]
    
    # Try to find the references section
    references_text = ""
    for header in section_headers:
        match = re.split(header, text, flags=re.IGNORECASE)
        if len(match) > 1:
            references_text = match[1]
            break
    
    if not references_text:
        return []
    
    # Split into individual references
    # Look for patterns like [1], 1., [Smith et al], etc.
    references = re.split(r'\[\d+\]|\d+\.|\[\w+\s+et\s+al\]', references_text)
    references = [ref.strip() for ref in references if ref.strip()]
    
    # Convert to structured format
    structured_refs = []
    for i, ref in enumerate(references):
        # Try to extract authors, title, year, and venue
        # This is a simple pattern - can be improved for better accuracy
        year_match = re.search(r'\(?(\d{4})\)?', ref)
        year = year_match.group(1) if year_match else None
        
        # Remove the year for cleaner title extraction
        ref_without_year = re.sub(r'\(?(\d{4})\)?', '', ref) if year else ref
        
        # Split into parts by common delimiters
        parts = [p.strip() for p in re.split(r'[,.]', ref_without_year) if p.strip()]
        
        structured_ref = {
            'index': i + 1,
            'raw_text': ref.strip(),
            'year': year,
            'title': parts[1] if len(parts) > 1 else parts[0] if parts else None,
            'authors': parts[0] if len(parts) > 1 else None,
            'venue': parts[2] if len(parts) > 2 else None
        }
        structured_refs.append(structured_ref)
    
    return structured_refs

def find_citations(text: str) -> List[Dict]:
    """Extract references from the document."""
    return extract_references(text) 