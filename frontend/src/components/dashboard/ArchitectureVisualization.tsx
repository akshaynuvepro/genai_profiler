import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArchitectureComparison, ResearchPaper } from '@/types/dashboard';
import { MermaidDiagram } from './MermaidDiagram';
import { GitCompare, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArchitectureVisualizationProps {
  architecture: ArchitectureComparison;
  papers: ResearchPaper[];
}

export function ArchitectureVisualization({ architecture, papers }: ArchitectureVisualizationProps) {
  const [view, setView] = useState<'diff' | 'cost' | 'latency'>('diff');
  const referencedPapers = papers.filter(p => architecture.researchBasis.includes(p.id));

  const getTotalLatency = (nodes: typeof architecture.current.nodes) => {
    return nodes.reduce((sum, node) => sum + (node.latencyMs || 0), 0);
  };

  const getTotalCost = (nodes: typeof architecture.current.nodes) => {
    return nodes.reduce((sum, node) => sum + (node.costPer1k || 0), 0);
  };

  return (
    <section id="architecture" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold">Architecture Visualization</h2>
        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="diff" className="text-xs gap-1.5">
              <GitCompare className="h-3 w-3" />
              Diff View
            </TabsTrigger>
            <TabsTrigger value="cost" className="text-xs gap-1.5">
              <DollarSign className="h-3 w-3" />
              Cost Flow
            </TabsTrigger>
            <TabsTrigger value="latency" className="text-xs gap-1.5">
              <Clock className="h-3 w-3" />
              Latency
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Current Architecture */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Current: {architecture.current.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{architecture.current.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <MermaidDiagram 
              chart={architecture.current.mermaidCode}
              className="min-h-[250px]"
            />

            {view === 'latency' && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">Total Latency</span>
                <Badge variant="outline">{getTotalLatency(architecture.current.nodes)}ms</Badge>
              </div>
            )}

            {view === 'cost' && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">Cost per 1K Requests</span>
                <Badge variant="outline">${getTotalCost(architecture.current.nodes).toFixed(2)}</Badge>
              </div>
            )}

            {architecture.current.weaknesses && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-destructive">Weaknesses:</p>
                <ul className="space-y-1">
                  {architecture.current.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <AlertCircle className="h-3 w-3 text-destructive shrink-0 mt-0.5" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proposed Architecture */}
        <Card className="border-success/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Proposed: {architecture.proposed.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{architecture.proposed.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <MermaidDiagram 
              chart={architecture.proposed.mermaidCode}
              className="min-h-[250px]"
            />

            {view === 'latency' && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">Total Latency</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getTotalLatency(architecture.proposed.nodes)}ms</Badge>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    +{getTotalLatency(architecture.proposed.nodes) - getTotalLatency(architecture.current.nodes)}ms
                  </Badge>
                </div>
              </div>
            )}

            {view === 'cost' && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm">Cost per 1K Requests</span>
                <Badge variant="outline">${getTotalCost(architecture.proposed.nodes).toFixed(2)}</Badge>
              </div>
            )}

            {architecture.proposed.strengths && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-success">Improvements:</p>
                <ul className="space-y-1">
                  {architecture.proposed.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-success shrink-0 mt-0.5" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Research Basis */}
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-medium mb-2">Research Basis:</p>
              <div className="flex flex-wrap gap-2">
                {referencedPapers.map((paper) => (
                  <Badge key={paper.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                    {paper.title.split(':')[0]}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
