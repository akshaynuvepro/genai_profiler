@echo off
echo ================================
echo GenAI Profiler - Quick Start
echo ================================
echo.

echo [1/3] Checking backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo [2/3] Starting backend server...
start cmd /k "cd /d %CD% && venv\Scripts\activate && echo Backend starting... && uvicorn app.main:app --reload"

echo [3/3] Starting frontend server...
cd ..\frontend
start cmd /k "cd /d %CD% && echo Frontend starting... && npm run dev"

echo.
echo ================================
echo Servers starting in new windows!
echo ================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Wait for both servers to start, then open:
echo http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
