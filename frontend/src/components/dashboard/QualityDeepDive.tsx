import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MetricComparison } from '@/types/dashboard';
import { formatPercentage } from '@/data/mockData';
import { Target, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface QualityDeepDiveProps {
  comparison: MetricComparison;
}

export function QualityDeepDive({ comparison }: QualityDeepDiveProps) {
  const { current, proposed, sota } = comparison;

  const radarData = [
    { 
      metric: 'Accuracy', 
      current: current.quality.accuracy, 
      proposed: proposed.quality.accuracy,
      sota: sota.quality.accuracy || 94,
      fullMark: 100 
    },
    { 
      metric: 'Low Hallucination', 
      current: 100 - current.quality.hallucinationRate, 
      proposed: 100 - proposed.quality.hallucinationRate,
      sota: 100 - (sota.quality.hallucinationRate || 4),
      fullMark: 100 
    },
    { 
      metric: 'Satisfaction', 
      current: current.quality.userSatisfaction, 
      proposed: proposed.quality.userSatisfaction,
      sota: 92,
      fullMark: 100 
    },
    { 
      metric: 'Precision', 
      current: current.quality.retrievalPrecision, 
      proposed: proposed.quality.retrievalPrecision,
      sota: sota.quality.retrievalPrecision || 91,
      fullMark: 100 
    },
    { 
      metric: 'Relevance', 
      current: current.quality.answerRelevance, 
      proposed: proposed.quality.answerRelevance,
      sota: sota.quality.answerRelevance || 93,
      fullMark: 100 
    },
  ];

  const benchmarkData = [
    { 
      metric: 'Retrieval Precision', 
      current: current.quality.retrievalPrecision,
      proposed: proposed.quality.retrievalPrecision,
      sota: sota.quality.retrievalPrecision || 91,
      paper: 'Self-RAG, Table 3'
    },
    { 
      metric: 'Answer Relevance', 
      current: current.quality.answerRelevance,
      proposed: proposed.quality.answerRelevance,
      sota: sota.quality.answerRelevance || 93,
      paper: 'CRAG, Table 2'
    },
    { 
      metric: 'Hallucination Rate', 
      current: current.quality.hallucinationRate,
      proposed: proposed.quality.hallucinationRate,
      sota: sota.quality.hallucinationRate || 4,
      paper: 'Self-RAG, Table 4',
      inverse: true
    },
    { 
      metric: 'Factual Accuracy', 
      current: current.quality.factualAccuracy,
      proposed: proposed.quality.factualAccuracy,
      sota: sota.quality.factualAccuracy || 95,
      paper: 'Chain-of-Note, Table 1'
    },
  ];

  const getGapStatus = (gap: number, inverse: boolean = false) => {
    const adjustedGap = inverse ? -gap : gap;
    if (adjustedGap <= 3) return { label: 'Acceptable', class: 'bg-green-100 text-green-700 border-green-300' };
    if (adjustedGap <= 7) return { label: 'Monitor', class: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    return { label: 'Gap', class: 'bg-red-100 text-red-700 border-red-300' };
  };

  return (
    <section id="quality-deep-dive" className="space-y-4">
      <h2 className="text-lg font-semibold">Quality Deep Dive</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Quality Radar Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    />
                    <Radar 
                      name="Current" 
                      dataKey="current" 
                      stroke="hsl(var(--chart-current))" 
                      fill="hsl(var(--chart-current))" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="Proposed" 
                      dataKey="proposed" 
                      stroke="hsl(var(--chart-proposed))" 
                      fill="hsl(var(--chart-proposed))" 
                      fillOpacity={0.3} 
                    />
                    <Radar 
                      name="SOTA" 
                      dataKey="sota" 
                      stroke="hsl(var(--chart-sota))" 
                      fill="hsl(var(--chart-sota))" 
                      fillOpacity={0.1}
                      strokeDasharray="5 5"
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benchmark Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                Benchmark Comparison
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>SOTA values from referenced papers</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Metric</TableHead>
                    <TableHead className="text-xs text-center">Current</TableHead>
                    <TableHead className="text-xs text-center">Proposed</TableHead>
                    <TableHead className="text-xs text-center">SOTA</TableHead>
                    <TableHead className="text-xs text-center">Gap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benchmarkData.map((row) => {
                    const gap = row.sota - row.proposed;
                    const status = getGapStatus(gap, row.inverse);
                    const improved = row.inverse 
                      ? row.proposed < row.current 
                      : row.proposed > row.current;
                    
                    return (
                      <TableRow key={row.metric}>
                        <TableCell className="text-xs">
                          <Tooltip>
                            <TooltipTrigger className="cursor-help underline decoration-dotted">
                              {row.metric}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Source: {row.paper}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">
                          {formatPercentage(row.current)}
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          <span className="flex items-center justify-center gap-1">
                            {improved ? (
                              <TrendingUp className="h-3 w-3 text-success" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-destructive" />
                            )}
                            {formatPercentage(row.proposed)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs font-medium">
                          {formatPercentage(row.sota)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={`text-xs ${status.class}`}>
                            {row.inverse ? '+' : '-'}{Math.abs(gap)}% {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Note:</span> SOTA values represent 
                  best-case results from papers. Expect 70-85% of claimed improvements in production.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
