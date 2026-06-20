@echo off
title ImmersivePoint Platform
cd /d "%~dp0"

echo.
echo   Starting ImmersivePoint Platform...
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ERROR: Node.js is not installed.
    echo   Download it from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install
    echo.
)

:: Open browser after a short delay
start "" cmd /c "timeout /t 2 /noq >nul && start http://localhost:3000"

:: Start the server
node server.js

pause
