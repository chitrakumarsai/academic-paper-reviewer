from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from api.routers import papers

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Academic Paper Reviewer API",
    description="API for reviewing academic papers using AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Academic Paper Reviewer API"}

# Import and include routers
# from api.routers import auth, papers, reviews
# app.include_router(auth.router)
app.include_router(papers.router, prefix="/api")
# app.include_router(reviews.router) 