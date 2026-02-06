from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal
from datetime import datetime

class TechniqueDetection(BaseModel):
    name: str
    confidence: Literal["High", "Medium", "Low"]
    indicators: List[str]
    locations: List[str]  # File paths and line numbers
    description: str

class Paper(BaseModel):
    title: str
    abstract: str
    year: int
    authors: List[str]
    citation_count: int
    url: str
    is_experimental: bool
    relevance_score: float

class FailureMode(BaseModel):
    description: str
    conditions: str
    severity: Literal["Critical", "High", "Medium", "Low"]
    mitigation: str
    source_paper: str

class Recommendation(BaseModel):
    type: Literal["Critical", "Important", "Nice-to-have"]
    title: str
    description: str
    action_steps: List[str]
    code_example: Optional[str] = None
    evidence: Dict[str, str]  # paper, finding, year
    impact: Literal["High", "Medium", "Low"]
    effort: Literal["High", "Medium", "Low"]
    confidence: Literal["High", "Medium", "Low"]
    caveats: List[str]
    code_locations: List[str]
    priority: int

class AnalysisReport(BaseModel):
    timestamp: datetime
    codebase_name: str
    analysis_duration: float

    # Summary
    overall_risk: Literal["High", "Medium", "Low"]
    critical_issues: int
    techniques_detected: int
    papers_analyzed: int

    # Details
    techniques: List[TechniqueDetection]
    failure_modes: List[FailureMode]
    recommendations: List[Recommendation]
    papers: List[Paper]

    # Metadata
    confidence_notes: List[str]
    limitations: List[str]

class AnalysisRequest(BaseModel):
    codebase_name: str

class AnalysisStatus(BaseModel):
    status: Literal["pending", "processing", "completed", "failed"]
    progress: int  # 0-100
    message: str
    result: Optional[AnalysisReport] = None
    error: Optional[str] = None
