# 🚀 Quick Start Guide

Get GenAI Profiler running in 5 minutes!

## Prerequisites

- Python 3.9+ installed
- Node.js 18+ installed
- Terminal/Command Prompt

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# OPTIONAL: Edit .env and add your OpenAI API key
# (System works without it, but uses mock data)
```

## Step 2: Frontend Setup (2 minutes)

```bash
# Open NEW terminal/command prompt
cd frontend

# Install dependencies
npm install
```

## Step 3: Start Both Servers (1 minute)

### Terminal 1 - Backend:
```bash
cd backend
# Make sure venv is activated
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

## Step 4: Open the App

Open your browser and go to:
```
http://localhost:5173
```

You should see the GenAI Profiler interface!

## Step 5: Try It Out

### Option A: Use Demo (Fastest)
1. Click "View Demo Report"
2. Wait 3 seconds
3. See a full analysis report!

### Option B: Upload Your Own Code
1. Create a ZIP of your Python GenAI project
2. Drag and drop or click "Select File"
3. Click "Analyze Codebase"
4. Wait 1-2 minutes
5. View your custom report!

## Troubleshooting

### Backend won't start?

**Error: "No module named 'app'"**
```bash
# Make sure you're in backend/ directory
cd backend
# Activate venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
# Try again
python -m uvicorn app.main:app --reload
```

**Error: "Port already in use"**
```bash
# Use different port
uvicorn app.main:app --reload --port 8001
# Then update frontend/vite.config.ts proxy target
```

### Frontend won't start?

**Error: "Cannot find module"**
```bash
cd frontend
# Delete and reinstall
rm -rf node_modules
npm install
```

**Error: "Network error"**
- Make sure backend is running (Terminal 1)
- Check http://localhost:8000/health in browser
- Should return: `{"status":"healthy"}`

### Can't access the app?

1. Check both terminals are running
2. Backend: http://localhost:8000/health
3. Frontend: http://localhost:5173
4. Try incognito/private window
5. Clear browser cache

## What's Next?

### Customize for Hackathon Demo

1. **Load demo data** for instant results
2. **Prepare sample codebase** (< 10MB recommended)
3. **Add OpenAI API key** for better insights (optional)
4. **Test end-to-end** before presentation

### Explore Features

- **Executive Summary**: Overall risk and metrics
- **Technique Detection**: RAG, LLM API, Vector DB, etc.
- **Recommendations**: Critical/Important/Nice-to-have
- **Research Papers**: Academic sources
- **Code Locations**: Specific file references

### API Documentation

Visit http://localhost:8000/docs for:
- Interactive API documentation
- Try API endpoints directly
- See request/response schemas

## Production Checklist

Before deploying:

- [ ] Add OpenAI API key for real insights
- [ ] Set up proper database (not in-memory)
- [ ] Enable authentication
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring
- [ ] Use HTTPS
- [ ] Add logging

## Need Help?

- **Architecture**: See `ARCHITECTURE.md`
- **Full README**: See `README.md`
- **Backend Docs**: See `backend/README.md`
- **Frontend Docs**: See `frontend/README.md`

## Success!

If you see the GenAI Profiler interface with the upload button, you're all set!

Now you can:
- Analyze GenAI codebases
- Get research-backed recommendations
- Identify architectural risks
- Learn best practices from papers

Happy hacking! 🚀
