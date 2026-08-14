@echo off
title CodePulse Development Environment
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║           🚀 Starting CodePulse Development              ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo 📦 Starting Docker services...
docker-compose up -d postgres redis 2>nul
if errorlevel 1 (
    echo ⚠️  Docker not found or not running. Starting services anyway...
) else (
    echo ✅ Docker services started
)
timeout /t 2 /nobreak >nul

echo.
echo 🐍 Starting Backend Server...
start "CodePulse Backend" cmd /k "cd backend && .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo.
echo ⚛️  Starting Frontend Server...
start "CodePulse Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║           ✅ CodePulse is running!                       ║
echo ║                                                           ║
echo ║           🌐 Frontend:  http://localhost:5173           ║
echo ║           🔧 Backend:   http://localhost:8000           ║
echo ║           📚 API Docs:  http://localhost:8000/api/docs  ║
echo ║                                                           ║
echo ║           💡 Just save your files - auto-reload handles  ║
echo ║              the rest!                                   ║
echo ║                                                           ║
echo ║           Press Ctrl+C in each window to stop            ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.