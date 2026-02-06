import { usePersona } from '@/hooks/usePersona';
import { dashboardData } from '@/data/mockData';
import { Separator } from '@/components/ui/separator';
import {
  DashboardHeader,
  ExecutiveSummary,
  ResearchDiagnostic,
  PaperRankingEngine,
  ArchitectureVisualization,
  CostAnalysis,
  QualityDeepDive,
  PromptOptimization,
  CapabilityMatrix,
  ForecastSimulator,
  RiskAssessment,
  ResearchSynthesis,
  NextSteps
} from '@/components/dashboard';

const Index = () => {
  const { persona, setPersona } = usePersona('cto');
  const totalCitations = dashboardData.papers.reduce((acc, p) => acc + p.citationCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        data={dashboardData}
        persona={persona}
        onPersonaChange={setPersona}
      />

      <main className="container mx-auto px-4 py-8 space-y-12">
        <ExecutiveSummary 
          comparison={dashboardData.comparison}
          paperCount={dashboardData.papers.length}
          totalCitations={totalCitations}
        />

        <Separator className="my-12" />

        <ResearchDiagnostic 
          diagnostic={dashboardData.diagnostic}
          papers={dashboardData.papers}
        />

        <Separator className="my-12" />

        <PaperRankingEngine papers={dashboardData.papers} />

        <Separator className="my-12" />

        <ArchitectureVisualization 
          architecture={dashboardData.architecture}
          papers={dashboardData.papers}
        />

        <Separator className="my-12" />

        <CostAnalysis comparison={dashboardData.comparison} />

        <Separator className="my-12" />

        <QualityDeepDive comparison={dashboardData.comparison} />

        <Separator className="my-12" />

        <PromptOptimization 
          optimization={dashboardData.promptOptimization}
          papers={dashboardData.papers}
        />

        <Separator className="my-12" />

        <CapabilityMatrix capabilities={dashboardData.capabilities} />

        <Separator className="my-12" />

        <ForecastSimulator />

        <Separator className="my-12" />

        <RiskAssessment 
          risks={dashboardData.risks}
          timeline={dashboardData.timeline}
        />

        <Separator className="my-12" />

        <ResearchSynthesis 
          synthesis={dashboardData.synthesis}
          papers={dashboardData.papers}
        />

        <Separator className="my-12" />

        <NextSteps 
          actionItems={dashboardData.actionItems}
          papers={dashboardData.papers}
        />

        <footer className="py-8 text-center text-sm text-muted-foreground">
          <p>Research-to-Production Impact Dashboard • Generated {dashboardData.generatedDate}</p>
          <p className="mt-1">Backed by {dashboardData.papers.length} peer-reviewed papers • {totalCitations.toLocaleString()} total citations</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
