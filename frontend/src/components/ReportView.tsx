import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Info,
  FileCode,
  BookOpen,
  Lightbulb,
  Download,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'

interface ReportViewProps {
  result: any
  onReset: () => void
}

export default function ReportView({ result, onReset }: ReportViewProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'Critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'Important':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600" />
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'Critical':
        return 'border-l-4 border-red-500 bg-red-50'
      case 'Important':
        return 'border-l-4 border-yellow-500 bg-yellow-50'
      default:
        return 'border-l-4 border-blue-500 bg-blue-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analysis Report</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Executive Summary
          </CardTitle>
          <CardDescription>
            {result.codebase_name} - Analyzed in {result.analysis_duration.toFixed(1)}s
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Overall Risk</p>
              <Badge
                className={`text-lg px-3 py-1 ${getRiskColor(result.overall_risk)}`}
                variant="outline"
              >
                {result.overall_risk}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Critical Issues</p>
              <p className="text-2xl font-bold text-red-600">{result.critical_issues}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Techniques Detected</p>
              <p className="text-2xl font-bold text-primary">{result.techniques_detected}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Papers Analyzed</p>
              <p className="text-2xl font-bold text-blue-600">{result.papers_analyzed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Detected GenAI Techniques
          </CardTitle>
          <CardDescription>
            Architecture patterns and libraries identified in your codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.techniques.map((tech: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{tech.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{tech.description}</p>
                  </div>
                  <Badge
                    variant={
                      tech.confidence === 'High'
                        ? 'default'
                        : tech.confidence === 'Medium'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {tech.confidence} Confidence
                  </Badge>
                </div>

                {tech.indicators.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Detection Signals:</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.indicators.map((indicator: string, i: number) => (
                        <Badge key={i} variant="outline">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tech.locations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Code Locations:</p>
                    <div className="space-y-1">
                      {tech.locations.slice(0, 3).map((loc: string, i: number) => (
                        <code key={i} className="block text-xs bg-muted px-2 py-1 rounded">
                          {loc}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Research-Backed Recommendations
          </CardTitle>
          <CardDescription>
            Prioritized actions based on academic research and your codebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {result.recommendations.map((rec: any, idx: number) => (
              <AccordionItem key={idx} value={`rec-${idx}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className={`flex items-start gap-3 w-full p-3 rounded-lg ${getRecommendationColor(rec.type)}`}>
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Impact: {rec.impact}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Effort: {rec.effort}
                        </Badge>
                      </div>
                      <p className="font-semibold">{rec.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-6 py-4 space-y-4">
                    {/* Action Steps */}
                    <div>
                      <h5 className="font-semibold mb-2">Action Steps:</h5>
                      <ol className="list-decimal list-inside space-y-1">
                        {rec.action_steps.map((step: string, i: number) => (
                          <li key={i} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Code Example */}
                    {rec.code_example && (
                      <div>
                        <h5 className="font-semibold mb-2">Code Example:</h5>
                        <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                          <code>{rec.code_example}</code>
                        </pre>
                      </div>
                    )}

                    {/* Evidence */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Research Evidence
                      </h5>
                      <p className="text-sm mb-1">
                        <span className="font-medium">Paper:</span> {rec.evidence.paper} ({rec.evidence.year})
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Finding:</span> {rec.evidence.finding}
                      </p>
                    </div>

                    {/* Code Locations */}
                    {rec.code_locations.length > 0 && (
                      <div>
                        <h5 className="font-semibold mb-2">Relevant Code:</h5>
                        <div className="space-y-1">
                          {rec.code_locations.map((loc: string, i: number) => (
                            <code key={i} className="block text-xs bg-muted px-2 py-1 rounded">
                              {loc}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Caveats */}
                    {rec.caveats.length > 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Important Notes</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1 mt-2">
                            {rec.caveats.map((caveat: string, i: number) => (
                              <li key={i} className="text-sm">{caveat}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Confidence */}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Confidence: {rec.confidence}</Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Research Papers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Research Papers Referenced
          </CardTitle>
          <CardDescription>
            Academic papers used to generate recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.papers.slice(0, 5).map((paper: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{paper.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paper.authors.join(', ')} ({paper.year})
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {paper.is_experimental && (
                      <Badge variant="default">Experimental</Badge>
                    )}
                    <Badge variant="outline">{paper.citation_count} citations</Badge>
                  </div>
                </div>
                <p className="text-sm mt-2 line-clamp-3">{paper.abstract}</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 px-0"
                  onClick={() => window.open(paper.url, '_blank')}
                >
                  View Paper <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Methodology & Limitations */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Confidence Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.confidence_notes.map((note: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.limitations.map((limitation: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{limitation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
