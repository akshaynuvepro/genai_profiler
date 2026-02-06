import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResearchPaper } from '@/types/dashboard';
import {
  BookOpen, ExternalLink, Github, ChevronDown, ChevronUp,
  Award, Sparkles, CheckCircle, ArrowUpDown, AlertTriangle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaperRankingEngineProps {
  papers: ResearchPaper[];
}

type SortKey = 'relevance' | 'citations' | 'difficulty';

export function PaperRankingEngine({ papers }: PaperRankingEngineProps) {
  const [sortBy, setSortBy] = useState<SortKey>('relevance');
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const sortedPapers = [...papers].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.relevanceScore - a.relevanceScore;
      case 'citations':
        return b.citationCount - a.citationCount;
      case 'difficulty':
        const diffOrder = { low: 0, medium: 1, high: 2 };
        return diffOrder[a.implementationDifficulty] - diffOrder[b.implementationDifficulty];
      default:
        return 0;
    }
  });

  const getBadgeIcon = (badge: ResearchPaper['badges'][number]) => {
    switch (badge) {
      case 'highly-cited':
        return <Award className="h-3 w-3" />;
      case 'recent-breakthrough':
        return <Sparkles className="h-3 w-3" />;
      case 'production-tested':
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  const getBadgeLabel = (badge: ResearchPaper['badges'][number]) => {
    switch (badge) {
      case 'highly-cited':
        return 'Highly Cited';
      case 'recent-breakthrough':
        return 'Recent Breakthrough';
      case 'production-tested':
        return 'Production Tested';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return '';
    }
  };

  return (
    <section id="paper-ranking" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Paper Ranking Engine</h2>
          <p className="text-sm text-muted-foreground">
            Score = Relevance (50%) + Citations (30%) + Recency (20%)
          </p>
        </div>
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="relevance" className="text-xs">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Relevance
            </TabsTrigger>
            <TabsTrigger value="citations" className="text-xs">Citations</TabsTrigger>
            <TabsTrigger value="difficulty" className="text-xs">Difficulty</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card hover:border-primary/30 transition-colors">
                <Collapsible 
                  open={expandedPaper === paper.id}
                  onOpenChange={(open) => setExpandedPaper(open ? paper.id : null)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">#{index + 1}</span>
                          <CardTitle className="text-base truncate">{paper.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 ? ' et al.' : ''}</span>
                          <span>•</span>
                          <span className="font-medium text-foreground">{paper.venue}</span>
                          <span>•</span>
                          <span>{paper.citationCount.toLocaleString()} citations</span>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          {expandedPaper === paper.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Relevance Score Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Relevance Score</span>
                        <span className="font-semibold text-primary">{paper.relevanceScore}%</span>
                      </div>
                      <Progress value={paper.relevanceScore} className="h-2" />
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      {paper.badges.map((badge) => (
                        <Badge key={badge} variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                          {getBadgeIcon(badge)}
                          <span className="ml-1">{getBadgeLabel(badge)}</span>
                        </Badge>
                      ))}
                      <Badge variant="outline" className={getDifficultyColor(paper.implementationDifficulty)}>
                        {paper.implementationDifficulty} difficulty
                      </Badge>
                    </div>

                    {/* Applicability */}
                    <p className="text-sm text-muted-foreground italic">
                      "{paper.applicability}"
                    </p>

                    {/* Expanded Content */}
                    <CollapsibleContent className="space-y-4 pt-3 border-t border-border">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Abstract</h4>
                        <p className="text-sm text-muted-foreground">{paper.abstract}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Findings</h4>
                        <ul className="space-y-1">
                          {paper.keyFindings.map((finding, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {paper.reproductionWarnings && paper.reproductionWarnings.length > 0 && (
                        <div className="bg-yellow-50/50 border border-yellow-200 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <h4 className="text-sm font-medium text-yellow-800">Reproducibility Notes</h4>
                          </div>
                          <ul className="space-y-1.5">
                            {paper.reproductionWarnings.map((warning, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-yellow-700">
                                <span className="mt-1">•</span>
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {paper.arxivUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={paper.arxivUrl} target="_blank" rel="noopener noreferrer">
                              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                              arXiv
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        {paper.pdfUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              PDF
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        {paper.githubUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={paper.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3.5 w-3.5 mr-1.5" />
                              GitHub
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Collapsible>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
