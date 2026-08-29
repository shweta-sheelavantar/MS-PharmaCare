$ErrorActionPreference = "SilentlyContinue"

Write-Host "========================================" -ForegroundColor Green
Write-Host "   SANJEEVANI - Starting All Services  " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Kill any existing processes
Write-Host "[1/4] Stopping existing processes..." -ForegroundColor Yellow
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq "" -or $_.ProcessName -eq "node" } | Stop-Process -Force
Start-Sleep -Seconds 2

# Start Backend
Write-Host "[2/4] Starting Backend (port 8080)..." -ForegroundColor Cyan
$backendDir = Join-Path $PSScriptRoot "backend"
$env:DB_URL = "jdbc:mysql://localhost:3306/authdb?useSSL=false&allowPublicKeyRetrieval=true"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "Shweta@26"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; `$env:DB_URL='$env:DB_URL'; `$env:DB_USERNAME='$env:DB_USERNAME'; `$env:DB_PASSWORD='$env:DB_PASSWORD'; Write-Host 'Backend starting...' -ForegroundColor Cyan; java -jar target\auth-service-1.0.0.jar" -WindowStyle Normal

# Start Frontend
Write-Host "[3/4] Starting Frontend (port 5173)..." -ForegroundColor Cyan
$frontendDir = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; Write-Host 'Frontend starting...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal

# Wait and verify
Write-Host "[4/4] Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

$frontendOk = $false
$backendOk = $false
try { $frontendOk = (Invoke-WebRequest -Uri http://localhost:5173 -UseBasicParsing -TimeoutSec 5).StatusCode -eq 200 } catch {}
try { $backendOk = (Invoke-WebRequest -Uri http://localhost:8080/api/auth/me -UseBasicParsing -TimeoutSec 5).StatusCode -eq 403 } catch {}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
if ($frontendOk -and $backendOk) {
    Write-Host "   All services are running!" -ForegroundColor Green
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:8080" -ForegroundColor White
} else {
    Write-Host "   Some services may still be starting..." -ForegroundColor Yellow
    if (-not $frontendOk) { Write-Host "   Frontend: NOT READY" -ForegroundColor Red }
    if (-not $backendOk) { Write-Host "   Backend:  NOT READY" -ForegroundColor Red }
}
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to close this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
