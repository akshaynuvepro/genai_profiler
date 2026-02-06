#!/bin/bash

echo "================================"
echo "GenAI Profiler - Quick Start"
echo "================================"
echo ""

# Check if backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "[1/4] Creating virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# Check if frontend node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "[2/4] Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo "[3/4] Starting backend server..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload &
BACKEND_PID=$!
cd ..

echo "[4/4] Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo "Servers started!"
echo "================================"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
