// Nexus Research Architect - Complete Type Definitions

export type ResearchMaturity = 'production-ready' | 'emerging' | 'research-phase';
export type RelevanceLevel = 'High' | 'Medium' | 'Low';
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

// Research Paper with Full Metadata
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  citationCount: number;
  abstract: string;
  keyFindings: string[];
  relevanceScore: number; // 0-100
  applicability: string;
  arxivUrl?: string;
  githubUrl?: string;
  pdfUrl?: string;
  badges: ('highly-cited' | 'recent-breakthrough' | 'production-tested')[];
  implementationDifficulty: RiskLevel;
  reproductionWarnings?: string[];
}

// Architecture with Mermaid Diagrams
export interface ArchitectureDiagram {
  name: string;
  description: string;
  mermaidCode: string;
  nodes: ArchitectureNode[];
  weaknesses?: string[];
  strengths?: string[];
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'input' | 'process' | 'decision' | 'output' | 'problem' | 'solution';
  latencyMs?: number;
  costPer1k?: number;
  description?: string;
}

export interface ArchitectureComparison {
  current: ArchitectureDiagram;
  proposed: ArchitectureDiagram;
  researchBasis: string[]; // Paper IDs
}

// Prompt Optimization
export interface PromptTechnique {
  name: string;
  paperId: string;
  section?: string; // e.g., "Section 3.2"
  expectedGain: string;
  description: string;
}

export interface PromptOptimization {
  current: {
    template: string;
    weaknesses: string[];
  };
  optimized: {
    template: string;
    improvements: PromptTechnique[];
  };
  abTestRecommendation: {
    sampleSize: number;
    metrics: string[];
    expectedLift: string;
    duration: string;
  };
}

// Comprehensive Metrics
export interface CostMetrics {
  gpuHourlyRate: number;
  tokensPerSecond: number;
  costPer1kRequests: number;
  monthlyProjectedSpend: number;
  failedRequestCost: number;
  infrastructureOverhead: number;
  // Proposed additions
  monthlySavings?: number;
  paybackPeriodMonths?: number;
}

export interface QualityMetrics {
  accuracy: number; // 0-100
  hallucinationRate: number; // 0-100
  userSatisfaction: number; // 0-100
  retrievalPrecision: number; // 0-100
  answerRelevance: number; // 0-100
  factualAccuracy: number; // 0-100
  safetyScore: number; // 0-100
}

export interface LatencyMetrics {
  ttft: number; // Time to first token (ms)
  e2eLatency: number; // End-to-end latency (ms)
  throughputRPS: number; // Requests per second
  concurrentUsers: number;
}

export interface Capability {
  name: string;
  current: boolean;
  proposed: boolean;
  sota: boolean; // State of the art
  maturity: ResearchMaturity;
  businessValue: string;
  description: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  category: 'academic' | 'implementation' | 'operational';
  impact: RiskLevel;
  likelihood: RiskLevel;
  mitigation: string;
  description: string;
}

export interface RiskProfile {
  vendorLockIn: RiskLevel;
  dataPrivacy: 'compliant' | 'review-needed';
  modelDrift: number; // 0-100
  maintenanceBurden: RiskLevel;
  implementationComplexity: RiskLevel;
}

// Full Comparison
export interface MetricComparison {
  current: {
    cost: CostMetrics;
    quality: QualityMetrics;
    latency: LatencyMetrics;
    risk: RiskProfile;
  };
  proposed: {
    cost: CostMetrics;
    quality: QualityMetrics;
    latency: LatencyMetrics;
    risk: RiskProfile;
  };
  sota: {
    quality: Partial<QualityMetrics>;
  };
}

// Diagnostic Information
export interface Diagnostic {
  currentBottleneck: string;
  rootCause: string;
  impactedMetrics: string[];
  paperReferences: string[]; // Paper IDs
  severityScore: number; // 0-100
}

// Research Synthesis
export interface ResearchSynthesis {
  consensus: string[];
  conflictingEvidence: {
    topic: string;
    positions: { paperId: string; position: string }[];
    recommendation: string;
  }[];
  gaps: string[];
  caveats: string[];
}

// Implementation Timeline
export interface ImplementationPhase {
  name: string;
  duration: string;
  tasks: string[];
  deliverables: string[];
  researchValidation?: string;
}

// Action Items
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  timeframe: 'week1' | 'month1' | 'ongoing';
  type: 'code' | 'research' | 'experiment' | 'monitoring';
  codeSnippet?: string;
  paperReferences?: string[];
  expectedImpact?: string;
  priority: 'high' | 'medium' | 'low';
}

// Main Dashboard Data
export interface DashboardData {
  title: string;
  generatedDate: string;
  recommendation: {
    status: 'immediate-adopt' | 'pilot-recommended' | 'monitor-revisit';
    confidence: number;
    reasoning: string;
  };
  comparison: MetricComparison;
  papers: ResearchPaper[];
  architecture: ArchitectureComparison;
  promptOptimization: PromptOptimization;
  capabilities: Capability[];
  risks: RiskFactor[];
  diagnostic: Diagnostic;
  synthesis: ResearchSynthesis;
  timeline: ImplementationPhase[];
  actionItems: ActionItem[];
}

// Paper Ranking Weights
export interface RankingWeights {
  relevance: number; // 0-1
  citations: number; // 0-1
  recency: number; // 0-1
}

// Forecast Parameters
export interface ForecastParams {
  trafficVolume: number; // requests per day
  implementationPercentage: number; // 0-100
  improvementFactor: number; // multiplier 0.5-2.0
}

export interface ForecastResult {
  monthlySavings: number;
  qualityImprovement: number;
  roiMonths: number;
  scenario: 'best' | 'expected' | 'worst';
}
