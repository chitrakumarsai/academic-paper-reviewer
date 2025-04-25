'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'

interface PaperUploadProps {
  onUploadComplete: (file: File) => void
  onError: (error: string) => void
}

export default function PaperUpload({ onUploadComplete, onError }: PaperUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    validateAndProcessFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndProcessFile(file)
    }
  }

  const validateAndProcessFile = (file: File) => {
    if (!file) {
      onError('No file selected')
      return
    }

    if (file.type !== 'application/pdf') {
      onError('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      onError('File size must be less than 10MB')
      return
    }

    onUploadComplete(file)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <div className="mt-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50"
        >
          <span>Upload a paper</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".pdf"
            onChange={handleFileSelect}
          />
        </label>
        <p className="mt-2 text-sm text-gray-600">or drag and drop</p>
        <p className="mt-1 text-xs text-gray-500">PDF up to 10MB</p>
      </div>
    </div>
  )
} 