# GenAI Profiler

A research-aware profiling system that analyzes GenAI product codebases, identifies architectural patterns, retrieves relevant research papers, and generates evidence-based recommendations.

## 🎯 What It Does

GenAI Profiler helps engineering teams make better architectural decisions by:

- **Automatically detecting** GenAI techniques (RAG, LLM APIs, Vector DBs, Agents, etc.)
- **Retrieving research papers** from Semantic Scholar and arXiv
- **Extracting insights** from academic literature
- **Generating recommendations** backed by experimental evidence
- **Presenting results** in plain English for engineering teams

## 🏗️ Architecture

- **Backend**: FastAPI (Python)
- **Frontend**: React + TypeScript + shadcn/ui + Tailwind CSS
- **Research APIs**: Semantic Scholar, arXiv
- **LLM**: OpenAI GPT-4 (for insight extraction)

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn
- OpenAI API key (optional but recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/genai_profiler.git
cd genai_profiler
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key (optional but recommended)
# OPENAI_API_KEY=your_key_here
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Start the Backend

```bash
cd backend

# Make sure virtual environment is activated
# Then run:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

The backend API will be running at:
```
http://localhost:8000
```

API documentation (Swagger UI):
```
http://localhost:8000/docs
```

## 📖 Usage

### Option 1: Use Demo Data

1. Click "View Demo Report" button
2. See a pre-generated analysis of a sample RAG chatbot

### Option 2: Analyze Your Own Codebase

1. Create a ZIP file of your GenAI project
2. Click "Select File" or drag-and-drop the ZIP
3. Click "Analyze Codebase"
4. Wait 1-2 minutes for analysis
5. View your personalized report

## 🎨 Features

### Core Features

✅ **Automatic Technique Detection**
- RAG (Retrieval-Augmented Generation)
- LLM API Integration
- Vector Databases
- Embeddings
- AI Agents
- Prompt Engineering

✅ **Research Paper Retrieval**
- Semantic Scholar API integration
- arXiv fallback
- Prioritizes experimental studies
- Filters by recency (2022+)

✅ **Insight Extraction**
- LLM-powered analysis
- Failure mode identification
- Best practice extraction
- Performance findings

✅ **Smart Recommendations**
- Risk-based prioritization (Critical/Important/Nice-to-have)
- Code location mapping
- Implementation effort estimates
- Research evidence citations

✅ **Professional Report**
- Executive summary
- Detected techniques with confidence scores
- Actionable recommendations
- Referenced research papers
- Confidence notes and limitations

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation
- **httpx**: Async HTTP client
- **OpenAI API**: Insight extraction
- **arxiv-py**: arXiv paper retrieval
- **Python AST**: Code parsing

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **shadcn/ui**: Component library
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Lucide React**: Icons

## 📁 Project Structure

```
genai_profiler/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # API endpoints
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic models
│   │   ├── services/
│   │   │   ├── analyzer.py        # Main analysis pipeline
│   │   │   ├── code_parser.py     # Code parsing
│   │   │   ├── technique_detector.py  # Pattern detection
│   │   │   ├── research_retriever.py  # Paper retrieval
│   │   │   ├── insight_extractor.py   # LLM extraction
│   │   │   ├── recommendation_generator.py  # Rec generation
│   │   │   └── demo.py            # Demo data
│   │   ├── config.py              # Configuration
│   │   └── main.py                # FastAPI app
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   ├── FileUpload.tsx     # Upload interface
│   │   │   ├── AnalysisProgress.tsx  # Progress display
│   │   │   └── ReportView.tsx     # Report display
│   │   ├── lib/
│   │   │   └── utils.ts           # Utilities
│   │   ├── App.tsx                # Main app
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── ARCHITECTURE.md                 # Detailed architecture doc
└── README.md                       # This file
```

## 🎯 Demo Flow (5 Minutes)

Perfect for hackathon presentations:

1. **Problem Statement** (1 min)
   - Show the gap between research and production
   - Explain the value proposition

2. **Upload & Analysis** (1 min)
   - Upload sample codebase or use demo
   - Show progress indicators

3. **Results Overview** (1 min)
   - Executive summary
   - Risk assessment
   - Detected techniques

4. **Deep Dive** (1 min)
   - Expand one critical recommendation
   - Show research evidence
   - Display code example

5. **Key Value Props** (1 min)
   - Automatic detection
   - Research-backed
   - Actionable recommendations
   - Time-saving

## ⚙️ Configuration

### Environment Variables

Create `backend/.env` file:

```env
# Required for insight extraction (without this, uses mock data)
OPENAI_API_KEY=your_openai_api_key

# Optional - increases rate limits
SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_key

# Server config
HOST=0.0.0.0
PORT=8000
RELOAD=true

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### API Keys

**OpenAI API Key** (Recommended):
- Get from: https://platform.openai.com/api-keys
- Used for extracting insights from research papers
- Without this, the system uses pre-generated mock insights

**Semantic Scholar API Key** (Optional):
- Get from: https://www.semanticscholar.org/product/api
- Increases rate limits from 100 to 5000 requests per 5 minutes
- Not required for basic functionality

## 🔧 Development

### Backend Development

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Run with auto-reload
uvicorn app.main:app --reload

# Run tests (if implemented)
pytest
```

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Backend Issues

**Import errors**:
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

**Port already in use**:
```bash
# Use different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Module not found**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**API connection errors**:
- Check backend is running on port 8000
- Check CORS settings in backend/.env

## 🚧 Known Limitations

1. **Static Analysis Only**: Can't detect runtime behavior
2. **Python Focus**: Currently optimized for Python codebases
3. **Research Generalization**: Findings may not apply to all contexts
4. **Rate Limits**: Semantic Scholar: 100 req/5min without API key
5. **LLM Dependency**: Best results require OpenAI API key

## 🎓 Use Cases

- **Pre-deployment Review**: Check architecture before production
- **Code Review**: Get research-backed feedback on PRs
- **Team Education**: Learn best practices from research
- **Risk Assessment**: Identify potential failure modes
- **Architecture Planning**: Make informed design decisions

## 📊 Example Output

The system generates a comprehensive report with:

- **Executive Summary**: Risk level, critical issues count
- **Detected Techniques**: RAG, LLM API, Vector DB, etc.
- **Critical Recommendations**: Fix failure modes (e.g., add similarity threshold)
- **Important Recommendations**: Implement best practices (e.g., prompt versioning)
- **Nice-to-have Recommendations**: Optimizations (e.g., HNSW indexing)
- **Research Papers**: Links to relevant academic papers
- **Confidence Notes**: Transparency about detection confidence
- **Limitations**: Clear communication of constraints

## 🤝 Contributing

This is a hackathon project! Contributions welcome for:

- Multi-language support (TypeScript, Go, Java)
- More technique detectors
- Better insight extraction prompts
- UI improvements
- Performance optimizations

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Semantic Scholar**: Research paper API
- **arXiv**: Open access research papers
- **OpenAI**: GPT-4 for insight extraction
- **shadcn/ui**: Beautiful UI components
- **FastAPI**: Modern Python web framework

## 📧 Contact

For questions or feedback:
- Open an issue on GitHub
- Email: your.email@example.com

---

Built with ❤️ for the hackathon to help GenAI engineering teams make better decisions.
