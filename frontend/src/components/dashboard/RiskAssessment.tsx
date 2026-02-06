import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskFactor, ImplementationPhase } from '@/types/dashboard';
import { AlertTriangle, Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskAssessmentProps {
  risks: RiskFactor[];
  timeline: ImplementationPhase[];
}

export function RiskAssessment({ risks, timeline }: RiskAssessmentProps) {
  const getRiskColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getCategoryIcon = (category: RiskFactor['category']) => {
    switch (category) {
      case 'academic': return '📚';
      case 'implementation': return '🔧';
      case 'operational': return '⚙️';
    }
  };

  const groupedRisks = risks.reduce((acc, risk) => {
    if (!acc[risk.category]) acc[risk.category] = [];
    acc[risk.category].push(risk);
    return acc;
  }, {} as Record<string, RiskFactor[]>);

  return (
    <section id="risk-assessment" className="space-y-4">
      <h2 className="text-lg font-semibold">Risk Assessment & Timeline</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Matrix */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(groupedRisks).map(([category, categoryRisks]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <span>{getCategoryIcon(category as RiskFactor['category'])}</span>
                    <span className="capitalize">{category} Risks</span>
                  </h4>
                  <div className="space-y-2">
                    {categoryRisks.map((risk) => (
                      <div 
                        key={risk.id}
                        className="p-3 bg-muted/20 rounded-lg border border-border hover:border-border/80 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{risk.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <Badge variant="outline" className={`text-xs ${getRiskColor(risk.impact)}`}>
                              Impact: {risk.impact}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getRiskColor(risk.likelihood)}`}>
                              Prob: {risk.likelihood}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            <span className="text-success font-medium">Mitigation:</span> {risk.mitigation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Reality Check */}
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/30">
                <p className="text-xs font-medium text-warning flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Reality Check
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Papers report "best case" results. Expect 70-85% of claimed improvement, 
                  1.5-2x implementation time, and need for domain-specific tuning.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Implementation Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Implementation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-4">
                  {timeline.map((phase, idx) => (
                    <div key={idx} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${
                        idx === 0 ? 'bg-primary border-primary' : 'bg-background border-border'
                      }`} />

                      <div className="p-3 bg-muted/20 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">{phase.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {phase.duration}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Tasks:</p>
                            <ul className="space-y-1">
                              {phase.tasks.slice(0, 3).map((task, taskIdx) => (
                                <li key={taskIdx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Deliverables:</p>
                            <div className="flex flex-wrap gap-1">
                              {phase.deliverables.map((deliverable, delIdx) => (
                                <Badge key={delIdx} variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                  <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                  {deliverable}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/30">
                <p className="text-xs font-medium text-success flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Risk Mitigation Built In
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Timeline includes kill switch capability, parallel running for 2 weeks, 
                  and success threshold at 70% of paper claims.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
