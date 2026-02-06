# GenAI Profiler Backend

FastAPI backend for analyzing GenAI codebases and generating research-backed recommendations.

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your API keys
```

Required variables:
- `OPENAI_API_KEY`: For insight extraction (recommended)
- `SEMANTIC_SCHOLAR_API_KEY`: For increased rate limits (optional)

### 5. Run Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Or use the run script:

**Windows:**
```bash
python run.py
```

**macOS/Linux:**
```bash
python3 run.py
```

## API Endpoints

### POST `/api/v1/upload`
Upload a codebase ZIP file for analysis.

**Request:**
- `file`: ZIP file (multipart/form-data)

**Response:**
```json
{
  "job_id": "uuid",
  "message": "Upload successful, analysis started"
}
```

### GET `/api/v1/status/{job_id}`
Get analysis status.

**Response:**
```json
{
  "status": "processing",
  "progress": 45,
  "message": "Retrieving research papers..."
}
```

### GET `/api/v1/result/{job_id}`
Get completed analysis result.

**Response:**
```json
{
  "timestamp": "2024-01-01T00:00:00",
  "codebase_name": "my-project",
  "analysis_duration": 45.2,
  "overall_risk": "Medium",
  "techniques": [...],
  "recommendations": [...],
  "papers": [...]
}
```

### GET `/api/v1/demo-report`
Get pre-generated demo report.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes.py              # API endpoints
│   ├── models/
│   │   └── schemas.py             # Pydantic models
│   ├── services/
│   │   ├── analyzer.py            # Main analysis pipeline
│   │   ├── code_parser.py         # Parse Python code
│   │   ├── technique_detector.py  # Detect GenAI patterns
│   │   ├── research_retriever.py  # Fetch research papers
│   │   ├── insight_extractor.py   # Extract insights with LLM
│   │   ├── recommendation_generator.py  # Generate recommendations
│   │   └── demo.py                # Demo data
│   ├── config.py                  # Configuration
│   └── main.py                    # FastAPI app
├── uploads/                       # Temporary upload storage
├── requirements.txt               # Python dependencies
├── .env.example                   # Example environment file
└── README.md                      # This file
```

## How It Works

### Analysis Pipeline

1. **Upload & Extract**
   - Receive ZIP file
   - Extract to temporary directory
   - Background task starts

2. **Parse Codebase**
   - Find all Python files
   - Parse with AST
   - Extract imports and dependencies

3. **Detect Techniques**
   - Library-based detection (langchain, openai, chromadb, etc.)
   - Pattern-based detection (RAG, agents, prompts)
   - Confidence scoring

4. **Retrieve Research**
   - Generate academic queries
   - Query Semantic Scholar API
   - Fallback to arXiv
   - Rank by relevance and recency

5. **Extract Insights**
   - Use GPT-4 to analyze paper abstracts
   - Extract failure modes
   - Extract best practices
   - Extract performance findings

6. **Generate Recommendations**
   - Map insights to detected techniques
   - Prioritize by severity (Critical/Important/Nice-to-have)
   - Add code locations
   - Include research evidence

7. **Build Report**
   - Aggregate all data
   - Calculate risk level
   - Add confidence notes
   - Return structured JSON

## Configuration

### Settings (config.py)

```python
# API Keys
openai_api_key: str = ""
semantic_scholar_api_key: str = ""

# Server
host: str = "0.0.0.0"
port: int = 8000

# Analysis
max_papers_per_technique: int = 5
paper_min_year: int = 2022
similarity_threshold: float = 0.7
```

### Environment Variables

All settings can be overridden with environment variables:

```env
OPENAI_API_KEY=sk-...
SEMANTIC_SCHOLAR_API_KEY=...
MAX_PAPERS_PER_TECHNIQUE=10
PAPER_MIN_YEAR=2020
```

## Development

### Add New Technique Detector

Edit `app/services/technique_detector.py`:

```python
# Add to GENAI_LIBRARIES
GENAI_LIBRARIES = {
    'your-library': 'YOUR_TECHNIQUE',
    # ...
}

# Add patterns
YOUR_TECHNIQUE_PATTERNS = [
    r'pattern1',
    r'pattern2',
]

# Add description
def _technique_description(self, technique: str) -> str:
    descriptions = {
        "YOUR_TECHNIQUE": "Description here",
        # ...
    }
```

### Add New Research Query

Edit `app/services/research_retriever.py`:

```python
TECHNIQUE_QUERIES = {
    "YOUR_TECHNIQUE": [
        "query 1",
        "query 2",
        "query 3"
    ],
    # ...
}
```

## Testing

### Manual Testing

```bash
# Start server
uvicorn app.main:app --reload

# In another terminal, test upload
curl -X POST http://localhost:8000/api/v1/upload \
  -F "file=@sample.zip"

# Get demo report
curl http://localhost:8000/api/v1/demo-report
```

### With Frontend

```bash
# Start backend
uvicorn app.main:app --reload

# In another terminal, start frontend
cd ../frontend
npm run dev

# Open http://localhost:5173
```

## Troubleshooting

### "No module named 'app'"

Make sure you're in the `backend` directory and virtual environment is activated:

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate
python -m app.main  # Test import
```

### "Connection refused" from frontend

Check:
1. Backend is running on port 8000
2. CORS is configured in `.env`
3. Frontend proxy is set in `vite.config.ts`

### "Rate limit exceeded" for Semantic Scholar

Solutions:
1. Add `SEMANTIC_SCHOLAR_API_KEY` to `.env`
2. Reduce `MAX_PAPERS_PER_TECHNIQUE` in config
3. Add delay between requests

### Slow analysis

- Without OpenAI API key, uses mock insights (fast)
- With OpenAI API key, makes LLM calls (slower but better quality)
- Reduce number of papers to analyze
- Use demo report for presentations

## API Documentation

Once server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Performance

- **Analysis time**: 30-90 seconds depending on codebase size
- **Memory usage**: ~200MB typical
- **API calls**:
  - Semantic Scholar: 5-10 per technique
  - OpenAI: 5-10 per analysis (if enabled)

## Deployment

### Production Considerations

1. **Use a database** for job storage (Redis/PostgreSQL)
2. **Add authentication** for API endpoints
3. **Implement rate limiting** to prevent abuse
4. **Use worker queue** (Celery/RQ) for background tasks
5. **Add monitoring** (Sentry, Datadog)
6. **Enable HTTPS** with reverse proxy (nginx)
7. **Set up logging** to file or external service
8. **Add health checks** for uptime monitoring

### Docker (Optional)

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## License

MIT License - See main README for details.
