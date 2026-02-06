import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ResearchSynthesis as ResearchSynthesisType, ResearchPaper } from '@/types/dashboard';
import { BookOpen, ChevronDown, ChevronUp, CheckCircle, AlertCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResearchSynthesisProps {
  synthesis: ResearchSynthesisType;
  papers: ResearchPaper[];
}

export function ResearchSynthesis({ synthesis, papers }: ResearchSynthesisProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPaperTitle = (paperId: string) => {
    const paper = papers.find(p => p.id === paperId);
    return paper ? paper.title.split(':')[0] : paperId;
  };

  return (
    <section id="research-synthesis" className="space-y-4">
      <h2 className="text-lg font-semibold">Research Synthesis Report</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Academic Deep Dive
                  <Badge variant="outline" className="ml-2">
                    {papers.length} papers synthesized
                  </Badge>
                </CardTitle>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isOpen ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Expand
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </CardHeader>

            <CollapsibleContent>
              <CardContent className="space-y-6 pt-2">
                {/* What Research Says */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    What Research Says (Consensus)
                  </h4>
                  <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <ul className="space-y-2">
                      {synthesis.consensus.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Conflicting Evidence */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    Conflicting Evidence
                  </h4>
                  <div className="space-y-3">
                    {synthesis.conflictingEvidence.map((conflict, idx) => (
                      <div key={idx} className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                        <p className="text-sm font-medium mb-2">{conflict.topic}</p>
                        <div className="space-y-2 mb-3">
                          {conflict.positions.map((position, posIdx) => (
                            <div key={posIdx} className="flex items-start gap-2 text-xs">
                              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                              <div>
                                <span className="text-primary font-medium">{getPaperTitle(position.paperId)}:</span>
                                <span className="text-muted-foreground ml-1">{position.position}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 bg-background/50 rounded border border-border">
                          <p className="text-xs">
                            <span className="text-success font-medium">Recommendation:</span>
                            <span className="text-muted-foreground ml-1">{conflict.recommendation}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's Missing */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-info" />
                    What's Missing from Research
                  </h4>
                  <div className="p-4 bg-info/5 rounded-lg border border-info/20">
                    <ul className="space-y-2">
                      {synthesis.gaps.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <HelpCircle className="h-4 w-4 text-info shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{gap}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 p-2 bg-background/50 rounded border border-border">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">What This Means:</span> You'll need to pioneer these areas. 
                        Budget 20% extra time for custom evaluation harness, drift detection monitoring, and privacy-preserving adaptations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Caveats */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Important Caveats
                  </h4>
                  <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <ul className="space-y-2">
                      {synthesis.caveats.map((caveat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <span>{caveat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>

          {/* Preview when collapsed */}
          {!isOpen && (
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {synthesis.consensus.length} consensus points
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {synthesis.conflictingEvidence.length} areas of debate
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  {synthesis.gaps.length} research gaps
                </Badge>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </section>
  );
}
