@echo off
:: Creates a desktop shortcut for ImmersivePoint
set SCRIPT_DIR=%~dp0
set SHORTCUT_NAME=ImmersivePoint

echo Creating desktop shortcut...

powershell -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $sc = $ws.CreateShortcut([Environment]::GetFolderPath('Desktop') + '\%SHORTCUT_NAME%.lnk'); ^
   $sc.TargetPath = '%SCRIPT_DIR%start.bat'; ^
   $sc.WorkingDirectory = '%SCRIPT_DIR%'; ^
   $sc.Description = 'ImmersivePoint Platform'; ^
   $sc.Save()"

echo.
echo   Shortcut created on your Desktop!
echo   Double-click "ImmersivePoint" to launch.
echo.
pause
