# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GenAI Profiler is a research-aware profiling system that analyzes GenAI product codebases, identifies architectural patterns, retrieves relevant research papers, and generates evidence-based recommendations.

**Stack:**
- Backend: FastAPI (Python 3.9+) with async/await
- Frontend: React 18 + TypeScript + Vite + shadcn/ui + Tailwind CSS
- APIs: Semantic Scholar, arXiv, OpenAI

## Development Commands

### Backend

```bash
# Setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Run server (default: http://localhost:8000)
uvicorn app.main:app --reload

# Run on different port
uvicorn app.main:app --reload --port 8001

# API docs available at http://localhost:8000/docs
```

### Frontend

```bash
# Setup
cd frontend
npm install

# Run dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

### Quick Start

Use the provided startup scripts:
```bash
# Windows
start.bat

# macOS/Linux
./start.sh
```

## Architecture

### Backend Service Pipeline

The backend follows a **service-oriented architecture** with a clear data flow:

1. **API Layer** (`app/api/routes.py`)
   - POST `/api/v1/upload` - Upload codebase ZIP
   - GET `/api/v1/status/{job_id}` - Check analysis progress
   - GET `/api/v1/result/{job_id}` - Retrieve report
   - GET `/api/v1/demo-report` - Pre-generated demo data

2. **Analysis Pipeline** (`app/services/analyzer.py`)
   - Orchestrates the entire analysis flow
   - Manages background tasks for long-running operations
   - Coordinates between services

3. **Service Chain** (executed sequentially):
   - **Code Parser** (`code_parser.py`) - Extracts Python AST, dependencies, file structure
   - **Technique Detector** (`technique_detector.py`) - Identifies GenAI patterns (RAG, LLM API, Vector DB, Agents, Prompts, Embeddings)
   - **Research Retriever** (`research_retriever.py`) - Queries Semantic Scholar + arXiv for relevant papers
   - **Insight Extractor** (`insight_extractor.py`) - Uses LLM to extract failure modes, best practices, performance findings
   - **Recommendation Generator** (`recommendation_generator.py`) - Creates risk-based recommendations (Critical/Important/Nice-to-have)

4. **Data Models** (`app/models/schemas.py`)
   - All Pydantic models for type safety
   - Request/response validation
   - Structured insight schemas

### Frontend Component Structure

- **Main App** (`App.tsx`) - Routes and state management
- **FileUpload** (`components/FileUpload.tsx`) - Drag-and-drop ZIP upload
- **AnalysisProgress** (`components/AnalysisProgress.tsx`) - Real-time progress polling
- **ReportView** (`components/ReportView.tsx`) - Comprehensive results display
- **Dashboard Components** (`components/dashboard/*`) - Advanced visualization components
- **UI Components** (`components/ui/*`) - shadcn/ui primitives (DO NOT modify these)

### Key Design Patterns

1. **Background Task Processing**: Large analysis jobs run in FastAPI background tasks
2. **Async/Await Throughout**: All I/O operations are async for performance
3. **Multi-Signal Detection**: Technique detection uses multiple indicators with confidence scoring
4. **Fallback Strategies**: Graceful degradation when APIs fail or API keys missing
5. **Type Safety**: Pydantic in backend, TypeScript in frontend

## Configuration

### Environment Variables

Backend `.env` file (required):
```env
# LLM API (required for real insights, works with mock data if missing)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here  # Alternative to OpenAI

# Research APIs (optional, increases rate limits)
SEMANTIC_SCHOLAR_API_KEY=your_key_here

# Server config (optional)
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Important Configuration Notes

- **Without API Keys**: System uses pre-generated mock data
- **Semantic Scholar**: 100 req/5min without key, 5000 req/5min with key
- **Upload Limit**: 50MB max (configurable in `app/config.py`)
- **CORS**: Configured for local dev (localhost:5173, localhost:3000)

## Frontend Architecture & Features

### Mandatory Features (ALL must be preserved)

The frontend has **TWO main interfaces**:

1. **Upload/Analysis Flow** (`App.tsx`)
   - File upload with drag & drop
   - Real-time progress tracking
   - Comprehensive report viewing
   - Demo mode with simulated progress

2. **Research Dashboard** (`pages/Index.tsx`)
   - 14 specialized dashboard components
   - Persona switching (CTO/CFO/PM)
   - Interactive ROI calculator
   - Mermaid architecture diagrams
   - Cost/quality/risk analysis

### Core Components (DO NOT remove or simplify)

**Upload Flow:**
- `FileUpload.tsx` - Drag & drop, demo button, validation
- `AnalysisProgress.tsx` - Progress bar, stage indicators, polling
- `ReportView.tsx` - Accordions, badges, metrics, recommendations

**Dashboard Components:** (all 14 must be preserved)
- `DashboardHeader` - Persona tabs, status badges, metadata
- `ExecutiveSummary` - 3 metric cards with before/after comparison
- `ResearchDiagnostic` - Bottleneck analysis, severity gauge
- `PaperRankingEngine` - Filterable/sortable paper list
- `ArchitectureVisualization` - Mermaid diagrams, node breakdown
- `CostAnalysis` - Savings calculation, payback period
- `QualityDeepDive` - Metric comparisons, SOTA benchmarks
- `PromptOptimization` - Side-by-side prompt comparison
- `CapabilityMatrix` - Feature comparison grid
- `ForecastSimulator` - **Interactive sliders, live ROI calculation**
- `RiskAssessment` - Risk matrix, mitigation strategies
- `ResearchSynthesis` - Consensus/conflicts/gaps
- `NextSteps` - Action items with code snippets
- `MermaidDiagram` - Diagram rendering component

### Styling Requirements

**ONLY Tailwind + shadcn/ui - NO custom CSS:**

```tsx
// ❌ NEVER do this
<div className="custom-card glow-effect" />

// ✅ ALWAYS do this
<div className="bg-gradient-to-br from-green-100/80 to-white border border-green-200 shadow-lg" />
```

**Color System (use Tailwind colors):**
- Success: `bg-green-100 text-green-700 border-green-300`
- Primary: `bg-blue-100 text-blue-700 border-blue-300`
- Info: `bg-cyan-100 text-cyan-700 border-cyan-300`
- Warning: `bg-yellow-100 text-yellow-700 border-yellow-300`
- Destructive: `bg-red-100 text-red-700 border-red-300`

**Animations:**
- Use `framer-motion` for complex animations
- Use Tailwind transitions for hover/focus states
- Example: `transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`

### Key Data Structures

**Mock Data** (`data/mockData.ts`):
- 5 research papers with citations, findings, applicability
- Architecture comparison (current vs proposed Mermaid diagrams)
- Comprehensive metrics (cost, quality, latency, risk)
- Prompt optimization templates
- 7 capabilities with maturity indicators
- 7 risk factors with mitigation
- Implementation timeline (5 phases)
- 6 action items with code snippets

**Hooks:**
- `usePersona` - Manages CTO/CFO/PM switching
- `useForecast` - ROI calculator logic

**Types** (`types/dashboard.ts`):
- 30+ TypeScript interfaces for type safety

### Dependencies

**Required:**
- `framer-motion` - Animations
- `react-markdown` - Markdown rendering (optional)
- `mermaid` - Diagram rendering (if not present, add it)
- `lucide-react` - Icons
- `axios` - HTTP client

**shadcn/ui components used:**
- Card, Badge, Button, Separator, Alert
- Accordion, Tabs, Tooltip, Progress
- Dialog, ScrollArea, Select (if used)

## Code Modification Guidelines

### When Adding New GenAI Techniques

1. Add detection patterns to `app/services/technique_detector.py`
2. Add query templates to `app/services/research_retriever.py`
3. Update Pydantic models in `app/models/schemas.py` if needed
4. Test with sample codebase

### When Modifying the Analysis Pipeline

- The pipeline is **sequential** by design - each step depends on previous results
- Maintain async/await pattern throughout
- Update progress tracking if adding new steps
- Handle errors gracefully with fallbacks

### Frontend Guidelines

**CRITICAL RULES:**
- **DO NOT** modify `components/ui/*` - these are shadcn/ui components
- **DO** use Tailwind utility classes ONLY for all styling
- **DO NOT** write ANY custom CSS (except theme variables in index.css)
- **DO NOT** create ANY .css files other than index.css
- Use existing shadcn/ui components via imports
- Maintain TypeScript strict mode compliance
- Use framer-motion for animations
- All icons from lucide-react

**Frontend Feature Requirements:**
- See `FRONTEND_FEATURES_MANDATORY.md` for complete list of required features
- See `CSS_TO_TAILWIND_MIGRATION.md` for CSS class replacement guide
- All dashboard components with full functionality must be preserved

### Testing Strategy

- Backend: Test with demo endpoint (`/api/v1/demo-report`)
- Frontend: Use "View Demo Report" button
- Integration: Upload small test codebases (< 5MB recommended)
- API: Interactive docs at http://localhost:8000/docs

## File Structure Reference

```
backend/app/
├── main.py                  # FastAPI app initialization
├── config.py                # Settings and environment variables
├── api/
│   └── routes.py            # API endpoints
├── models/
│   └── schemas.py           # Pydantic models
└── services/
    ├── analyzer.py          # Pipeline orchestration
    ├── code_parser.py       # AST parsing
    ├── technique_detector.py # Pattern detection
    ├── research_retriever.py # Paper fetching
    ├── insight_extractor.py  # LLM extraction
    ├── recommendation_generator.py # Recommendations
    └── demo.py              # Pre-generated demo data

frontend/src/
├── App.tsx                  # Main application
├── components/
│   ├── FileUpload.tsx       # Upload interface
│   ├── AnalysisProgress.tsx # Progress tracking
│   ├── ReportView.tsx       # Report display
│   ├── dashboard/           # Advanced components
│   └── ui/                  # shadcn/ui (DO NOT MODIFY)
└── lib/
    └── utils.ts             # Utilities (cn, etc.)
```

## Common Pitfalls

1. **Virtual Environment**: Always activate `venv` before running backend
2. **Port Conflicts**: Check if 8000 (backend) or 5173 (frontend) are in use
3. **CORS Errors**: Ensure backend CORS is configured for frontend URL
4. **Module Imports**: Backend imports use `from app.` prefix
5. **API Keys**: Missing keys trigger mock data mode (not errors)
6. **Type Safety**: Always run TypeScript checks before committing frontend changes

## Demo Mode

The system includes comprehensive demo data for presentations:
- Simulates analysis of a RAG chatbot codebase
- Returns realistic results in ~3 seconds
- No API keys required
- Endpoint: `GET /api/v1/demo-report`

## Performance Characteristics

- Code parsing: < 5 seconds
- Technique detection: < 2 seconds
- Paper retrieval: 10-20 seconds (depends on API)
- Insight extraction: 10-30 seconds (with LLM)
- Total analysis: 30-90 seconds typical

## Extension Points

### Adding Multi-Language Support

1. Create new parsers in `code_parser.py` (similar to `parse_python_file`)
2. Update file type detection logic
3. Add language-specific detection patterns to `technique_detector.py`

### Adding New Research Sources

1. Implement new retrieval function in `research_retriever.py`
2. Add to fallback chain in `retrieve_papers()`
3. Normalize paper metadata to common format

### Custom Recommendation Logic

- Modify `recommendation_generator.py`
- Maintain 3-tier priority system (Critical/Important/Nice-to-have)
- Include research evidence for credibility

## Dependencies

Backend requires Python 3.9+ for:
- `fastapi` - async web framework
- `pydantic` - data validation
- `httpx` - async HTTP client
- `openai` - LLM API (optional)
- `arxiv` - research papers

Frontend requires Node.js 18+ for:
- React 18 + TypeScript
- Vite (build tool)
- shadcn/ui + Radix UI (components)
- Tailwind CSS (styling)

## Documentation

- **README.md**: User-facing documentation
- **ARCHITECTURE.md**: Detailed system design (1600+ lines)
- **QUICK_START.md**: 5-minute setup guide
- **DEMO_SCRIPT.md**: Presentation guide
- **API Docs**: http://localhost:8000/docs (auto-generated)

---

**Last Updated**: 2026-02-06
**Project Status**: Production-ready MVP
