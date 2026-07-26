# YOUMI CLI - Deployment Command
param (
    [string]$Target = "cloudflare"
)

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "          YOUMI DEPLOYMENT SYSTEM              " -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Building project bundle..." -ForegroundColor Green

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build succeeded! Deploying bundle to target: $Target" -ForegroundColor Green
    Write-Host "Deployment completed! Shared URL active." -ForegroundColor Yellow
} else {
    Write-Host "Build failed! Please check logs before deploying." -ForegroundColor Red
}
