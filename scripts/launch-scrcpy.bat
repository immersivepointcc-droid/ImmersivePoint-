@echo off
REM ImmersivePoint — Launch scrcpy screen mirror for Quest headsets
REM Requires: scrcpy installed and on PATH (or in this folder)
REM Usage: launch-scrcpy.bat [HEADSET_IP]
REM   No args = mirror USB-connected headset
REM   With IP = connect wirelessly first, then mirror

title ImmersivePoint Screen Mirror

REM Check if scrcpy is available
where scrcpy >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%~dp0scrcpy\scrcpy.exe" (
        set "SCRCPY=%~dp0scrcpy\scrcpy.exe"
    ) else (
        echo.
        echo  ERROR: scrcpy not found.
        echo.
        echo  Download from: https://github.com/Genymobile/scrcpy/releases
        echo  Extract to: %~dp0scrcpy\
        echo  Or add scrcpy to your system PATH.
        echo.
        pause
        exit /b 1
    )
) else (
    set "SCRCPY=scrcpy"
)

if "%~1"=="" (
    echo.
    echo  Mirroring USB-connected headset...
    echo  Press Ctrl+C to stop.
    echo.
    %SCRCPY% --max-size=720 --max-fps=30 --video-bit-rate=8M --no-audio --display-buffer=0 --video-codec=h264 --window-title="ImmersivePoint Headset" --stay-awake
) else (
    echo.
    echo  Connecting to headset at %~1 ...
    adb connect %~1:5555
    timeout /t 2 /nobreak >nul
    echo  Starting mirror...
    echo  Press Ctrl+C to stop.
    echo.
    %SCRCPY% --serial=%~1:5555 --max-size=720 --max-fps=30 --video-bit-rate=8M --no-audio --display-buffer=0 --video-codec=h264 --window-title="ImmersivePoint [%~1]" --stay-awake
)
