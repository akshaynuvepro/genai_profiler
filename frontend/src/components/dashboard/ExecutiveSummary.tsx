import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MetricComparison } from '@/types/dashboard';
import { formatCurrency, formatPercentage } from '@/data/mockData';
import { TrendingUp, TrendingDown, DollarSign, Target, Zap, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExecutiveSummaryProps {
  comparison: MetricComparison;
  paperCount: number;
  totalCitations: number;
}

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  metrics: {
    label: string;
    current: string | number;
    proposed: string | number;
    delta: string;
    isPositive: boolean;
  }[];
  accentColor: 'success' | 'primary' | 'info';
}

function MetricCard({ title, icon, metrics, accentColor }: MetricCardProps) {
  const colorClasses = {
    success: 'from-green-100/80 via-green-50 to-white border border-green-200',
    primary: 'from-blue-100/80 via-blue-50 to-white border border-blue-200',
    info: 'from-cyan-100/80 via-cyan-50 to-white border border-cyan-200'
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[accentColor]} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-xs text-muted-foreground">{metric.label}</div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{metric.current}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-semibold">{metric.proposed}</span>
              </div>
              <Badge
                variant="outline"
                className={metric.isPositive ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}
              >
                {metric.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {metric.delta}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ExecutiveSummary({ comparison, paperCount, totalCitations }: ExecutiveSummaryProps) {
  const { current, proposed } = comparison;

  const costMetrics = [
    {
      label: 'Monthly Savings',
      current: formatCurrency(0),
      proposed: formatCurrency(proposed.cost.monthlySavings || 0),
      delta: `+${formatCurrency(proposed.cost.monthlySavings || 0)}/mo`,
      isPositive: true
    },
    {
      label: 'Cost per 1K Requests',
      current: formatCurrency(current.cost.costPer1kRequests),
      proposed: formatCurrency(proposed.cost.costPer1kRequests),
      delta: '+8%',
      isPositive: false // Slightly higher but offset by savings
    },
    {
      label: 'Payback Period',
      current: 'N/A',
      proposed: `${proposed.cost.paybackPeriodMonths} months`,
      delta: 'Quick ROI',
      isPositive: true
    }
  ];

  const qualityMetrics = [
    {
      label: 'Accuracy',
      current: formatPercentage(current.quality.accuracy),
      proposed: formatPercentage(proposed.quality.accuracy),
      delta: `+${proposed.quality.accuracy - current.quality.accuracy}%`,
      isPositive: true
    },
    {
      label: 'Hallucination Rate',
      current: formatPercentage(current.quality.hallucinationRate),
      proposed: formatPercentage(proposed.quality.hallucinationRate),
      delta: `-${current.quality.hallucinationRate - proposed.quality.hallucinationRate}%`,
      isPositive: true
    },
    {
      label: 'User Satisfaction',
      current: formatPercentage(current.quality.userSatisfaction),
      proposed: formatPercentage(proposed.quality.userSatisfaction),
      delta: `+${proposed.quality.userSatisfaction - current.quality.userSatisfaction}%`,
      isPositive: true
    }
  ];

  const strategicMetrics = [
    {
      label: 'New Capabilities',
      current: '1',
      proposed: '5',
      delta: '+4 unlocked',
      isPositive: true
    },
    {
      label: 'Retrieval Precision',
      current: formatPercentage(current.quality.retrievalPrecision),
      proposed: formatPercentage(proposed.quality.retrievalPrecision),
      delta: `+${proposed.quality.retrievalPrecision - current.quality.retrievalPrecision}%`,
      isPositive: true
    },
    {
      label: 'Model Drift Risk',
      current: formatPercentage(current.risk.modelDrift),
      proposed: formatPercentage(proposed.risk.modelDrift),
      delta: `-${current.risk.modelDrift - proposed.risk.modelDrift}%`,
      isPositive: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="executive-summary" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Executive Summary</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 cursor-help hover:bg-blue-100 transition-colors">
              <BookOpen className="h-3 w-3 mr-1" />
              {paperCount} papers • {totalCitations.toLocaleString()} citations
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Research authority score based on peer-reviewed publications</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Cost Impact"
            icon={<DollarSign className="h-4 w-4 text-success" />}
            metrics={costMetrics}
            accentColor="success"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Quality Gains"
            icon={<Target className="h-4 w-4 text-primary" />}
            metrics={qualityMetrics}
            accentColor="primary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Strategic Value"
            icon={<Zap className="h-4 w-4 text-info" />}
            metrics={strategicMetrics}
            accentColor="info"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
