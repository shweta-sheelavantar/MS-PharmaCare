Write-Host "Stopping all SANJEEVANI services..." -ForegroundColor Yellow
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All services stopped." -ForegroundColor Green
Start-Sleep -Seconds 2
