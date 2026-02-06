from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
import shutil
import os
import uuid
from pathlib import Path
from app.models.schemas import AnalysisReport, AnalysisStatus
from app.services.analyzer import CodebaseAnalyzer
from app.config import settings

router = APIRouter()

# In-memory storage for demo (use Redis/DB in production)
analysis_jobs = {}

@router.post("/upload")
async def upload_codebase(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """Upload a codebase ZIP file for analysis"""

    # Validate file type
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Only ZIP files are supported")

    # Create upload directory
    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(exist_ok=True)

    # Generate unique job ID
    job_id = str(uuid.uuid4())

    # Save uploaded file
    file_path = upload_dir / f"{job_id}.zip"
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Initialize job status
    analysis_jobs[job_id] = {
        "status": "pending",
        "progress": 0,
        "message": "Upload complete, starting analysis...",
        "result": None,
        "error": None
    }

    # Start analysis in background
    background_tasks.add_task(analyze_codebase, job_id, file_path, file.filename)

    return {"job_id": job_id, "message": "Upload successful, analysis started"}

async def analyze_codebase(job_id: str, file_path: Path, filename: str):
    """Background task to analyze codebase"""
    try:
        # Update status
        analysis_jobs[job_id]["status"] = "processing"
        analysis_jobs[job_id]["progress"] = 10
        analysis_jobs[job_id]["message"] = "Extracting files..."

        # Initialize analyzer
        analyzer = CodebaseAnalyzer(file_path, filename)

        # Progress callback
        def update_progress(progress: int, message: str):
            analysis_jobs[job_id]["progress"] = progress
            analysis_jobs[job_id]["message"] = message

        # Run analysis
        result = await analyzer.analyze(progress_callback=update_progress)

        # Update with results
        analysis_jobs[job_id]["status"] = "completed"
        analysis_jobs[job_id]["progress"] = 100
        analysis_jobs[job_id]["message"] = "Analysis complete"
        analysis_jobs[job_id]["result"] = result

    except Exception as e:
        analysis_jobs[job_id]["status"] = "failed"
        analysis_jobs[job_id]["error"] = str(e)
        analysis_jobs[job_id]["message"] = f"Analysis failed: {str(e)}"

    finally:
        # Cleanup uploaded file
        try:
            os.remove(file_path)
        except:
            pass

@router.get("/status/{job_id}")
async def get_analysis_status(job_id: str):
    """Get the status of an analysis job"""
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    return analysis_jobs[job_id]

@router.get("/result/{job_id}")
async def get_analysis_result(job_id: str):
    """Get the complete analysis result"""
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = analysis_jobs[job_id]

    if job["status"] != "completed":
        raise HTTPException(
            status_code=400,
            detail=f"Analysis not complete. Current status: {job['status']}"
        )

    return job["result"]

@router.get("/demo-report")
async def get_demo_report():
    """Get a pre-generated demo report for showcase"""
    from app.services.demo import generate_demo_report
    return generate_demo_report()
