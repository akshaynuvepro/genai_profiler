import httpx
import asyncio
from typing import List, Dict
from app.config import settings
import arxiv

class ResearchRetriever:
    """Retrieve research papers from Semantic Scholar and arXiv"""

    # Technique to academic query mapping
    TECHNIQUE_QUERIES = {
        "RAG": [
            "retrieval augmented generation evaluation",
            "RAG system performance challenges",
            "retrieval augmented generation limitations production"
        ],
        "LLM_API": [
            "large language model API reliability",
            "LLM production deployment challenges",
            "language model API rate limiting"
        ],
        "VECTOR_DB": [
            "vector database performance comparison",
            "approximate nearest neighbor accuracy tradeoffs",
            "vector similarity search optimization"
        ],
        "EMBEDDINGS": [
            "text embedding quality evaluation",
            "semantic similarity search accuracy",
            "embedding model performance comparison"
        ],
        "AGENTS": [
            "LLM agents reliability evaluation",
            "autonomous agents failure modes",
            "multi-agent systems challenges"
        ],
        "PROMPT_ENGINEERING": [
            "prompt engineering best practices evaluation",
            "prompt optimization techniques empirical",
            "prompt design effectiveness study"
        ]
    }

    async def retrieve_for_techniques(self, techniques: List[Dict]) -> List[Dict]:
        """Retrieve papers for all detected techniques"""
        all_papers = []

        for technique in techniques:
            tech_type = technique.get("type", "")
            queries = self.TECHNIQUE_QUERIES.get(tech_type, [])

            if queries:
                papers = await self._retrieve_papers(queries, technique["name"])
                all_papers.extend(papers)

        # Deduplicate by title
        unique_papers = {}
        for paper in all_papers:
            if paper["title"] not in unique_papers:
                unique_papers[paper["title"]] = paper

        # Sort by relevance score
        sorted_papers = sorted(
            unique_papers.values(),
            key=lambda x: x["relevance_score"],
            reverse=True
        )

        # Limit total papers
        return sorted_papers[:15]

    async def _retrieve_papers(self, queries: List[str], technique_name: str) -> List[Dict]:
        """Retrieve papers for a specific technique"""
        papers = []

        # Try Semantic Scholar first
        for query in queries[:2]:  # Limit queries
            semantic_papers = await self._search_semantic_scholar(query, technique_name)
            papers.extend(semantic_papers)

            # Limit papers per query
            if len(papers) >= settings.max_papers_per_technique:
                break

        # Fallback to arXiv if needed
        if len(papers) < 3:
            for query in queries[:1]:
                arxiv_papers = await self._search_arxiv(query, technique_name)
                papers.extend(arxiv_papers)

        return papers[:settings.max_papers_per_technique]

    async def _search_semantic_scholar(self, query: str, technique: str) -> List[Dict]:
        """Search Semantic Scholar API"""
        try:
            url = "https://api.semanticscholar.org/graph/v1/paper/search"
            params = {
                'query': query,
                'limit': 5,
                'fields': 'title,abstract,year,citationCount,authors,venue,isOpenAccess,externalIds',
                'year': f'{settings.paper_min_year}-2025'
            }

            headers = {}
            if settings.semantic_scholar_api_key:
                headers['x-api-key'] = settings.semantic_scholar_api_key

            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params, headers=headers)

                if response.status_code == 200:
                    data = response.json()
                    papers = []

                    for item in data.get('data', []):
                        paper = self._format_semantic_scholar_paper(item, technique)
                        if paper:
                            papers.append(paper)

                    return papers

        except Exception as e:
            print(f"Semantic Scholar error: {e}")

        return []

    async def _search_arxiv(self, query: str, technique: str) -> List[Dict]:
        """Search arXiv API"""
        try:
            search = arxiv.Search(
                query=query,
                max_results=5,
                sort_by=arxiv.SortCriterion.Relevance
            )

            papers = []
            for result in search.results():
                if result.published.year >= settings.paper_min_year:
                    paper = self._format_arxiv_paper(result, technique)
                    papers.append(paper)

            return papers

        except Exception as e:
            print(f"arXiv error: {e}")
            return []

    def _format_semantic_scholar_paper(self, item: Dict, technique: str) -> Dict:
        """Format Semantic Scholar paper data"""
        abstract = item.get('abstract', '')
        if not abstract or len(abstract) < 100:
            return None

        # Check if experimental
        is_exp, exp_confidence = self._is_experimental(item.get('title', ''), abstract)

        # Calculate relevance score
        relevance = self._calculate_relevance(item, is_exp)

        paper_id = item.get('paperId', '')
        url = f"https://www.semanticscholar.org/paper/{paper_id}" if paper_id else ""

        return {
            "title": item.get('title', ''),
            "abstract": abstract,
            "year": item.get('year', 2023),
            "authors": [a.get('name', '') for a in item.get('authors', [])[:3]],
            "citation_count": item.get('citationCount', 0),
            "url": url,
            "is_experimental": is_exp,
            "relevance_score": relevance,
            "technique": technique
        }

    def _format_arxiv_paper(self, result, technique: str) -> Dict:
        """Format arXiv paper data"""
        is_exp, _ = self._is_experimental(result.title, result.summary)

        return {
            "title": result.title,
            "abstract": result.summary,
            "year": result.published.year,
            "authors": [a.name for a in result.authors[:3]],
            "citation_count": 0,  # arXiv doesn't provide this
            "url": result.entry_id,
            "is_experimental": is_exp,
            "relevance_score": 50.0 if is_exp else 30.0,  # Default scores
            "technique": technique
        }

    def _is_experimental(self, title: str, abstract: str) -> tuple[bool, str]:
        """Check if paper contains experimental work"""
        EXPERIMENTAL_KEYWORDS = [
            'experiment', 'evaluation', 'benchmark', 'dataset',
            'results', 'performance', 'measured', 'tested',
            'empirical', 'study', 'analysis', 'comparison',
            'ablation', 'metrics'
        ]

        text = f"{title} {abstract}".lower()
        keyword_count = sum(1 for kw in EXPERIMENTAL_KEYWORDS if kw in text)

        if keyword_count >= 3:
            return True, "High"
        elif keyword_count >= 2:
            return True, "Medium"
        else:
            return False, "Low"

    def _calculate_relevance(self, paper: Dict, is_experimental: bool) -> float:
        """Calculate paper relevance score"""
        score = 0.0

        # Recency (0-30 points)
        year = paper.get('year', 2023)
        age = 2025 - year
        score += max(0, 30 - (age * 5))

        # Citations (0-30 points)
        citations = min(paper.get('citationCount', 0), 300)
        score += citations / 10

        # Experimental (0-40 points)
        if is_experimental:
            score += 40

        return score
