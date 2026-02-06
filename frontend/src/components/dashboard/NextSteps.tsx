import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActionItem, ResearchPaper } from '@/types/dashboard';
import { 
  CheckSquare, Code, BookOpen, FlaskConical, Activity, 
  Copy, CheckCircle, ExternalLink, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NextStepsProps {
  actionItems: ActionItem[];
  papers: ResearchPaper[];
}

export function NextSteps({ actionItems, papers }: NextStepsProps) {
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getPaperTitle = (paperId: string) => {
    const paper = papers.find(p => p.id === paperId);
    return paper ? paper.title.split(':')[0] : paperId;
  };

  const getTypeIcon = (type: ActionItem['type']) => {
    switch (type) {
      case 'code': return <Code className="h-4 w-4" />;
      case 'research': return <BookOpen className="h-4 w-4" />;
      case 'experiment': return <FlaskConical className="h-4 w-4" />;
      case 'monitoring': return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: ActionItem['type']) => {
    switch (type) {
      case 'code': return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'research': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'experiment': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'monitoring': return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const week1Items = actionItems.filter(i => i.timeframe === 'week1');
  const month1Items = actionItems.filter(i => i.timeframe === 'month1');
  const ongoingItems = actionItems.filter(i => i.timeframe === 'ongoing');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderActionItem = (item: ActionItem) => {
    const isCompleted = completedItems.includes(item.id);

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border transition-all ${
          isCompleted 
            ? 'bg-success/5 border-success/30' 
            : 'bg-muted/20 border-border hover:border-border/80'
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={() => toggleComplete(item.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-sm font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {item.title}
              </h4>
              <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                {getTypeIcon(item.type)}
                <span className="ml-1 capitalize">{item.type}</span>
              </Badge>
              <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>

            {item.codeSnippet && (
              <div className="mt-3 relative">
                <pre className="bg-background/50 rounded-lg p-3 text-xs font-mono overflow-x-auto custom-scrollbar border border-border">
                  {item.codeSnippet}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => copyToClipboard(item.codeSnippet || '')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}

            {item.paperReferences && item.paperReferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.paperReferences.map((paperId) => (
                  <Badge key={paperId} variant="outline" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {getPaperTitle(paperId)}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const completedCount = completedItems.length;
  const totalCount = actionItems.length;

  return (
    <section id="next-steps" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Next Steps & Action Items</h2>
        <Badge variant="outline" className={completedCount === totalCount ? 'bg-green-100 text-green-700 border-green-300' : ''}>
          <CheckCircle className="h-3 w-3 mr-1" />
          {completedCount}/{totalCount} completed
        </Badge>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-card">
          <CardContent className="pt-6">
            <Tabs defaultValue="week1">
              <TabsList className="bg-muted/50 mb-4">
                <TabsTrigger value="week1" className="gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Week 1
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {week1Items.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="month1" className="gap-1.5">
                  Month 1
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {month1Items.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="ongoing" className="gap-1.5">
                  Ongoing
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                    {ongoingItems.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="week1" className="space-y-3">
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 mb-4">
                  <p className="text-xs font-medium text-destructive flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Immediate Actions - Do This Week
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    High-impact changes with minimal implementation effort.
                  </p>
                </div>
                {week1Items.map(renderActionItem)}
              </TabsContent>

              <TabsContent value="month1" className="space-y-3">
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 mb-4">
                  <p className="text-xs font-medium text-warning flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    Strategic Actions - Complete This Month
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Research deep-dives and infrastructure setup.
                  </p>
                </div>
                {month1Items.map(renderActionItem)}
              </TabsContent>

              <TabsContent value="ongoing" className="space-y-3">
                <div className="p-3 bg-info/10 rounded-lg border border-info/20 mb-4">
                  <p className="text-xs font-medium text-info flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" />
                    Ongoing Experiments & Monitoring
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Continuous validation and improvement tasks.
                  </p>
                </div>
                {ongoingItems.map(renderActionItem)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
