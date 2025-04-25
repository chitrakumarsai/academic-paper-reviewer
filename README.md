# Academic Paper Reviewer

An AI-powered application that helps researchers review academic papers and find relevant citations. Built with Next.js, FastAPI, and OpenAI.

## Features

- Upload and analyze academic papers (PDF)
- Get AI-powered paper reviews
- Extract references from papers
- Modern, responsive UI with real-time feedback
- Progress tracking and upload cancellation

## Tech Stack

### Frontend
- Next.js 15.3
- React
- Tailwind CSS
- TypeScript

### Backend
- FastAPI
- Python 3.11
- OpenAI API
- PyPDF2
- Semantic Scholar API
- arXiv API

## Setup

### Backend Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Usage

1. Access the application at http://localhost:3000/dashboard
2. Upload a PDF file using drag-and-drop or file selection
3. Wait for the upload to complete
4. Click "Review Paper" to get an AI-powered analysis
5. Click "Find Citations" to extract references from the paper

## Project Structure

```
.
├── backend/
│   ├── api/
│   │   ├── citations.py
│   │   └── review.py
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── app/
    │   └── dashboard/
    │       └── page.tsx
    └── package.json
```

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT License 