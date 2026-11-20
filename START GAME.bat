@echo off
title Firewall Breach Ops - Game Server
cd /d "%~dp0"

echo.
echo  Starting Firewall Breach Ops server...
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo  ERROR: Python was not found on this laptop.
  echo  Install Python 3 from python.org, then run this again.
  echo.
  pause
  exit /b 1
)

start "" /min cmd /c "timeout /t 2 >nul & start chrome --new-window http://127.0.0.1:7331/index.html"

python tools\server.py

pause
