@echo off
echo ====================================
echo  MOC System - Iniciando servicos
echo ====================================
echo.
echo Iniciando Backend (porta 3000)...
start "MOC Backend" cmd /k "cd /d %~dp0backend && npm run start:dev"
timeout /t 5 /nobreak >nul
echo Iniciando Frontend (porta 5173)...
start "MOC Frontend" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 0.0.0.0"
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
pause
