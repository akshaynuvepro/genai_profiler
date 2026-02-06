import asyncio
import zipfile
import shutil
from pathlib import Path
from datetime import datetime
from typing import Callable, Optional
from app.models.schemas import AnalysisReport, TechniqueDetection, Recommendation, Paper, FailureMode
from app.services.code_parser import CodeParser
from app.services.technique_detector import TechniqueDetector
from app.services.research_retriever import ResearchRetriever
from app.services.insight_extractor import InsightExtractor
from app.services.recommendation_generator import RecommendationGenerator

class CodebaseAnalyzer:
    def __init__(self, zip_path: Path, codebase_name: str):
        self.zip_path = zip_path
        self.codebase_name = codebase_name.replace('.zip', '')
        self.extract_dir = None

    async def analyze(self, progress_callback: Optional[Callable] = None) -> dict:
        """Main analysis pipeline"""
        start_time = datetime.now()

        try:
            # Step 1: Extract files (10-20%)
            if progress_callback:
                progress_callback(10, "Extracting files...")
            self.extract_dir = await self._extract_zip()

            # Step 2: Parse codebase (20-30%)
            if progress_callback:
                progress_callback(20, "Parsing codebase...")
            parser = CodeParser(self.extract_dir)
            parsed_data = await parser.parse()

            # Step 3: Detect techniques (30-40%)
            if progress_callback:
                progress_callback(30, "Detecting GenAI techniques...")
            detector = TechniqueDetector(parsed_data)
            techniques = await detector.detect()

            # Step 4: Retrieve research papers (40-60%)
            if progress_callback:
                progress_callback(40, "Retrieving research papers...")
            retriever = ResearchRetriever()
            papers = await retriever.retrieve_for_techniques(techniques)

            # Step 5: Extract insights (60-75%)
            if progress_callback:
                progress_callback(60, "Extracting insights from papers...")
            extractor = InsightExtractor()
            insights = await extractor.extract_from_papers(papers)

            # Step 6: Generate recommendations (75-90%)
            if progress_callback:
                progress_callback(75, "Generating recommendations...")
            generator = RecommendationGenerator(techniques, parsed_data, insights)
            recommendations, failure_modes = await generator.generate()

            # Step 7: Build report (90-100%)
            if progress_callback:
                progress_callback(90, "Building final report...")

            duration = (datetime.now() - start_time).total_seconds()

            report = self._build_report(
                techniques=techniques,
                papers=papers,
                recommendations=recommendations,
                failure_modes=failure_modes,
                duration=duration
            )

            if progress_callback:
                progress_callback(100, "Analysis complete!")

            return report

        finally:
            # Cleanup extracted files
            if self.extract_dir and self.extract_dir.exists():
                shutil.rmtree(self.extract_dir)

    async def _extract_zip(self) -> Path:
        """Extract ZIP file to temporary directory"""
        extract_dir = self.zip_path.parent / f"extracted_{self.zip_path.stem}"
        extract_dir.mkdir(exist_ok=True)

        with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)

        return extract_dir

    def _build_report(
        self,
        techniques: list,
        papers: list,
        recommendations: list,
        failure_modes: list,
        duration: float
    ) -> dict:
        """Build final analysis report"""

        # Calculate risk level
        critical_count = sum(1 for r in recommendations if r["type"] == "Critical")
        if critical_count >= 3:
            risk = "High"
        elif critical_count >= 1:
            risk = "Medium"
        else:
            risk = "Low"

        return {
            "timestamp": datetime.now().isoformat(),
            "codebase_name": self.codebase_name,
            "analysis_duration": duration,
            "overall_risk": risk,
            "critical_issues": critical_count,
            "techniques_detected": len(techniques),
            "papers_analyzed": len(papers),
            "techniques": techniques,
            "failure_modes": failure_modes,
            "recommendations": sorted(recommendations, key=lambda x: x["priority"]),
            "papers": papers,
            "confidence_notes": self._generate_confidence_notes(techniques),
            "limitations": [
                "Analysis based on static code patterns (may miss runtime behavior)",
                "Research findings may not apply to your specific use case",
                "Recommendations are suggestions, not requirements",
                "Manual verification recommended for critical changes"
            ]
        }

    def _generate_confidence_notes(self, techniques: list) -> list:
        """Generate notes about confidence levels"""
        notes = []

        high_conf = sum(1 for t in techniques if t["confidence"] == "High")
        medium_conf = sum(1 for t in techniques if t["confidence"] == "Medium")
        low_conf = sum(1 for t in techniques if t["confidence"] == "Low")

        if high_conf > 0:
            notes.append(f"{high_conf} technique(s) detected with high confidence")
        if medium_conf > 0:
            notes.append(f"{medium_conf} technique(s) detected with medium confidence - recommend manual verification")
        if low_conf > 0:
            notes.append(f"{low_conf} technique(s) detected with low confidence - may be false positives")

        return notes
