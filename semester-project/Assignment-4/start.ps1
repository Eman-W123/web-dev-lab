$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$mongoData = "D:\web-dev-lab\mongo-data"

if (-not (Test-Path $mongoData)) {
    New-Item -ItemType Directory -Path $mongoData | Out-Null
}

$mongoRunning = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
    Start-Process -FilePath "powershell" -ArgumentList @(
        "-NoExit",
        "-Command",
        "mongod --dbpath `"$mongoData`""
    )
    Write-Host "MongoDB starting in a new window..."
} else {
    Write-Host "MongoDB already running."
}

$portInUse = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port 3000 is already in use. Stop the other app and re-run."
    exit 1
}

Set-Location $projectRoot
node app.js
