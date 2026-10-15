@echo off
title ImmersivePoint Platform
cd /d "%~dp0"

echo.
echo  ========================================
echo   IMMERSIVEPOINT PLATFORM
echo  ========================================
echo.

REM Start the server
echo  [1/3] Starting server...
start /b node server.js
timeout /t 3 /nobreak >nul

REM Open the dashboard
echo  [2/3] Opening dashboard...
start "" http://localhost:3000/dashboard/

REM Launch scrcpy if available (mirrors connected Quest headsets)
echo  [3/3] Checking for scrcpy...
where scrcpy >nul 2>nul
if %errorlevel%==0 (
    echo        scrcpy found on PATH.
    goto :launch_scrcpy
)
if exist "%~dp0scrcpy\scrcpy.exe" (
    set "PATH=%~dp0scrcpy;%PATH%"
    echo        scrcpy found in scrcpy\ folder.
    goto :launch_scrcpy
)

echo        scrcpy not found - skipping screen mirror.
echo        To enable: extract scrcpy into %~dp0scrcpy\
echo        Download: https://github.com/Genymobile/scrcpy/releases
goto :done

:launch_scrcpy
REM Check for ADB-connected devices
adb devices 2>nul | findstr /r "device$" >nul
if %errorlevel%==0 (
    echo        Quest headset detected - launching mirror...
    for /f "skip=1 tokens=1" %%d in ('adb devices ^| findstr /r "device$"') do (
        start "" scrcpy --serial=%%d --max-size=720 --max-fps=30 --video-bit-rate=8M --no-audio --display-buffer=0 --video-codec=h264 --window-title="ImmersivePoint [%%d]" --stay-awake
    )
) else (
    echo        No Quest headset connected via USB/WiFi.
    echo        Connect a headset and run scripts\mirror-all.bat
)

:done
echo.
echo  ========================================
echo   Server: http://localhost:3000
echo   Cast:   http://localhost:3000/cast/
echo   MDM:    http://localhost:3000/mobile-ops/
echo  ========================================
echo.
echo  Close this window to stop the server.
cmd /k
