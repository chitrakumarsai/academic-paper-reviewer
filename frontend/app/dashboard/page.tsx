'use client';

import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

interface ReviewResult {
  review: string;
}

interface Citation {
  title: string;
  authors: string[];
  year: number;
  url: string;
  abstract: string;
  source: string;
  index: number;
  venue: string;
  raw_text: string;
}

interface ErrorWithName extends Error {
  name: string;
}

export default function Dashboard() {
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [isFindingCitations, setIsFindingCitations] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading...');
    setUploadProgress(0);
    setReviewResult(null);
    setCitations([]);

    // Create new AbortController for this upload
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload-paper', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadStatus('Upload successful!');
      setUploadedFilename(data.filename);
    } catch (error) {
      const typedError = error as ErrorWithName;
      if (typedError.name === 'AbortError') {
        setUploadStatus('Upload cancelled');
      } else {
        setUploadStatus('Upload failed. Please try again.');
        console.error('Upload error:', error);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleReview = async () => {
    if (!uploadedFilename) return;

    setIsReviewing(true);
    try {
      const response = await fetch('http://localhost:8000/api/review-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: uploadedFilename }),
      });

      if (!response.ok) {
        throw new Error('Review failed');
      }

      const data = await response.json();
      setReviewResult(data);
    } catch (error) {
      console.error('Review error:', error);
      setUploadStatus('Review failed. Please try again.');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleFindCitations = async () => {
    if (!uploadedFilename) return;

    setIsFindingCitations(true);
    try {
      const response = await fetch('http://localhost:8000/api/find-citations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: uploadedFilename }),
      });

      if (!response.ok) {
        throw new Error('Finding citations failed');
      }

      const data = await response.json();
      setCitations(data.citations);
    } catch (error) {
      console.error('Citation search error:', error);
      setUploadStatus('Citation search failed. Please try again.');
    } finally {
      setIsFindingCitations(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Academic Paper Reviewer Dashboard</h1>
      
      <div className="max-w-4xl mx-auto">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-8
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the PDF here ...</p>
          ) : (
            <div>
              <p className="mb-4">Drag and drop a PDF file here, or click to select a file</p>
              <p className="text-sm text-gray-500">Only PDF files are accepted</p>
            </div>
          )}
        </div>

        {uploadStatus && (
          <div className={`mb-8 p-4 rounded ${
            uploadStatus.includes('success') ? 'bg-green-100 text-green-800' : 
            uploadStatus.includes('cancelled') ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {uploadStatus}
          </div>
        )}

        {isUploading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <button
                onClick={handleCancelUpload}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
            <div className="text-sm text-gray-500 text-center">
              Uploading... {uploadProgress}%
            </div>
          </div>
        )}

        {uploadedFilename && !isReviewing && !isFindingCitations && (
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleReview}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Review Paper
            </button>
            <button
              onClick={handleFindCitations}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Find Citations
            </button>
          </div>
        )}

        {isReviewing && (
          <div className="mb-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isFindingCitations && (
          <div className="mb-8">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {reviewResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Review Results</h2>
            <div className="prose max-w-none">
              {reviewResult.review.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {citations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">References from Document</h2>
            <div className="space-y-6">
              {citations.map((citation, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold mb-2">
                    [{citation.index}] {citation.title}
                  </h3>
                  {citation.authors && (
                    <p className="text-sm text-gray-600 mb-2">
                      Authors: {citation.authors}
                    </p>
                  )}
                  {citation.year && (
                    <p className="text-sm text-gray-600 mb-2">
                      Year: {citation.year}
                    </p>
                  )}
                  {citation.venue && (
                    <p className="text-sm text-gray-600 mb-2">
                      Venue: {citation.venue}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    {citation.raw_text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 