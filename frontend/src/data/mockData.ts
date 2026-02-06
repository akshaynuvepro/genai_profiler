import { DashboardData, ResearchPaper, ArchitectureComparison, MetricComparison, PromptOptimization, Capability, RiskFactor, Diagnostic, ResearchSynthesis, ImplementationPhase, ActionItem } from '@/types/dashboard';
import { generateReproducibilityWarnings, calculateExpectedRange } from '@/lib/research-analysis';

// Research Papers - RAG/Retrieval focused
export const researchPapers: ResearchPaper[] = [
  {
    id: 'selfrag-2024',
    title: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection',
    authors: ['Akari Asai', 'Zeqiu Wu', 'Yizhong Wang', 'Avirup Sil', 'Hannaneh Hajishirzi'],
    venue: 'NeurIPS 2024',
    year: 2024,
    citationCount: 1247,
    abstract: 'We introduce Self-RAG, a framework that trains a single LM to adaptively retrieve passages on-demand and generate and critique its own output using special reflection tokens. Self-RAG significantly outperforms state-of-the-art LLMs and RAG models on diverse benchmarks.',
    keyFindings: [
      'Reduces hallucinations by 34% through self-critique mechanism (Section 4.2)',
      'Improves retrieval precision from 67% to 91% (Table 2)',
      'Adds only 15ms average latency overhead (Section 5.3)',
      'Works with any retriever architecture'
    ],
    relevanceScore: 94,
    applicability: 'Directly addresses your retrieval quality issues. The reflection token mechanism can be implemented with minimal changes to your existing prompt structure.',
    arxivUrl: 'https://arxiv.org/abs/2310.11511',
    githubUrl: 'https://github.com/AkariAsai/self-rag',
    pdfUrl: 'https://arxiv.org/pdf/2310.11511.pdf',
    badges: ['highly-cited', 'production-tested'],
    implementationDifficulty: 'medium',
    reproductionWarnings: [
      'Paper from 2024 - fairly recent but rapidly evolving field',
      'Expect 70-85% of reported improvement in production (34% → 24-29% hallucination reduction)',
      'Fine-tuning reflection tokens may require 2-3 days GPU time for optimal performance'
    ]
  },
  {
    id: 'crag-2024',
    title: 'Corrective Retrieval Augmented Generation',
    authors: ['Shi-Qi Yan', 'Jia-Chen Gu', 'Yun Zhu', 'Zhen-Hua Ling'],
    venue: 'ACL 2024',
    year: 2024,
    citationCount: 892,
    abstract: 'CRAG introduces a lightweight retrieval evaluator to assess the relevance of retrieved documents and trigger different knowledge retrieval actions based on confidence levels, including web searches for low-confidence retrievals.',
    keyFindings: [
      'Lightweight evaluator adds only 8ms overhead (Section 3.2)',
      'Improves answer accuracy by 28% on knowledge-intensive tasks (Table 3)',
      'Reduces irrelevant document usage by 45% (Figure 4)',
      'Seamlessly integrates with existing RAG pipelines'
    ],
    relevanceScore: 89,
    applicability: 'Your current pipeline lacks retrieval grading. CRAG\'s evaluator can be added as a post-retrieval filter with minimal architectural changes.',
    arxivUrl: 'https://arxiv.org/abs/2401.15884',
    pdfUrl: 'https://arxiv.org/pdf/2401.15884.pdf',
    badges: ['recent-breakthrough', 'production-tested'],
    implementationDifficulty: 'low',
    reproductionWarnings: [
      'Paper from 2024 - actively being validated in production',
      'Lightweight evaluator is easiest to implement (minimal complexity)',
      'Tested on PopQA and HotpotQA - may need domain-specific calibration for your data'
    ]
  },
  {
    id: 'chain-of-note-2024',
    title: 'Chain-of-Note: Enhancing Robustness in Retrieval-Augmented Language Models',
    authors: ['Wenhao Yu', 'Hongming Zhang', 'Xiaoman Pan', 'Kaixin Ma', 'Dong Yu'],
    venue: 'ICLR 2024',
    year: 2024,
    citationCount: 567,
    abstract: 'We propose Chain-of-Note (CoN), a novel approach that generates sequential reading notes for retrieved documents, enabling the model to assess relevance and reliability of information before generating responses.',
    keyFindings: [
      'Improves robustness to noisy retrievals by 38% (Section 4.1)',
      'Enables explicit reasoning chains for auditing',
      'Reduces hallucination in low-resource domains by 29% (Table 4)',
      'Compatible with any backbone LLM'
    ],
    relevanceScore: 82,
    applicability: 'Excellent for debugging retrieval failures. The note-taking mechanism provides transparency into why certain documents were used.',
    arxivUrl: 'https://arxiv.org/abs/2311.09210',
    pdfUrl: 'https://arxiv.org/pdf/2311.09210.pdf',
    badges: ['recent-breakthrough'],
    implementationDifficulty: 'medium',
    reproductionWarnings: [
      'Paper from 2024 - newer approaches may exist',
      'Adds 45ms latency for note generation (vs 8-15ms for simpler approaches)',
      'Best for debugging/audit scenarios rather than production speed optimization',
      'No documented production deployments'
    ]
  },
  {
    id: 'raft-2024',
    title: 'RAFT: Adapting Language Model to Domain Specific RAG',
    authors: ['Tianjun Zhang', 'Shishir G. Patil', 'Naman Jain', 'Sheng Shen', 'Matei Zaharia', 'Ion Stoica', 'Joseph E. Gonzalez'],
    venue: 'arXiv 2024',
    year: 2024,
    citationCount: 423,
    abstract: 'RAFT (Retrieval Augmented Fine Tuning) prepares LLMs for domain-specific RAG by training them to ignore distractor documents and cite relevant sources, significantly improving in-domain performance.',
    keyFindings: [
      'Improves domain-specific accuracy by 41% (Section 5.1)',
      'Trains model to cite sources explicitly',
      'Reduces sensitivity to distractor documents (Table 2)',
      'Requires domain-specific fine-tuning (3-5 days GPU)'
    ],
    relevanceScore: 76,
    applicability: 'Best for long-term optimization if you have domain-specific data. Requires fine-tuning investment but yields highest accuracy gains.',
    arxivUrl: 'https://arxiv.org/abs/2403.10131',
    githubUrl: 'https://github.com/ShishirPatil/gorilla/tree/main/raft',
    pdfUrl: 'https://arxiv.org/pdf/2403.10131.pdf',
    badges: ['production-tested'],
    implementationDifficulty: 'high',
    reproductionWarnings: [
      'Paper from 2024 - fairly recent',
      'Requires significant fine-tuning investment (3-5 days GPU, $500-1000 cost)',
      'Best ROI if you have >10k domain-specific examples',
      'Implementation complexity high - consider simpler approaches first'
    ]
  },
  {
    id: 'hyde-2023',
    title: 'Precise Zero-Shot Dense Retrieval without Relevance Labels',
    authors: ['Luyu Gao', 'Xueguang Ma', 'Jimmy Lin', 'Jamie Callan'],
    venue: 'EMNLP 2023',
    year: 2023,
    citationCount: 1089,
    abstract: 'HyDE (Hypothetical Document Embeddings) generates a hypothetical answer document for a query, then uses this document for retrieval. This approach significantly improves zero-shot retrieval performance.',
    keyFindings: [
      'Improves zero-shot retrieval by 35% (Table 1)',
      'No training required - pure prompting approach',
      'Works with any embedding model (Section 3.3)',
      'Adds 200-400ms latency for document generation (Section 5.2)'
    ],
    relevanceScore: 71,
    applicability: 'Quick win for improving retrieval without model changes. Trade-off is added latency from hypothetical document generation.',
    arxivUrl: 'https://arxiv.org/abs/2212.10496',
    githubUrl: 'https://github.com/texttron/hyde',
    pdfUrl: 'https://arxiv.org/pdf/2212.10496.pdf',
    badges: ['highly-cited'],
    implementationDifficulty: 'low',
    reproductionWarnings: [
      'Paper from 2023 - newer approaches may exist',
      'Adds significant latency (200-400ms) - not suitable for latency-sensitive applications',
      'Tested on generic datasets - may not generalize to domain-specific data',
      'Highly cited (1089) - well-validated by community'
    ]
  }
];

// Architecture Comparison
export const architectureComparison: ArchitectureComparison = {
  current: {
    name: 'Standard RAG Pipeline',
    description: 'Basic retrieve-then-generate architecture without quality checks',
    mermaidCode: `graph TD
    A["🔍 User Query"] --> B["📊 Embedding Model"]
    B --> C["🗃️ Vector Search"]
    C --> D["📄 Top-K Documents"]
    D --> E["🤖 LLM Generation"]
    E --> F["💬 Output"]
    
    style C fill:#ef4444,stroke:#dc2626,color:#fff
    style D fill:#ef4444,stroke:#dc2626,color:#fff
    
    G["❌ No Quality Check"] -.->|"38% irrelevant docs"| D
    H["❌ No Retry Logic"] -.->|"18% hallucination"| E`,
    nodes: [
      { id: 'query', label: 'User Query', type: 'input', latencyMs: 0 },
      { id: 'embed', label: 'Embedding Model', type: 'process', latencyMs: 15, costPer1k: 0.02 },
      { id: 'search', label: 'Vector Search', type: 'problem', latencyMs: 25, costPer1k: 0.01 },
      { id: 'docs', label: 'Top-K Documents', type: 'problem', latencyMs: 5 },
      { id: 'llm', label: 'LLM Generation', type: 'process', latencyMs: 450, costPer1k: 2.50 },
      { id: 'output', label: 'Output', type: 'output', latencyMs: 0 }
    ],
    weaknesses: [
      'No relevance filtering - all retrieved docs pass through',
      'No self-correction mechanism for hallucinations',
      'Fixed retrieval count regardless of query complexity',
      'No confidence scoring for generated answers'
    ]
  },
  proposed: {
    name: 'Self-RAG + Corrective Retrieval',
    description: 'Enhanced pipeline with self-critique and adaptive retrieval',
    mermaidCode: `graph TD
    A["🔍 User Query"] --> B["📊 Embedding Model"]
    B --> C["🗃️ Vector Search"]
    C --> D["📄 Retrieved Docs"]
    D --> E{"🔬 Relevance<br/>Evaluator"}
    E -->|"✅ Relevant"| F["🤖 LLM + Reflection"]
    E -->|"❌ Irrelevant"| G["✏️ Query Rewrite"]
    G --> C
    F --> H{"🎯 Confidence<br/>Check"}
    H -->|"✅ High"| I["💬 Output"]
    H -->|"⚠️ Low"| J["🔄 Retrieve More"]
    J --> C
    
    style E fill:#22c55e,stroke:#16a34a,color:#fff
    style F fill:#22c55e,stroke:#16a34a,color:#fff
    style H fill:#22c55e,stroke:#16a34a,color:#fff
    
    K["✅ From CRAG Paper"] -.-> E
    L["✅ From Self-RAG"] -.-> F`,
    nodes: [
      { id: 'query', label: 'User Query', type: 'input', latencyMs: 0 },
      { id: 'embed', label: 'Embedding Model', type: 'process', latencyMs: 15, costPer1k: 0.02 },
      { id: 'search', label: 'Vector Search', type: 'process', latencyMs: 25, costPer1k: 0.01 },
      { id: 'docs', label: 'Retrieved Docs', type: 'process', latencyMs: 5 },
      { id: 'eval', label: 'Relevance Evaluator', type: 'solution', latencyMs: 8, costPer1k: 0.05, description: 'CRAG-style evaluator' },
      { id: 'llm', label: 'LLM + Reflection', type: 'solution', latencyMs: 480, costPer1k: 2.80, description: 'Self-RAG reflection tokens' },
      { id: 'rewrite', label: 'Query Rewrite', type: 'solution', latencyMs: 50, costPer1k: 0.10 },
      { id: 'confidence', label: 'Confidence Check', type: 'solution', latencyMs: 5 },
      { id: 'output', label: 'Output', type: 'output', latencyMs: 0 }
    ],
    strengths: [
      'Relevance filtering removes 45% of noisy documents',
      'Self-critique reduces hallucinations by 34%',
      'Adaptive retrieval handles complex queries',
      'Confidence scoring enables graceful degradation'
    ]
  },
  researchBasis: ['selfrag-2024', 'crag-2024']
};

// Metric Comparison
export const metricComparison: MetricComparison = {
  current: {
    cost: {
      gpuHourlyRate: 2.50,
      tokensPerSecond: 45,
      costPer1kRequests: 3.20,
      monthlyProjectedSpend: 28500,
      failedRequestCost: 2900,
      infrastructureOverhead: 4200
    },
    quality: {
      accuracy: 72,
      hallucinationRate: 18,
      userSatisfaction: 68,
      retrievalPrecision: 62,
      answerRelevance: 71,
      factualAccuracy: 74,
      safetyScore: 89
    },
    latency: {
      ttft: 180,
      e2eLatency: 520,
      throughputRPS: 45,
      concurrentUsers: 200
    },
    risk: {
      vendorLockIn: 'low',
      dataPrivacy: 'compliant',
      modelDrift: 35,
      maintenanceBurden: 'low',
      implementationComplexity: 'low'
    }
  },
  proposed: {
    cost: {
      gpuHourlyRate: 2.50,
      tokensPerSecond: 42,
      costPer1kRequests: 3.45,
      monthlyProjectedSpend: 24200,
      failedRequestCost: 850,
      infrastructureOverhead: 4500,
      monthlySavings: 5950,
      paybackPeriodMonths: 2.1
    },
    quality: {
      accuracy: 89,
      hallucinationRate: 6,
      userSatisfaction: 87,
      retrievalPrecision: 84,
      answerRelevance: 88,
      factualAccuracy: 91,
      safetyScore: 92
    },
    latency: {
      ttft: 195,
      e2eLatency: 558,
      throughputRPS: 42,
      concurrentUsers: 185
    },
    risk: {
      vendorLockIn: 'low',
      dataPrivacy: 'compliant',
      modelDrift: 28,
      maintenanceBurden: 'medium',
      implementationComplexity: 'medium'
    }
  },
  sota: {
    quality: {
      accuracy: 94,
      hallucinationRate: 4,
      retrievalPrecision: 91,
      answerRelevance: 93,
      factualAccuracy: 95
    }
  }
};

// Prompt Optimization
export const promptOptimization: PromptOptimization = {
  current: {
    template: `Answer the following question using the provided context:

{context}

Question: {query}
Answer:`,
    weaknesses: [
      'No reasoning guidance (-15% accuracy per Paper #2)',
      'No confidence calibration (+23% hallucinations per Paper #4)',
      'Missing retrieval critique (Self-RAG core finding)',
      'No structured output format'
    ]
  },
  optimized: {
    template: `You will answer a question using retrieved documents. Follow these steps:

1. CRITIQUE: First, evaluate if the documents are relevant.
   - If documents are irrelevant, output: [NEED_RETRIEVAL]
   - If documents are partially relevant, note which parts to use
   
2. REASONING: Think step-by-step about the answer.
   <reasoning>
   [Show your work here - cite specific documents]
   </reasoning>
   
3. CONFIDENCE: Rate your certainty (HIGH/MEDIUM/LOW)
   - HIGH: Multiple sources confirm, direct answer found
   - MEDIUM: Inference required, single source
   - LOW: Uncertain, may need more information

Documents:
{context}

Question: {query}

Take a deep breath and work through this carefully.`,
    improvements: [
      {
        name: 'Self-Critique Mechanism',
        paperId: 'selfrag-2024',
        section: 'Section 3.1',
        expectedGain: '+34% retrieval precision',
        description: 'Evaluate document relevance before generation using reflection tokens'
      },
      {
        name: 'Chain-of-Thought Prompting',
        paperId: 'chain-of-note-2024',
        section: 'Section 3.2',
        expectedGain: '+12% reasoning accuracy',
        description: 'Explicit reasoning with document citations through sequential note-taking'
      },
      {
        name: 'Confidence Calibration',
        paperId: 'crag-2024',
        section: 'Section 4.1',
        expectedGain: '-28% overconfident errors',
        description: 'Three-tier confidence scoring system (HIGH/MEDIUM/LOW)'
      },
      {
        name: 'Emotional Priming',
        paperId: 'hyde-2023',
        section: 'Appendix B',
        expectedGain: '+2% math/logic accuracy',
        description: '"Take a deep breath" reduces rushed responses (based on prompt engineering literature)'
      }
    ]
  },
  abTestRecommendation: {
    sampleSize: 1000,
    metrics: ['Accuracy', 'Hallucination Rate', 'User Satisfaction', 'Latency'],
    expectedLift: '+18-25% quality score',
    duration: '3 days'
  }
};

// Capabilities
export const capabilities: Capability[] = [
  {
    name: 'Self-Correcting Retrieval',
    current: false,
    proposed: true,
    sota: true,
    maturity: 'production-ready',
    businessValue: '+$180k ARR',
    description: 'Automatically retries with rephrased queries when initial retrieval fails'
  },
  {
    name: 'Multi-Hop Reasoning',
    current: false,
    proposed: true,
    sota: true,
    maturity: 'emerging',
    businessValue: '+$45k ARR',
    description: 'Chains multiple retrieval steps for complex queries'
  },
  {
    name: 'Retrieval Critique',
    current: false,
    proposed: true,
    sota: true,
    maturity: 'production-ready',
    businessValue: '+$120k ARR',
    description: 'Evaluates and filters retrieved documents before generation'
  },
  {
    name: 'Confidence Scoring',
    current: false,
    proposed: true,
    sota: true,
    maturity: 'production-ready',
    businessValue: '+$60k ARR',
    description: 'Provides uncertainty estimates for generated answers'
  },
  {
    name: 'Source Citation',
    current: true,
    proposed: true,
    sota: true,
    maturity: 'production-ready',
    businessValue: 'Baseline',
    description: 'Links answers to source documents'
  },
  {
    name: 'Adversarial Robustness',
    current: false,
    proposed: false,
    sota: true,
    maturity: 'research-phase',
    businessValue: 'TBD',
    description: 'Resistance to prompt injection and adversarial queries'
  },
  {
    name: 'Domain Adaptation',
    current: false,
    proposed: false,
    sota: true,
    maturity: 'emerging',
    businessValue: '+$200k ARR',
    description: 'Fine-tuning for specific domain knowledge'
  }
];

// Risk Factors
export const riskFactors: RiskFactor[] = [
  {
    id: 'reproducibility',
    name: 'Paper Reproducibility',
    category: 'academic',
    impact: 'medium',
    likelihood: 'medium',
    mitigation: 'Use official implementations, set 70% target vs paper claims',
    description: 'Self-RAG results may vary -5% to +10% from paper benchmarks'
  },
  {
    id: 'dataset-mismatch',
    name: 'Dataset Distribution Mismatch',
    category: 'academic',
    impact: 'high',
    likelihood: 'medium',
    mitigation: 'Validate on your data before full rollout, build domain test suite',
    description: 'Papers tested on Wikipedia/news; your data may be legal/technical docs'
  },
  {
    id: 'hidden-complexity',
    name: 'Hidden Implementation Complexity',
    category: 'academic',
    impact: 'medium',
    likelihood: 'high',
    mitigation: 'Budget 1.5-2x estimated time, start with simplest approach',
    description: 'Papers often omit fine-tuning details and edge case handling'
  },
  {
    id: 'timeline',
    name: 'Implementation Timeline Risk',
    category: 'implementation',
    impact: 'medium',
    likelihood: 'medium',
    mitigation: 'Phased rollout with clear go/no-go criteria at each stage',
    description: 'Full implementation may take 10-12 weeks vs 6-8 week estimate'
  },
  {
    id: 'team-skills',
    name: 'Team Skill Gaps',
    category: 'implementation',
    impact: 'medium',
    likelihood: 'low',
    mitigation: 'Paper reading group, external consultation for first implementation',
    description: 'Team may need ramp-up time on reflection token architecture'
  },
  {
    id: 'model-drift',
    name: 'Model Drift Over Time',
    category: 'operational',
    impact: 'high',
    likelihood: 'medium',
    mitigation: 'Continuous monitoring, automated alerts, monthly re-evaluation',
    description: 'Performance may degrade as user patterns change'
  },
  {
    id: 'maintenance',
    name: 'Increased Maintenance Burden',
    category: 'operational',
    impact: 'low',
    likelihood: 'high',
    mitigation: 'Document thoroughly, build automated testing suite',
    description: 'More components = more potential failure points'
  }
];

// Diagnostic
export const diagnostic: Diagnostic = {
  currentBottleneck: 'Retrieval Quality Gate',
  rootCause: 'Standard RAG assumes all retrieved documents are equally useful. Without relevance filtering, 38% of retrieved documents add noise rather than value, directly causing the 18% hallucination rate.',
  impactedMetrics: ['Retrieval Precision', 'Hallucination Rate', 'User Satisfaction', 'Failed Request Cost'],
  paperReferences: ['selfrag-2024', 'crag-2024', 'chain-of-note-2024'],
  severityScore: 78
};

// Research Synthesis
export const researchSynthesis: ResearchSynthesis = {
  consensus: [
    'Standard RAG suffers from "retrieval blindness" - treating all documents equally',
    'Adding a critique step before generation reduces hallucinations by 25-35%',
    'Self-correction mechanisms are more effective than larger retrieval counts',
    'Lightweight evaluators (8-15ms) provide best cost/benefit ratio'
  ],
  conflictingEvidence: [
    {
      topic: 'Latency Overhead',
      positions: [
        { paperId: 'selfrag-2024', position: 'Reports +15ms average overhead' },
        { paperId: 'crag-2024', position: 'Reports +8ms overhead' },
        { paperId: 'chain-of-note-2024', position: 'Reports +45ms overhead for full chain' }
      ],
      recommendation: 'Likely +25-35ms in your context (mid-range estimate). CRAG approach is fastest.'
    },
    {
      topic: 'Fine-Tuning Necessity',
      positions: [
        { paperId: 'selfrag-2024', position: 'Requires fine-tuning for best results (3-5 days GPU)' },
        { paperId: 'chain-of-note-2024', position: 'Works zero-shot with prompting' },
        { paperId: 'raft-2024', position: 'Fine-tuning essential for domain adaptation' }
      ],
      recommendation: 'Start zero-shot (Chain-of-Note approach), fine-tune if >85% accuracy needed'
    }
  ],
  gaps: [
    'Long-term model drift (all papers tested <3 months)',
    'Multi-language performance (all papers English-only)',
    'Enterprise data privacy considerations (all use public datasets)',
    'Latency impact at scale (papers test <1000 concurrent users)'
  ],
  caveats: [
    'Papers report "best case" results - expect 70-85% of claimed improvement',
    'Implementation time typically 1.5-2x paper descriptions',
    'Domain-specific tuning may be required for legal/technical content',
    'Evaluation metrics may not align perfectly with your business KPIs'
  ]
};

// Implementation Timeline
export const implementationTimeline: ImplementationPhase[] = [
  {
    name: 'Literature Review',
    duration: '1 week',
    tasks: [
      'Deep-dive Self-RAG and CRAG papers',
      'Identify implementation gaps',
      'Build test suite based on paper benchmarks'
    ],
    deliverables: ['Technical spec document', 'Evaluation harness', 'Risk assessment']
  },
  {
    name: 'Pilot Implementation',
    duration: '2 weeks',
    tasks: [
      'Implement CRAG relevance evaluator',
      'Add reflection tokens to prompt',
      'Validate on held-out test set'
    ],
    deliverables: ['Working prototype', 'Benchmark results', 'Performance comparison']
  },
  {
    name: 'A/B Testing',
    duration: '3 weeks',
    tasks: [
      'Deploy to 10% traffic',
      'Track deviation from research claims',
      'Document production behavior'
    ],
    deliverables: ['A/B test report', 'Go/no-go recommendation', 'Rollback plan']
  },
  {
    name: 'Gradual Rollout',
    duration: '4 weeks',
    tasks: [
      '25% → 50% → 75% → 100% traffic',
      'Monitor error rates and latency',
      'Fine-tune thresholds based on production data'
    ],
    deliverables: ['Production deployment', 'Monitoring dashboards', 'Runbooks']
  },
  {
    name: 'Post-Deployment Monitoring',
    duration: 'Ongoing',
    tasks: [
      'Weekly quality audits',
      'Monthly model drift analysis',
      'Quarterly research review for improvements'
    ],
    deliverables: ['Monthly reports', 'Drift alerts', 'Improvement backlog']
  }
];

// Action Items
export const actionItems: ActionItem[] = [
  {
    id: 'action-1',
    title: 'Add Relevance Evaluator',
    description: 'Implement CRAG-style relevance scoring as post-retrieval filter',
    timeframe: 'week1',
    type: 'code',
    codeSnippet: `def evaluate_relevance(query: str, docs: List[Document]) -> List[Document]:
    """CRAG-style relevance evaluator (Paper Section 3.2)"""
    scores = relevance_model.score(query, docs)
    return [doc for doc, score in zip(docs, scores) if score > 0.7]  # Threshold from paper`,
    paperReferences: ['crag-2024'],
    priority: 'high'
  },
  {
    id: 'action-2',
    title: 'Update System Prompt',
    description: 'Replace current prompt with research-backed template including critique steps',
    timeframe: 'week1',
    type: 'code',
    paperReferences: ['selfrag-2024', 'chain-of-note-2024'],
    priority: 'high'
  },
  {
    id: 'action-3',
    title: 'Set Up Monitoring',
    description: 'Implement tracking for retrieval precision, hallucination rate, confidence distribution',
    timeframe: 'week1',
    type: 'monitoring',
    codeSnippet: `metrics_to_track = [
    "retrieval_precision",      # Target: 84% (paper reports 91%)
    "answer_relevance",         # Target: 88% (paper reports 93%)
    "hallucination_rate",       # Target: <8% (paper reports 4%)
    "confidence_distribution"   # Monitor for calibration drift
]`,
    priority: 'high'
  },
  {
    id: 'action-4',
    title: 'Read Core Papers',
    description: 'Deep dive into Self-RAG Section 3 (methodology) and CRAG Section 4.2 (implementation)',
    timeframe: 'month1',
    type: 'research',
    paperReferences: ['selfrag-2024', 'crag-2024'],
    priority: 'medium'
  },
  {
    id: 'action-5',
    title: 'Build Evaluation Harness',
    description: 'Create automated testing using paper benchmarks to validate implementation',
    timeframe: 'month1',
    type: 'experiment',
    codeSnippet: `def run_paper_benchmark(implementation, dataset="wiki_qa"):
    """Reproduce Paper #1's test suite"""
    results = {
        "retrieval_precision": evaluate_retrieval(implementation, dataset),
        "answer_accuracy": evaluate_answers(implementation, dataset),
        "vs_paper_claim": compare_to_paper_results(results)
    }
    assert results["vs_paper_claim"] >= 0.70, "Below 70% of paper claims - debug needed"`,
    paperReferences: ['selfrag-2024'],
    priority: 'medium'
  },
  {
    id: 'action-6',
    title: 'Adversarial Test Suite',
    description: 'Test with noisy documents to validate robustness claims from papers',
    timeframe: 'ongoing',
    type: 'experiment',
    paperReferences: ['chain-of-note-2024'],
    priority: 'low'
  }
];

// Full Dashboard Data
export const dashboardData: DashboardData = {
  title: 'Self-RAG + Corrective Retrieval Adoption Analysis',
  generatedDate: new Date().toISOString().split('T')[0],
  recommendation: {
    status: 'immediate-adopt',
    confidence: 95,
    reasoning: 'Strong research backing (2,847 citations), clear ROI ($71k/year savings), manageable implementation complexity (10 weeks), and production-tested approaches from NeurIPS/ACL venues.'
  },
  comparison: metricComparison,
  papers: researchPapers,
  architecture: architectureComparison,
  promptOptimization,
  capabilities,
  risks: riskFactors,
  diagnostic,
  synthesis: researchSynthesis,
  timeline: implementationTimeline,
  actionItems
};

// Persona-specific emphasis
export const personaEmphasis = {
  cfo: {
    primarySections: ['executive-summary', 'cost-analysis', 'forecast-simulator', 'risk-assessment'],
    hiddenSections: [],
    metricFocus: ['monthlySavings', 'paybackPeriod', 'roiTimeline', 'failedRequestCost'],
    highlightColor: 'success' as const
  },
  cto: {
    primarySections: ['architecture', 'paper-ranking', 'research-synthesis', 'prompt-optimization'],
    hiddenSections: [],
    metricFocus: ['accuracy', 'hallucinationRate', 'latency', 'retrievalPrecision'],
    highlightColor: 'primary' as const
  },
  pm: {
    primarySections: ['executive-summary', 'capability-matrix', 'timeline', 'next-steps'],
    hiddenSections: [],
    metricFocus: ['capabilities', 'timeline', 'userSatisfaction', 'businessValue'],
    highlightColor: 'info' as const
  }
};

// Calculation utilities
export function calculateROI(params: { trafficVolume: number; implementationPercentage: number; improvementFactor: number }) {
  const { trafficVolume, implementationPercentage, improvementFactor } = params;
  const baselineSavings = 5950; // from mock data
  const scaleFactor = (trafficVolume / 100000) * (implementationPercentage / 100) * improvementFactor;
  
  return {
    monthlySavings: Math.round(baselineSavings * scaleFactor),
    qualityImprovement: Math.round(17 * scaleFactor * 100) / 100, // 17% improvement baseline
    roiMonths: Math.round(15000 / (baselineSavings * scaleFactor) * 10) / 10, // $15k implementation cost
    bestCase: Math.round(baselineSavings * scaleFactor * 1.3),
    expectedCase: Math.round(baselineSavings * scaleFactor),
    worstCase: Math.round(baselineSavings * scaleFactor * 0.7)
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
