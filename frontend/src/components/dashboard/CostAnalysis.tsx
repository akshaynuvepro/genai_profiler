import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MetricComparison } from '@/types/dashboard';
import { formatCurrency } from '@/data/mockData';
import { DollarSign, TrendingDown, Calculator, Clock, AlertTriangle, Cpu, FileText, Server } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface CostAnalysisProps {
  comparison: MetricComparison;
}

export function CostAnalysis({ comparison }: CostAnalysisProps) {
  const { current, proposed } = comparison;

  const waterfallData = [
    { 
      name: 'GPU Costs', 
      current: current.cost.gpuHourlyRate * 720, // Monthly
      proposed: proposed.cost.gpuHourlyRate * 720,
      icon: Cpu
    },
    { 
      name: 'Token Costs', 
      current: current.cost.costPer1kRequests * 100, // Normalized
      proposed: proposed.cost.costPer1kRequests * 100,
      icon: FileText
    },
    { 
      name: 'Infrastructure', 
      current: current.cost.infrastructureOverhead,
      proposed: proposed.cost.infrastructureOverhead,
      icon: Server
    },
    { 
      name: 'Failed Requests', 
      current: current.cost.failedRequestCost,
      proposed: proposed.cost.failedRequestCost,
      icon: AlertTriangle
    },
  ];

  const totalCurrent = waterfallData.reduce((sum, d) => sum + d.current, 0);
  const totalProposed = waterfallData.reduce((sum, d) => sum + d.proposed, 0);
  const totalSavings = totalCurrent - totalProposed;

  const chartData = waterfallData.map(d => ({
    name: d.name,
    current: d.current,
    proposed: d.proposed,
    savings: d.current - d.proposed
  }));

  // Add totals
  chartData.push({
    name: 'Total',
    current: totalCurrent,
    proposed: totalProposed,
    savings: totalSavings
  });

  return (
    <section id="cost-analysis" className="space-y-4">
      <h2 className="text-lg font-semibold">Cost Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost Breakdown Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                Cost Comparison by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="current" fill="hsl(var(--chart-current))" name="Current" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="proposed" fill="hsl(var(--chart-proposed))" name="Proposed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-chart-current" />
                  <span className="text-xs text-muted-foreground">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-chart-proposed" />
                  <span className="text-xs text-muted-foreground">Proposed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ROI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/30 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4 text-success" />
                Research ROI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Implementation Cost</span>
                  <span className="font-semibold">$15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Monthly Savings</span>
                  <span className="font-semibold text-success">{formatCurrency(proposed.cost.monthlySavings || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payback Period</span>
                  <Badge className="bg-green-100 text-green-700 border border-green-300">
                    <Clock className="h-3 w-3 mr-1" />
                    {proposed.cost.paybackPeriodMonths} months
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="p-3 bg-success/10 rounded-lg border border-success/20 space-y-2">
                <p className="text-xs font-medium text-success">Research ROI</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Papers Reviewed</span>
                    <span>12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal R&D Saved</span>
                    <span>~240 hours ($36k)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Reduction</span>
                    <span>Using peer-reviewed methods</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Effective Cost of Adoption</p>
                <p className="text-lg font-bold text-success">
                  {formatCurrency(15000 - 36000)}
                </p>
                <p className="text-xs text-muted-foreground">
                  You're PAID $21k to implement best practices
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingDown className="h-4 w-4 text-success" />
                <span>First year savings: {formatCurrency((proposed.cost.monthlySavings || 0) * 12)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
