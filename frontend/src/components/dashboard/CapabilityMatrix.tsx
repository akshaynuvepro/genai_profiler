import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Capability } from '@/types/dashboard';
import { Grid3X3, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface CapabilityMatrixProps {
  capabilities: Capability[];
}

export function CapabilityMatrix({ capabilities }: CapabilityMatrixProps) {
  const getMaturityBadge = (maturity: Capability['maturity']) => {
    switch (maturity) {
      case 'production-ready':
        return { label: '🟢 Production-Ready', class: 'bg-green-100 text-green-700 border-green-300' };
      case 'emerging':
        return { label: '🟡 Emerging', class: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
      case 'research-phase':
        return { label: '🔴 Research Phase', class: 'bg-red-100 text-red-700 border-red-300' };
    }
  };

  const StatusIcon = ({ enabled }: { enabled: boolean }) => {
    return enabled ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : (
      <XCircle className="h-4 w-4 text-muted-foreground/50" />
    );
  };

  const unlocked = capabilities.filter(c => !c.current && c.proposed);
  const totalValue = unlocked
    .filter(c => c.businessValue.startsWith('+$'))
    .reduce((sum, c) => {
      const match = c.businessValue.match(/\+\$(\d+)k/);
      return sum + (match ? parseInt(match[1]) * 1000 : 0);
    }, 0);

  return (
    <section id="capability-matrix" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Capability Matrix</h2>
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
          <DollarSign className="h-3 w-3 mr-1" />
          {unlocked.length} capabilities unlocked ({new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            notation: 'compact'
          }).format(totalValue)} potential ARR)
        </Badge>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs font-semibold">Capability</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Current</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Proposed</TableHead>
                    <TableHead className="text-xs font-semibold text-center">SOTA</TableHead>
                    <TableHead className="text-xs font-semibold">Research Maturity</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Business Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capabilities.map((capability, idx) => {
                    const maturity = getMaturityBadge(capability.maturity);
                    const isNewCapability = !capability.current && capability.proposed;
                    
                    return (
                      <TableRow 
                        key={idx}
                        className={isNewCapability ? 'bg-success/5' : ''}
                      >
                        <TableCell className="font-medium">
                          <Tooltip>
                            <TooltipTrigger className="cursor-help">
                              <div className="flex items-center gap-2">
                                {isNewCapability && (
                                  <span className="text-success text-xs">✨</span>
                                )}
                                <span className="text-sm">{capability.name}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p className="text-sm">{capability.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusIcon enabled={capability.current} />
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusIcon enabled={capability.proposed} />
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusIcon enabled={capability.sota} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${maturity.class}`}>
                            {maturity.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm font-medium ${
                            capability.businessValue.startsWith('+') ? 'text-success' : ''
                          }`}>
                            {capability.businessValue}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3.5 w-3.5 text-success" />
          <span>Supported</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span>Not Supported</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success">✨</span>
          <span>Newly Unlocked</span>
        </div>
      </div>
    </section>
  );
}
