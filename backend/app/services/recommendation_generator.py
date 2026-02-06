from typing import List, Dict, Tuple
import re

class RecommendationGenerator:
    """Generate prioritized recommendations based on insights and codebase"""

    def __init__(self, techniques: List[Dict], parsed_data: Dict, insights: List[Dict]):
        self.techniques = techniques
        self.parsed_data = parsed_data
        self.insights = insights

    async def generate(self) -> Tuple[List[Dict], List[Dict]]:
        """Generate recommendations and failure modes"""
        recommendations = []
        failure_modes = []

        # Extract all failure modes
        for insight in self.insights:
            for fm in insight.get("failure_modes", []):
                failure_mode = {
                    "description": fm.get("description", ""),
                    "conditions": fm.get("conditions", ""),
                    "severity": fm.get("severity", "Medium"),
                    "mitigation": fm.get("mitigation", ""),
                    "source_paper": insight["paper_title"]
                }
                failure_modes.append(failure_mode)

                # Generate recommendation for each failure mode
                rec = self._failure_mode_to_recommendation(failure_mode, insight)
                if rec:
                    recommendations.append(rec)

        # Generate recommendations from best practices
        for insight in self.insights:
            for bp in insight.get("best_practices", []):
                rec = self._best_practice_to_recommendation(bp, insight)
                if rec:
                    recommendations.append(rec)

        # Generate recommendations from implementation recommendations
        for insight in self.insights:
            for impl_rec in insight.get("implementation_recommendations", []):
                rec = self._implementation_to_recommendation(impl_rec, insight)
                if rec:
                    recommendations.append(rec)

        # Deduplicate and sort
        recommendations = self._deduplicate_recommendations(recommendations)
        recommendations = sorted(recommendations, key=lambda x: (x["priority"], -self._impact_score(x)))

        return recommendations[:10], failure_modes  # Limit to top 10

    def _failure_mode_to_recommendation(self, failure_mode: Dict, insight: Dict) -> Dict:
        """Convert failure mode to recommendation"""
        severity = failure_mode.get("severity", "Medium")

        # Map severity to recommendation type
        if severity in ["Critical", "High"]:
            rec_type = "Critical"
            priority = 1
        else:
            rec_type = "Important"
            priority = 2

        # Try to find code locations
        locations = self._find_relevant_code_locations(insight["technique"])

        return {
            "type": rec_type,
            "title": f"Mitigate: {failure_mode['description']}",
            "description": f"{failure_mode['description']}. {failure_mode['conditions']}",
            "action_steps": [
                failure_mode.get("mitigation", "Review implementation"),
                "Test the mitigation in staging",
                "Monitor for the failure condition"
            ],
            "code_example": None,
            "evidence": {
                "paper": insight["paper_title"],
                "finding": failure_mode["description"],
                "year": str(insight["paper_year"])
            },
            "impact": self._severity_to_impact(severity),
            "effort": self._estimate_effort(failure_mode),
            "confidence": "High" if insight.get("paper_year", 2023) >= 2023 else "Medium",
            "caveats": self._generate_caveats(insight),
            "code_locations": locations,
            "priority": priority
        }

    def _best_practice_to_recommendation(self, best_practice: Dict, insight: Dict) -> Dict:
        """Convert best practice to recommendation"""
        locations = self._find_relevant_code_locations(insight["technique"])

        return {
            "type": "Important",
            "title": best_practice.get("practice", "Implement best practice"),
            "description": best_practice.get("rationale", ""),
            "action_steps": self._generate_action_steps(best_practice),
            "code_example": None,
            "evidence": {
                "paper": insight["paper_title"],
                "finding": best_practice.get("evidence", ""),
                "year": str(insight["paper_year"])
            },
            "impact": "Medium",
            "effort": "Medium",
            "confidence": "High" if insight.get("paper_year", 2023) >= 2023 else "Medium",
            "caveats": self._generate_caveats(insight),
            "code_locations": locations,
            "priority": 2
        }

    def _implementation_to_recommendation(self, impl_rec: Dict, insight: Dict) -> Dict:
        """Convert implementation recommendation to recommendation"""
        impact = impl_rec.get("impact", "Medium")
        effort = impl_rec.get("effort", "Medium")

        # Lower priority for optimizations
        priority = 3

        locations = self._find_relevant_code_locations(insight["technique"])

        return {
            "type": "Nice-to-have",
            "title": impl_rec.get("recommendation", "Optimization opportunity"),
            "description": f"Based on research findings from {insight['paper_title']}",
            "action_steps": [
                impl_rec.get("recommendation", ""),
                "Measure baseline performance",
                "Implement and compare results"
            ],
            "code_example": None,
            "evidence": {
                "paper": insight["paper_title"],
                "finding": impl_rec.get("recommendation", ""),
                "year": str(insight["paper_year"])
            },
            "impact": impact,
            "effort": effort,
            "confidence": "Medium",
            "caveats": self._generate_caveats(insight),
            "code_locations": locations,
            "priority": priority
        }

    def _find_relevant_code_locations(self, technique: str) -> List[str]:
        """Find code locations relevant to a technique"""
        locations = []

        # Find techniques that match
        matching_techniques = [t for t in self.techniques if technique in t.get("name", "")]

        for tech in matching_techniques:
            locations.extend(tech.get("locations", [])[:3])  # Limit to 3

        return locations[:5]  # Total limit

    def _severity_to_impact(self, severity: str) -> str:
        """Convert severity to impact"""
        mapping = {
            "Critical": "High",
            "High": "High",
            "Medium": "Medium",
            "Low": "Low"
        }
        return mapping.get(severity, "Medium")

    def _estimate_effort(self, failure_mode: Dict) -> str:
        """Estimate implementation effort"""
        mitigation = failure_mode.get("mitigation", "").lower()

        # Simple heuristics
        if any(word in mitigation for word in ["threshold", "check", "validate", "log"]):
            return "Low"
        elif any(word in mitigation for word in ["refactor", "redesign", "implement"]):
            return "High"
        else:
            return "Medium"

    def _generate_action_steps(self, best_practice: Dict) -> List[str]:
        """Generate action steps for best practice"""
        practice = best_practice.get("practice", "")

        steps = [
            f"Implement: {practice}",
            "Review existing code for conflicts",
            "Test thoroughly before deployment"
        ]

        return steps

    def _generate_caveats(self, insight: Dict) -> List[str]:
        """Generate caveats for recommendation"""
        caveats = []

        year = insight.get("paper_year", 2023)
        if year < 2023:
            caveats.append("Based on older research; newer approaches may exist")

        if not insight.get("failure_modes") and not insight.get("performance_findings"):
            caveats.append("Theoretical finding; experimental validation recommended")

        return caveats

    def _deduplicate_recommendations(self, recommendations: List[Dict]) -> List[Dict]:
        """Remove duplicate recommendations"""
        seen_titles = set()
        unique = []

        for rec in recommendations:
            title = rec["title"].lower()
            if title not in seen_titles:
                seen_titles.add(title)
                unique.append(rec)

        return unique

    def _impact_score(self, rec: Dict) -> int:
        """Calculate numeric impact score for sorting"""
        impact_map = {"High": 3, "Medium": 2, "Low": 1}
        return impact_map.get(rec.get("impact", "Medium"), 2)
