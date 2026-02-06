import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Diagnostic, ResearchPaper } from '@/types/dashboard';
import { AlertTriangle, Zap, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResearchDiagnosticProps {
  diagnostic: Diagnostic;
  papers: ResearchPaper[];
}

export function ResearchDiagnostic({ diagnostic, papers }: ResearchDiagnosticProps) {
  const referencedPapers = papers.filter(p => diagnostic.paperReferences.includes(p.id));

  return (
    <section id="research-diagnostic" className="space-y-4">
      <h2 className="text-lg font-semibold">Research Diagnostic</h2>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* What You Built */}
        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              What's Failing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bottleneck Severity</span>
                <span className="text-sm text-destructive font-semibold">{diagnostic.severityScore}%</span>
              </div>
              <Progress value={diagnostic.severityScore} className="h-2 bg-destructive/20" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Current Bottleneck:</p>
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-sm font-semibold text-destructive">{diagnostic.currentBottleneck}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Impacted Metrics:</p>
              <div className="flex flex-wrap gap-2">
                {diagnostic.impactedMetrics.map((metric, idx) => (
                  <Badge key={idx} variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    {metric}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Root Cause Analysis */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-primary" />
              Root Cause Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm leading-relaxed">{diagnostic.rootCause}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                Research Backing:
              </p>
              <div className="space-y-2">
                {referencedPapers.map((paper) => (
                  <div 
                    key={paper.id}
                    className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg text-xs"
                  >
                    <ArrowRight className="h-3 w-3 text-primary" />
                    <span className="font-medium truncate">{paper.title.split(':')[0]}</span>
                    <Badge variant="outline" className="ml-auto shrink-0">
                      {paper.venue}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-success/10 rounded-lg border border-success/30">
              <p className="text-xs text-muted-foreground mb-1">Academic Consensus</p>
              <p className="text-sm text-success font-medium">
                Papers #{referencedPapers.map((_, i) => i + 1).join(', #')} address this exact failure mode
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
