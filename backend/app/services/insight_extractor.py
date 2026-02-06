from typing import List, Dict
from openai import AsyncOpenAI
from app.config import settings
import json

class InsightExtractor:
    """Extract actionable insights from research papers using LLM"""

    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None

    async def extract_from_papers(self, papers: List[Dict]) -> List[Dict]:
        """Extract insights from all papers"""
        if not self.client:
            # Return mock insights if no API key
            return self._mock_insights(papers)

        insights = []
        for paper in papers[:10]:  # Limit to avoid cost
            try:
                paper_insights = await self._extract_from_paper(paper)
                insights.append(paper_insights)
            except Exception as e:
                print(f"Error extracting from paper: {e}")
                continue

        return insights

    async def _extract_from_paper(self, paper: Dict) -> Dict:
        """Extract insights from a single paper"""
        prompt = self._build_extraction_prompt(paper)

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",  # Cheaper model for extraction
            messages=[
                {"role": "system", "content": "You are an expert at extracting actionable engineering insights from research papers. Extract only concrete, practical findings."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )

        try:
            result = json.loads(response.choices[0].message.content)
        except:
            result = {}

        return {
            "paper_title": paper["title"],
            "paper_year": paper["year"],
            "paper_url": paper["url"],
            "technique": paper["technique"],
            "failure_modes": result.get("failure_modes", []),
            "best_practices": result.get("best_practices", []),
            "performance_findings": result.get("performance_findings", []),
            "implementation_recommendations": result.get("recommendations", [])
        }

    def _build_extraction_prompt(self, paper: Dict) -> str:
        """Build prompt for insight extraction"""
        return f"""Analyze this research paper and extract actionable engineering insights.

Title: {paper['title']}
Year: {paper['year']}
Abstract: {paper['abstract']}

Extract the following in JSON format:

{{
  "failure_modes": [
    {{
      "description": "What can go wrong",
      "conditions": "When does it happen",
      "severity": "Critical/High/Medium/Low",
      "mitigation": "How to prevent or fix it"
    }}
  ],
  "best_practices": [
    {{
      "practice": "What to do",
      "rationale": "Why it helps",
      "evidence": "What the paper found"
    }}
  ],
  "performance_findings": [
    {{
      "finding": "Performance characteristic",
      "metric": "What was measured",
      "value": "Quantitative result if available"
    }}
  ],
  "recommendations": [
    {{
      "recommendation": "Concrete action",
      "impact": "High/Medium/Low",
      "effort": "High/Medium/Low"
    }}
  ]
}}

Focus on:
- Concrete, actionable findings
- Experimental results (if available)
- Practical engineering implications
- Specific numbers and metrics

Be concise and specific. If information isn't in the abstract, leave it empty."""

    def _mock_insights(self, papers: List[Dict]) -> List[Dict]:
        """Generate mock insights for demo purposes"""
        insights = []

        for paper in papers[:5]:
            technique = paper.get("technique", "")

            # Create realistic mock insights based on technique
            if "RAG" in technique:
                insights.append({
                    "paper_title": paper["title"],
                    "paper_year": paper["year"],
                    "paper_url": paper["url"],
                    "technique": technique,
                    "failure_modes": [
                        {
                            "description": "Hallucinations from low-quality retrieval",
                            "conditions": "When similarity scores are below 0.7",
                            "severity": "High",
                            "mitigation": "Implement similarity threshold and return 'no information found' when below threshold"
                        }
                    ],
                    "best_practices": [
                        {
                            "practice": "Set minimum similarity threshold for retrieval",
                            "rationale": "Prevents LLM from generating responses based on irrelevant context",
                            "evidence": "Study shows 45% reduction in hallucinations with threshold >= 0.7"
                        }
                    ],
                    "performance_findings": [
                        {
                            "finding": "Chunk size affects retrieval quality",
                            "metric": "Retrieval accuracy",
                            "value": "Optimal chunk size: 512-1024 tokens"
                        }
                    ],
                    "recommendations": [
                        {
                            "recommendation": "Add similarity score threshold check",
                            "impact": "High",
                            "effort": "Low"
                        }
                    ]
                })

            elif "LLM" in technique or "API" in technique:
                insights.append({
                    "paper_title": paper["title"],
                    "paper_year": paper["year"],
                    "paper_url": paper["url"],
                    "technique": technique,
                    "failure_modes": [
                        {
                            "description": "Rate limit errors during traffic spikes",
                            "conditions": "High concurrent requests without rate limiting",
                            "severity": "High",
                            "mitigation": "Implement exponential backoff and request queuing"
                        }
                    ],
                    "best_practices": [
                        {
                            "practice": "Implement rate limiting and retry logic",
                            "rationale": "Prevents service disruptions and improves reliability",
                            "evidence": "Reduces API failures by 80% in production systems"
                        }
                    ],
                    "performance_findings": [
                        {
                            "finding": "Response latency varies by model size",
                            "metric": "P95 latency",
                            "value": "GPT-4: 2-5s, GPT-3.5: 0.5-1s"
                        }
                    ],
                    "recommendations": [
                        {
                            "recommendation": "Add rate limiting and exponential backoff",
                            "impact": "High",
                            "effort": "Medium"
                        }
                    ]
                })

            elif "VECTOR" in technique or "EMBEDDINGS" in technique:
                insights.append({
                    "paper_title": paper["title"],
                    "paper_year": paper["year"],
                    "paper_url": paper["url"],
                    "technique": technique,
                    "failure_modes": [
                        {
                            "description": "Slow query performance on large datasets",
                            "conditions": "Collections larger than 1M vectors without indexing",
                            "severity": "Medium",
                            "mitigation": "Use HNSW or IVF indexing for approximate search"
                        }
                    ],
                    "best_practices": [
                        {
                            "practice": "Optimize index configuration for your dataset size",
                            "rationale": "Balances accuracy and latency",
                            "evidence": "HNSW provides 95%+ recall with 10x speedup"
                        }
                    ],
                    "performance_findings": [
                        {
                            "finding": "Index type affects query latency",
                            "metric": "Query time",
                            "value": "HNSW: 10ms, Flat: 500ms for 1M vectors"
                        }
                    ],
                    "recommendations": [
                        {
                            "recommendation": "Configure appropriate vector index",
                            "impact": "Medium",
                            "effort": "Low"
                        }
                    ]
                })

        return insights
