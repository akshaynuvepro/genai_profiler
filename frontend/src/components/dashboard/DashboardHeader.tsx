import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Persona } from '@/types/dashboard';
import { DashboardData } from '@/types/dashboard';
import { BookOpen, TrendingUp, Users, DollarSign, Code, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  data: DashboardData;
  persona: Persona;
  onPersonaChange: (persona: Persona) => void;
}

export function DashboardHeader({ data, persona, onPersonaChange }: DashboardHeaderProps) {
  const totalCitations = data.papers.reduce((acc, p) => acc + p.citationCount, 0);
  
  const getStatusColor = (status: typeof data.recommendation.status) => {
    switch (status) {
      case 'immediate-adopt': return 'bg-green-100 text-green-700 border border-green-300 shadow-lg shadow-green-500/30';
      case 'pilot-recommended': return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'monitor-revisit': return 'bg-slate-100 text-slate-600 border border-slate-300';
    }
  };

  const getStatusLabel = (status: typeof data.recommendation.status) => {
    switch (status) {
      case 'immediate-adopt': return 'IMMEDIATE ADOPT';
      case 'pilot-recommended': return 'PILOT RECOMMENDED';
      case 'monitor-revisit': return 'MONITOR & REVISIT';
    }
  };

  const personaIcons = {
    cfo: DollarSign,
    cto: Code,
    pm: Users
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
                {data.title}
              </h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    className={`${getStatusColor(data.recommendation.status)} font-semibold px-3 py-1`}
                  >
                    {getStatusLabel(data.recommendation.status)} - {data.recommendation.confidence}% Confidence
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{data.recommendation.reasoning}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Generated {data.generatedDate}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1.5 cursor-help">
                    <BookOpen className="h-3.5 w-3.5" />
                    {data.papers.length} papers • {totalCitations.toLocaleString()} citations
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">Research Authority</p>
                  <p className="text-xs text-muted-foreground">
                    Analysis backed by peer-reviewed research from NeurIPS, ACL, ICLR
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Persona Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">View as:</span>
            <Tabs value={persona} onValueChange={(v) => onPersonaChange(v as Persona)}>
              <TabsList className="bg-muted/50">
                {(['cfo', 'cto', 'pm'] as const).map((p) => {
                  const Icon = personaIcons[p];
                  return (
                    <TabsTrigger 
                      key={p} 
                      value={p}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{p.toUpperCase()}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
