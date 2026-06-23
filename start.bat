@echo off
setlocal
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 18 or newer is required.
  exit /b 1
)
if "%HOST%"=="" set HOST=0.0.0.0
if "%PORT%"=="" set PORT=8080
node server.js
