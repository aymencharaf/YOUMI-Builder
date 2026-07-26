# YOUMI CLI - New Project Initializer
param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectName,
    [string]$Template = "default"
)

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "          YOUMI BUILDER CLI v2.5               " -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Creating new YOUMI Builder project: '$ProjectName' using template '$Template'..." -ForegroundColor Green

$projectPath = Join-Path (Get-Location) $ProjectName

if (Test-Path $projectPath) {
    Write-Host "Error: Directory '$ProjectName' already exists!" -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Path $projectPath | Out-Null
New-Item -ItemType Directory -Path (Join-Path $projectPath "src") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $projectPath "src/packs") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $projectPath "src/components") | Out-Null

$manifest = @{
    name = $ProjectName
    template = $Template
    version = "1.0.0"
    created = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    packs = @("pack-auth-pro", "pack-ai-copilot")
} | ConvertTo-Json -Depth 4

Set-Content -Path (Join-Path $projectPath "youmi.config.json") -Value $manifest

Write-Host "Project '$ProjectName' initialized successfully!" -ForegroundColor Green
Write-Host "Run 'cd $ProjectName' and 'youmi make-pack MyPack' to start building." -ForegroundColor Cyan
