@echo off
title ImmersivePoint Platform
cd /d "%~dp0"
echo Starting ImmersivePoint server...
start /b node server.js
timeout /t 3 /nobreak >nul
start "" http://localhost:3000/dashboard/
echo.
echo Server running at http://localhost:3000
echo Close this window to stop the server.
cmd /k
