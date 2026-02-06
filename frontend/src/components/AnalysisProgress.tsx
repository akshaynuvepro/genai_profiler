import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, CheckCircle2, FileSearch, BookOpen, Lightbulb } from 'lucide-react'
import axios from 'axios'

interface AnalysisProgressProps {
  jobId: string
  onComplete: (result: any) => void
}

export default function AnalysisProgress({ jobId, onComplete }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('Starting analysis...')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Handle demo case
    if (jobId === 'demo') {
      simulateDemoProgress()
      return
    }

    // Poll for status
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/v1/status/${jobId}`)
        const data = response.data

        setProgress(data.progress)
        setMessage(data.message)

        if (data.status === 'completed') {
          clearInterval(pollInterval)
          // Fetch full result
          const resultResponse = await axios.get(`/api/v1/result/${jobId}`)
          onComplete(resultResponse.data)
        } else if (data.status === 'failed') {
          clearInterval(pollInterval)
          setError(data.error || 'Analysis failed')
        }
      } catch (err: any) {
        clearInterval(pollInterval)
        setError('Failed to get analysis status')
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [jobId, onComplete])

  const simulateDemoProgress = async () => {
    const steps = [
      { progress: 10, message: 'Extracting files...', delay: 500 },
      { progress: 25, message: 'Parsing codebase...', delay: 800 },
      { progress: 40, message: 'Detecting GenAI techniques...', delay: 1000 },
      { progress: 60, message: 'Retrieving research papers...', delay: 1200 },
      { progress: 75, message: 'Extracting insights...', delay: 1000 },
      { progress: 90, message: 'Generating recommendations...', delay: 800 },
      { progress: 100, message: 'Analysis complete!', delay: 500 },
    ]

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay))
      setProgress(step.progress)
      setMessage(step.message)
    }

    // Load demo data
    const response = await axios.get('/api/v1/demo-report')
    onComplete(response.data)
  }

  const getStageInfo = () => {
    if (progress < 20) return { icon: FileSearch, text: 'Analyzing code structure' }
    if (progress < 50) return { icon: FileSearch, text: 'Detecting patterns' }
    if (progress < 70) return { icon: BookOpen, text: 'Searching research papers' }
    return { icon: Lightbulb, text: 'Generating insights' }
  }

  const stage = getStageInfo()
  const StageIcon = stage.icon

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          Analyzing Your Codebase
        </CardTitle>
        <CardDescription>
          This may take 1-2 minutes. We're analyzing your code and searching academic papers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{message}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Stage Indicator */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="p-3 bg-primary/10 rounded-full">
            <StageIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">{stage.text}</p>
            <p className="text-sm text-muted-foreground">
              {progress < 50
                ? 'Examining code patterns and dependencies'
                : progress < 80
                ? 'Querying Semantic Scholar and arXiv'
                : 'Building your custom report'}
            </p>
          </div>
        </div>

        {/* Analysis Steps */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Analysis Pipeline:</p>
          {[
            { step: 'Parse codebase', threshold: 20 },
            { step: 'Detect GenAI techniques', threshold: 40 },
            { step: 'Retrieve research papers', threshold: 60 },
            { step: 'Extract insights', threshold: 80 },
            { step: 'Generate recommendations', threshold: 100 },
          ].map(({ step, threshold }) => (
            <div key={step} className="flex items-center gap-2">
              {progress >= threshold ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 border-2 border-muted-foreground rounded-full" />
              )}
              <span
                className={`text-sm ${
                  progress >= threshold ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
