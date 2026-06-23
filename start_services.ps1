Write-Host "=== MOC System - Iniciando Servicos ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Iniciando Backend (porta 3000)..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d $PSScriptRoot\backend && npm run start:dev" -WindowStyle Normal -PassThru
Start-Sleep -Seconds 5

Write-Host "Iniciando Frontend (porta 5173)..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d $PSScriptRoot\frontend && npm run dev -- --host 0.0.0.0" -WindowStyle Normal -PassThru

Write-Host ""
Write-Host "=== URLs ===" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3000"
Write-Host "  Frontend: http://localhost:5173"
Write-Host ""
Write-Host "Pressione qualquer tecla para parar os servicos..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
Write-Host "Servicos parados." -ForegroundColor Red
