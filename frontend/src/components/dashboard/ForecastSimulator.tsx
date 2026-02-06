import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useForecast } from '@/hooks/useForecast';
import { formatCurrency } from '@/data/mockData';
import { Calculator, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

export function ForecastSimulator() {
  const { params, updateParam, results, projectionData } = useForecast();

  return (
    <section id="forecast-simulator" className="space-y-4">
      <h2 className="text-lg font-semibold">Interactive Forecast Simulator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Scenario Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Traffic Volume */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Daily Traffic Volume</label>
                  <Badge variant="outline">{params.trafficVolume.toLocaleString()} req/day</Badge>
                </div>
                <Slider
                  value={[params.trafficVolume]}
                  onValueChange={([value]) => updateParam('trafficVolume', value)}
                  min={10000}
                  max={500000}
                  step={10000}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10K</span>
                  <span>500K</span>
                </div>
              </div>

              {/* Implementation Percentage */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Implementation Coverage</label>
                  <Badge variant="outline">{params.implementationPercentage}%</Badge>
                </div>
                <Slider
                  value={[params.implementationPercentage]}
                  onValueChange={([value]) => updateParam('implementationPercentage', value)}
                  min={10}
                  max={100}
                  step={5}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Pilot (10%)</span>
                  <span>Full (100%)</span>
                </div>
              </div>

              {/* Improvement Factor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Performance Multiplier</label>
                  <Badge variant="outline">{params.improvementFactor.toFixed(1)}x</Badge>
                </div>
                <Slider
                  value={[params.improvementFactor * 100]}
                  onValueChange={([value]) => updateParam('improvementFactor', value / 100)}
                  min={50}
                  max={150}
                  step={10}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative (0.5x)</span>
                  <span>Optimistic (1.5x)</span>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Adjust parameters to model different adoption scenarios. 
                  Results update in real-time based on research benchmarks.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Cumulative ROI Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(v) => `M${v}`}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Month ${label}`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="best" 
                      stroke="hsl(var(--success))" 
                      fill="url(#colorBest)"
                      name="Best Case"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expected" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#colorExpected)"
                      name="Expected"
                      strokeWidth={2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="worst" 
                      stroke="hsl(var(--warning))" 
                      fill="url(#colorWorst)"
                      name="Worst Case"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20 text-center">
                  <p className="text-xs text-success font-medium">Best Case</p>
                  <p className="text-lg font-bold">{formatCurrency(results.best.monthlySavings)}/mo</p>
                  <p className="text-xs text-muted-foreground">ROI in {results.best.roiMonths.toFixed(1)} mo</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
                  <p className="text-xs text-primary font-medium">Expected</p>
                  <p className="text-lg font-bold">{formatCurrency(results.expected.monthlySavings)}/mo</p>
                  <p className="text-xs text-muted-foreground">ROI in {results.expected.roiMonths.toFixed(1)} mo</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 text-center">
                  <p className="text-xs text-warning font-medium">Worst Case</p>
                  <p className="text-lg font-bold">{formatCurrency(results.worst.monthlySavings)}/mo</p>
                  <p className="text-xs text-muted-foreground">ROI in {results.worst.roiMonths.toFixed(1)} mo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
