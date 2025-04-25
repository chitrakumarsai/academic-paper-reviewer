'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import PaperUpload from '../../components/PaperUpload'

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null)
  const [uploadedPaper, setUploadedPaper] = useState<any>(null)

  const handleUploadComplete = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8080/api/papers/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload paper')
      }

      const data = await response.json()
      setUploadedPaper(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleError = (error: string) => {
    setError(error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Paper Review Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <PaperUpload
            onUploadComplete={handleUploadComplete}
            onError={handleError}
          />

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {uploadedPaper && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Paper Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1 text-sm text-gray-900">{uploadedPaper.metadata.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Author</h3>
                  <p className="mt-1 text-sm text-gray-900">{uploadedPaper.metadata.author}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Sections</h3>
                  <ul className="mt-1 text-sm text-gray-900">
                    {Object.keys(uploadedPaper.sections).map((section) => (
                      <li key={section} className="py-1">
                        {section}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Review Options</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Review
            </button>
            <div className="text-sm text-gray-500">
              <p>• Get AI-powered feedback on your paper</p>
              <p>• Discover relevant citations</p>
              <p>• Export review report</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 