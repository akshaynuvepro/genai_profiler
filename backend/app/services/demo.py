from datetime import datetime

def generate_demo_report():
    """Generate a pre-made demo report for showcase"""
    return {
        "timestamp": datetime.now().isoformat(),
        "codebase_name": "rag-chatbot-demo",
        "analysis_duration": 45.2,
        "overall_risk": "Medium",
        "critical_issues": 2,
        "techniques_detected": 4,
        "papers_analyzed": 8,
        "techniques": [
            {
                "name": "RAG (Retrieval-Augmented Generation)",
                "confidence": "High",
                "indicators": [
                    "Library: langchain",
                    "Library: chromadb",
                    "Pattern match in 3 file(s)"
                ],
                "locations": [
                    "src/retrieval/search.py",
                    "src/generation/answer.py",
                    "src/utils/vector_store.py"
                ],
                "description": "Retrieval-Augmented Generation: combining document retrieval with LLM generation"
            },
            {
                "name": "LLM API Integration",
                "confidence": "High",
                "indicators": [
                    "Library: openai",
                    "Pattern match in 5 file(s)"
                ],
                "locations": [
                    "src/generation/llm.py",
                    "src/agents/planner.py",
                    "src/evaluation/scoring.py"
                ],
                "description": "Using Large Language Model APIs for text generation and completion"
            },
            {
                "name": "Vector Database",
                "confidence": "High",
                "indicators": [
                    "Library: chromadb"
                ],
                "locations": [
                    "src/storage/vectors.py",
                    "src/retrieval/search.py"
                ],
                "description": "Vector database for storing and searching embeddings"
            },
            {
                "name": "Prompt Engineering",
                "confidence": "Medium",
                "indicators": [
                    "Pattern match in 4 file(s)"
                ],
                "locations": [
                    "src/prompts/templates.py",
                    "src/generation/answer.py"
                ],
                "description": "Structured prompt templates and prompt optimization techniques"
            }
        ],
        "failure_modes": [
            {
                "description": "Hallucinations from low-quality retrieval",
                "conditions": "When similarity scores are below 0.7",
                "severity": "High",
                "mitigation": "Implement similarity threshold and return 'no information found' when below threshold",
                "source_paper": "Evaluating Retrieval-Augmented Generation Systems in Production"
            },
            {
                "description": "Rate limit errors during traffic spikes",
                "conditions": "High concurrent requests without rate limiting",
                "severity": "High",
                "mitigation": "Implement exponential backoff and request queuing",
                "source_paper": "Reliability Patterns for Production LLM Applications"
            },
            {
                "description": "Slow query performance on large datasets",
                "conditions": "Collections larger than 1M vectors without indexing",
                "severity": "Medium",
                "mitigation": "Use HNSW or IVF indexing for approximate search",
                "source_paper": "Vector Database Performance Optimization Study"
            }
        ],
        "recommendations": [
            {
                "type": "Critical",
                "title": "Add retrieval quality threshold",
                "description": "Your RAG system retrieves documents without checking similarity scores. Research shows this causes hallucinations in 45% more responses.",
                "action_steps": [
                    "Add threshold check after vector search (threshold >= 0.7)",
                    "Return 'No relevant information found' if below threshold",
                    "Log similarity scores for monitoring"
                ],
                "code_example": "# In src/retrieval/search.py\nresults = vector_db.similarity_search(query, k=5)\nfiltered = [r for r in results if r.score >= 0.7]\nif not filtered:\n    return None",
                "evidence": {
                    "paper": "Evaluating Retrieval-Augmented Generation Systems in Production",
                    "finding": "Systems without thresholds hallucinate 45% more often",
                    "year": "2024"
                },
                "impact": "High",
                "effort": "Low",
                "confidence": "High",
                "caveats": [],
                "code_locations": ["src/retrieval/search.py:45"],
                "priority": 1
            },
            {
                "type": "Critical",
                "title": "Implement rate limiting for LLM API",
                "description": "No rate limiting detected for OpenAI API calls. This will cause failures during traffic spikes.",
                "action_steps": [
                    "Add rate limiter with token bucket algorithm",
                    "Implement exponential backoff for retries",
                    "Queue requests when approaching limits"
                ],
                "code_example": "from tenacity import retry, stop_after_attempt, wait_exponential\n\n@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=10))\nasync def call_llm(prompt):\n    return await openai.chat.completions.create(...)",
                "evidence": {
                    "paper": "Reliability Patterns for Production LLM Applications",
                    "finding": "Rate limiting reduces API failures by 80%",
                    "year": "2024"
                },
                "impact": "High",
                "effort": "Medium",
                "confidence": "High",
                "caveats": [],
                "code_locations": ["src/generation/llm.py:23"],
                "priority": 1
            },
            {
                "type": "Important",
                "title": "Add prompt versioning",
                "description": "Prompt templates are hardcoded without version tracking. This makes debugging and iteration difficult.",
                "action_steps": [
                    "Create prompt version registry",
                    "Log prompt version with each request",
                    "Implement A/B testing framework for prompts"
                ],
                "code_example": "PROMPTS = {\n    'v1': 'Answer: {question}',\n    'v2': 'Based on context, answer: {question}'\n}\n\nresponse = llm(PROMPTS['v2'].format(question=q))",
                "evidence": {
                    "paper": "Prompt Engineering Best Practices from Production Systems",
                    "finding": "Version tracking enables 3x faster iteration",
                    "year": "2023"
                },
                "impact": "Medium",
                "effort": "Low",
                "confidence": "High",
                "caveats": [],
                "code_locations": ["src/prompts/templates.py"],
                "priority": 2
            },
            {
                "type": "Important",
                "title": "Implement output validation",
                "description": "LLM outputs are returned directly without validation. Research shows 23% contain formatting errors.",
                "action_steps": [
                    "Define Pydantic models for expected outputs",
                    "Validate JSON structure before returning",
                    "Add retry logic for malformed outputs"
                ],
                "code_example": "from pydantic import BaseModel\n\nclass Answer(BaseModel):\n    text: str\n    confidence: float\n    sources: list[str]\n\nresponse = Answer.model_validate_json(llm_output)",
                "evidence": {
                    "paper": "LLM Output Reliability in Production Systems",
                    "finding": "Structured validation reduces errors by 78%",
                    "year": "2024"
                },
                "impact": "Medium",
                "effort": "Medium",
                "confidence": "High",
                "caveats": [],
                "code_locations": ["src/generation/answer.py"],
                "priority": 2
            },
            {
                "type": "Nice-to-have",
                "title": "Optimize vector index configuration",
                "description": "Using default flat index. HNSW indexing could provide 10x speedup.",
                "action_steps": [
                    "Configure HNSW index for collections > 10k vectors",
                    "Tune M and ef_construction parameters",
                    "Benchmark query latency improvements"
                ],
                "code_example": "collection = chromadb.create_collection(\n    name='docs',\n    metadata={'hnsw:space': 'cosine', 'hnsw:M': 32}\n)",
                "evidence": {
                    "paper": "Vector Database Performance Optimization Study",
                    "finding": "HNSW provides 95%+ recall with 10x speedup",
                    "year": "2023"
                },
                "impact": "Medium",
                "effort": "Low",
                "confidence": "Medium",
                "caveats": ["Results vary by dataset size and query patterns"],
                "code_locations": ["src/storage/vectors.py"],
                "priority": 3
            }
        ],
        "papers": [
            {
                "title": "Evaluating Retrieval-Augmented Generation Systems in Production",
                "abstract": "We present a comprehensive evaluation of RAG systems in production environments...",
                "year": 2024,
                "authors": ["Smith, J.", "Johnson, A.", "Williams, B."],
                "citation_count": 156,
                "url": "https://www.semanticscholar.org/paper/example1",
                "is_experimental": True,
                "relevance_score": 92.5
            },
            {
                "title": "Reliability Patterns for Production LLM Applications",
                "abstract": "This study examines reliability patterns in large-scale LLM deployments...",
                "year": 2024,
                "authors": ["Davis, K.", "Martinez, L."],
                "citation_count": 89,
                "url": "https://www.semanticscholar.org/paper/example2",
                "is_experimental": True,
                "relevance_score": 87.0
            }
        ],
        "confidence_notes": [
            "4 technique(s) detected with high or medium confidence",
            "Analysis based on 8 recent research papers (2023-2024)",
            "Recommendations prioritized by severity and evidence quality"
        ],
        "limitations": [
            "Analysis based on static code patterns (may miss runtime behavior)",
            "Research findings may not apply to your specific use case",
            "Recommendations are suggestions, not requirements",
            "Manual verification recommended for critical changes"
        ]
    }
