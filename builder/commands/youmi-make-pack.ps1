# YOUMI CLI - Pack Generator
param (
    [Parameter(Mandatory=$true)]
    [string]$PackName
)

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "           YOUMI PACK GENERATOR                " -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

$packDir = "src/packs/$PackName"

if (Test-Path $packDir) {
    Write-Host "Warning: Pack '$PackName' already exists at $packDir" -ForegroundColor Yellow
    exit 1
}

New-Item -ItemType Directory -Path $packDir -Force | Out-Null

$packCode = @"
import React from 'react';

export interface ${PackName}Props {
  title?: string;
}

export const ${PackName}: React.FC<${PackName}Props> = ({ title = "$PackName Pack" }) => {
  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100">
      <h3 className="text-sm font-semibold text-emerald-400">{title}</h3>
      <p className="text-xs text-zinc-400 mt-1">Generated modular YOUMI Pack component.</p>
    </div>
  );
};
"@

Set-Content -Path (Join-Path $packDir "index.tsx") -Value $packCode

$manifest = @{
    packId = "pack-$($PackName.ToLower())"
    name = $PackName
    version = "1.0.0"
    entryPoint = "index.tsx"
    author = "YOUMI Developer"
} | ConvertTo-Json -Depth 3

Set-Content -Path (Join-Path $packDir "manifest.json") -Value $manifest

Write-Host "Pack '$PackName' created successfully at $packDir!" -ForegroundColor Green
