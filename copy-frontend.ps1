# Copy Frontend build to Backend wwwroot
Write-Host "🚀 Copying Frontend build to Backend wwwroot..." -ForegroundColor Green

$frontendBuild = "frontend\build"
$backendWwwroot = "api\publish\wwwroot"

# Check if paths exist
if (-not (Test-Path $frontendBuild)) {
    Write-Host "❌ Frontend build not found! Please run 'yarn build' first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $backendWwwroot)) {
    Write-Host "❌ Backend publish not found! Please run 'dotnet publish' first." -ForegroundColor Red
    exit 1
}

# Clean old frontend files (preserve uploads)
$filesToRemove = @("index.html", "manifest.json", "favicon.ico", "asset-manifest.json")
foreach ($file in $filesToRemove) {
    $filePath = Join-Path $backendWwwroot $file
    if (Test-Path $filePath) {
        Remove-Item $filePath -Force
        Write-Host "🗑️  Removed old $file"
    }
}

# Remove static folder
$staticPath = Join-Path $backendWwwroot "static"
if (Test-Path $staticPath) {
    Remove-Item $staticPath -Recurse -Force
    Write-Host "🗑️  Removed old static folder"
}

# Copy new frontend files
Copy-Item "$frontendBuild\*" $backendWwwroot -Recurse -Force
Write-Host "📁 Copied frontend files to wwwroot"

# List what was copied
Write-Host "✅ Files in wwwroot:" -ForegroundColor Green
Get-ChildItem $backendWwwroot | ForEach-Object { Write-Host "   📄 $($_.Name)" }

Write-Host "🎉 Frontend successfully copied to Backend!" -ForegroundColor Green
Write-Host "📦 Ready to deploy: api\publish\" -ForegroundColor Yellow
