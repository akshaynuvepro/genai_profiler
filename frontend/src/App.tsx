import { useState } from 'react'
import FileUpload from './components/FileUpload'
import AnalysisProgress from './components/AnalysisProgress'
import ReportView from './components/ReportView'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card'
import { Separator } from './components/ui/separator'
import { FileSearch, Sparkles } from 'lucide-react'

type AppState = 'upload' | 'analyzing' | 'complete'

interface AnalysisResult {
  timestamp: string
  codebase_name: string
  analysis_duration: number
  overall_risk: string
  critical_issues: number
  techniques_detected: number
  papers_analyzed: number
  techniques: any[]
  failure_modes: any[]
  recommendations: any[]
  papers: any[]
  confidence_notes: string[]
  limitations: string[]
}

function App() {
  const [state, setState] = useState<AppState>('upload')
  const [jobId, setJobId] = useState<string>('')
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleUploadComplete = (id: string) => {
    setJobId(id)
    setState('analyzing')
  }

  const handleAnalysisComplete = (data: AnalysisResult) => {
    setResult(data)
    setState('complete')
  }

  const handleReset = () => {
    setState('upload')
    setJobId('')
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              GenAI Profiler
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Research-aware profiling for GenAI architectures. Get evidence-based recommendations
            for your RAG systems, LLM APIs, and AI agents.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {state === 'upload' && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileSearch className="h-6 w-6" />
                  Upload Your Codebase
                </CardTitle>
                <CardDescription>
                  Upload a ZIP file of your GenAI project. We'll analyze the architecture, detect
                  techniques, and provide research-backed recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onUploadComplete={handleUploadComplete} />
              </CardContent>
            </Card>
          )}

          {state === 'analyzing' && (
            <AnalysisProgress jobId={jobId} onComplete={handleAnalysisComplete} />
          )}

          {state === 'complete' && result && (
            <ReportView result={result} onReset={handleReset} />
          )}
        </div>

        {/* Footer */}
        <Separator className="my-12" />
        <div className="text-center text-sm text-muted-foreground">
          <p>
            GenAI Profiler v1.0 - Built for the hackathon to help engineering teams make
            better architectural decisions
          </p>
          <p className="mt-2">
            Powered by Semantic Scholar, arXiv, and advanced code analysis
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
