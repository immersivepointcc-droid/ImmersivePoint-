@echo off
REM ImmersivePoint — Mirror all connected Quest headsets via scrcpy
REM Launches one scrcpy window per ADB-connected device
REM Prerequisites: scrcpy on PATH, developer mode on each headset

title ImmersivePoint Multi-Headset Mirror

where scrcpy >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%~dp0scrcpy\scrcpy.exe" (
        set "SCRCPY=%~dp0scrcpy\scrcpy.exe"
    ) else (
        echo  ERROR: scrcpy not found. Download from:
        echo  https://github.com/Genymobile/scrcpy/releases
        pause
        exit /b 1
    )
) else (
    set "SCRCPY=scrcpy"
)

echo.
echo  ImmersivePoint Multi-Headset Mirror
echo  ====================================
echo.
echo  Connected ADB devices:
adb devices -l
echo.

set COUNT=0
for /f "skip=1 tokens=1" %%d in ('adb devices') do (
    if not "%%d"=="" (
        set /a COUNT+=1
        echo  Starting mirror for %%d ...
        start "" %SCRCPY% --serial=%%d --max-size=720 --max-fps=30 --video-bit-rate=8M --no-audio --display-buffer=0 --video-codec=h264 --window-title="ImmersivePoint [%%d]" --stay-awake
    )
)

if %COUNT%==0 (
    echo  No devices found. Make sure:
    echo    1. Developer Mode is ON in Quest settings
    echo    2. Headset is connected via USB or WiFi ADB
    echo    3. You accepted "Allow USB Debugging" in the headset
    echo.
    echo  To connect wirelessly:
    echo    - Connect headset via USB first
    echo    - Run: adb tcpip 5555
    echo    - Disconnect USB
    echo    - Run: adb connect HEADSET_IP:5555
) else (
    echo.
    echo  Mirroring %COUNT% headset(s). Close scrcpy windows to stop.
)

echo.
pause
