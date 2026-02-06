import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Upload, File, AlertCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

interface FileUploadProps {
  onUploadComplete: (jobId: string) => void
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    setError('')

    if (!selectedFile.name.endsWith('.zip')) {
      setError('Please upload a ZIP file')
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB')
      return
    }

    setFile(selectedFile)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      onUploadComplete(response.data.job_id)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleUseDemoData = async () => {
    setUploading(true)
    setError('')

    try {
      // Use demo endpoint
      const response = await axios.get('/api/v1/demo-report')
      // Simulate async by wrapping in setTimeout
      setTimeout(() => {
        onUploadComplete('demo')
      }, 1000)
    } catch (err: any) {
      setError('Failed to load demo data')
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          {file ? (
            <>
              <div className="p-4 bg-primary/10 rounded-full">
                <File className="h-12 w-12 text-primary" />
              </div>
              <div>
                <p className="font-medium text-lg">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-muted rounded-full">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-lg">Drop your ZIP file here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse files
                </p>
              </div>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Select File
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          size="lg"
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Analyze Codebase
            </>
          )}
        </Button>

        <Button
          onClick={handleUseDemoData}
          disabled={uploading}
          variant="outline"
          size="lg"
        >
          View Demo Report
        </Button>
      </div>

      {/* Info */}
      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-2">What we analyze:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>RAG (Retrieval-Augmented Generation) patterns</li>
          <li>LLM API usage and integration</li>
          <li>Vector database implementations</li>
          <li>AI agent architectures</li>
          <li>Prompt engineering techniques</li>
        </ul>
      </div>
    </div>
  )
}
