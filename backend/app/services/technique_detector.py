import re
from typing import Dict, List, Literal

class TechniqueDetector:
    """Detect GenAI techniques from parsed codebase"""

    # Library mappings for GenAI techniques
    GENAI_LIBRARIES = {
        'openai': 'LLM_API',
        'anthropic': 'LLM_API',
        'langchain': 'RAG',
        'llama-index': 'RAG',
        'llamaindex': 'RAG',
        'chromadb': 'VECTOR_DB',
        'pinecone': 'VECTOR_DB',
        'weaviate': 'VECTOR_DB',
        'faiss': 'VECTOR_DB',
        'qdrant': 'VECTOR_DB',
        'transformers': 'MODEL_INFERENCE',
        'sentence-transformers': 'EMBEDDINGS',
        'sentencetransformers': 'EMBEDDINGS',
        'cohere': 'LLM_API',
        'together': 'LLM_API',
    }

    # Code patterns for different techniques
    RAG_PATTERNS = [
        r'similarity_search',
        r'vector_search',
        r'retrieve',
        r'query_embedding',
        r'get_relevant_documents',
        r'VectorStore',
        r'Retriever',
    ]

    AGENT_PATTERNS = [
        r'agent',
        r'tool',
        r'function_calling',
        r'while.*step',
        r'max_iterations',
        r'thought',
        r'reasoning',
        r'plan',
    ]

    PROMPT_PATTERNS = [
        r'prompt\s*=',
        r'template\s*=',
        r'f".*{.*}"',
        r'\.format\(',
        r'PromptTemplate',
        r'ChatPromptTemplate',
    ]

    def __init__(self, parsed_data: Dict):
        self.parsed_data = parsed_data
        self.techniques = []

    async def detect(self) -> List[Dict]:
        """Detect all GenAI techniques"""
        # Detect from libraries
        await self._detect_from_libraries()

        # Detect from code patterns
        await self._detect_from_patterns()

        # Deduplicate and enrich
        return self._finalize_techniques()

    async def _detect_from_libraries(self):
        """Detect techniques based on imported libraries"""
        imports = set(self.parsed_data.get("imports", []))
        dependencies = self.parsed_data.get("dependencies", {})

        all_libs = imports.union(set(dependencies.keys()))

        technique_libs = {}
        for lib in all_libs:
            lib_lower = lib.lower().replace('-', '').replace('_', '')
            for pattern, technique in self.GENAI_LIBRARIES.items():
                pattern_clean = pattern.replace('-', '').replace('_', '')
                if pattern_clean in lib_lower or lib_lower in pattern_clean:
                    if technique not in technique_libs:
                        technique_libs[technique] = []
                    technique_libs[technique].append(lib)

        # Convert to technique detections
        for technique, libs in technique_libs.items():
            self.techniques.append({
                "name": self._technique_display_name(technique),
                "confidence": "High",
                "indicators": [f"Library: {lib}" for lib in libs],
                "locations": [],
                "description": self._technique_description(technique),
                "type": technique
            })

    async def _detect_from_patterns(self):
        """Detect techniques based on code patterns"""
        code_patterns = self.parsed_data.get("code_patterns", {})

        # Check each file for patterns
        rag_files = []
        agent_files = []
        prompt_files = []

        for file_path, data in code_patterns.items():
            content = data.get("content", "")

            # RAG patterns
            if any(re.search(pattern, content, re.IGNORECASE) for pattern in self.RAG_PATTERNS):
                rag_files.append(file_path)

            # Agent patterns
            if any(re.search(pattern, content, re.IGNORECASE) for pattern in self.AGENT_PATTERNS):
                agent_files.append(file_path)

            # Prompt patterns
            if any(re.search(pattern, content, re.IGNORECASE) for pattern in self.PROMPT_PATTERNS):
                prompt_files.append(file_path)

        # Add RAG detection if not already detected
        if rag_files and not any(t["type"] == "RAG" for t in self.techniques):
            self.techniques.append({
                "name": "RAG (Retrieval-Augmented Generation)",
                "confidence": "Medium",
                "indicators": [f"Pattern match in {len(rag_files)} file(s)"],
                "locations": rag_files[:5],  # Limit to 5 files
                "description": self._technique_description("RAG"),
                "type": "RAG"
            })

        # Add Agent detection
        if agent_files:
            existing_agent = next((t for t in self.techniques if t["type"] == "AGENTS"), None)
            if existing_agent:
                existing_agent["locations"].extend(agent_files[:5])
            else:
                self.techniques.append({
                    "name": "AI Agents",
                    "confidence": "Medium",
                    "indicators": [f"Pattern match in {len(agent_files)} file(s)"],
                    "locations": agent_files[:5],
                    "description": self._technique_description("AGENTS"),
                    "type": "AGENTS"
                })

        # Add Prompt Engineering detection
        if prompt_files:
            self.techniques.append({
                "name": "Prompt Engineering",
                "confidence": "Medium",
                "indicators": [f"Pattern match in {len(prompt_files)} file(s)"],
                "locations": prompt_files[:5],
                "description": self._technique_description("PROMPT_ENGINEERING"),
                "type": "PROMPT_ENGINEERING"
            })

    def _finalize_techniques(self) -> List[Dict]:
        """Deduplicate and enrich technique detections"""
        # Merge duplicates by type
        final = {}
        for tech in self.techniques:
            tech_type = tech["type"]
            if tech_type not in final:
                final[tech_type] = tech
            else:
                # Merge indicators and locations
                final[tech_type]["indicators"].extend(tech["indicators"])
                final[tech_type]["locations"].extend(tech["locations"])
                # Upgrade confidence if library was detected
                if tech["confidence"] == "High":
                    final[tech_type]["confidence"] = "High"

        return list(final.values())

    def _technique_display_name(self, technique: str) -> str:
        """Get display name for technique"""
        names = {
            "LLM_API": "LLM API Integration",
            "RAG": "RAG (Retrieval-Augmented Generation)",
            "VECTOR_DB": "Vector Database",
            "EMBEDDINGS": "Embedding Generation",
            "MODEL_INFERENCE": "Model Inference",
            "AGENTS": "AI Agents",
            "PROMPT_ENGINEERING": "Prompt Engineering",
        }
        return names.get(technique, technique)

    def _technique_description(self, technique: str) -> str:
        """Get description for technique"""
        descriptions = {
            "LLM_API": "Using Large Language Model APIs for text generation and completion",
            "RAG": "Retrieval-Augmented Generation: combining document retrieval with LLM generation",
            "VECTOR_DB": "Vector database for storing and searching embeddings",
            "EMBEDDINGS": "Converting text to vector embeddings for semantic search",
            "MODEL_INFERENCE": "Running ML model inference locally",
            "AGENTS": "Autonomous AI agents with tool usage and reasoning capabilities",
            "PROMPT_ENGINEERING": "Structured prompt templates and prompt optimization techniques",
        }
        return descriptions.get(technique, "GenAI technique detected in codebase")
