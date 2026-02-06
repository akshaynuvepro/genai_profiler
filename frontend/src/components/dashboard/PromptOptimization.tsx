import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PromptOptimization as PromptOptimizationType, ResearchPaper } from '@/types/dashboard';
import { Code, CheckCircle, XCircle, Sparkles, FlaskConical, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PromptOptimizationProps {
  optimization: PromptOptimizationType;
  papers: ResearchPaper[];
}

export function PromptOptimization({ optimization, papers }: PromptOptimizationProps) {
  const getPaperTitle = (paperId: string) => {
    const paper = papers.find(p => p.id === paperId);
    return paper ? paper.title.split(':')[0] : paperId;
  };

  return (
    <section id="prompt-optimization" className="space-y-4">
      <h2 className="text-lg font-semibold">Prompt Optimization Suggestions</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Prompt */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-destructive/30 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Current Prompt Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4 font-mono text-xs overflow-x-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap text-muted-foreground">
                  {optimization.current.template}
                </pre>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-destructive">Issues Identified:</p>
                <ul className="space-y-2">
                  {optimization.current.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Optimized Prompt */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-success/30 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Research-Backed Optimized Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-success/5 rounded-lg p-4 font-mono text-xs overflow-x-auto custom-scrollbar border border-success/20">
                <pre className="whitespace-pre-wrap text-foreground">
                  {optimization.optimized.template}
                </pre>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-success">Improvements Applied:</p>
                <div className="space-y-2">
                  {optimization.optimized.improvements.map((improvement, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-2 p-2 bg-muted/20 rounded-lg"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium">{improvement.name}</span>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                            {improvement.expectedGain}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {improvement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="text-primary">Source:</span> {getPaperTitle(improvement.paperId)}
                          {improvement.section && (
                            <span className="text-info ml-1">({improvement.section})</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* A/B Test Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-info/10 to-primary/10 border-info/30">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-info/20 rounded-lg">
                  <FlaskConical className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    Recommended A/B Test
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      {optimization.abTestRecommendation.expectedLift}
                    </Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Run {optimization.abTestRecommendation.sampleSize.toLocaleString()} test queries over {optimization.abTestRecommendation.duration}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {optimization.abTestRecommendation.metrics.map((metric, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button className="gap-2 shrink-0">
                <Code className="h-4 w-4" />
                Copy Optimized Prompt
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
