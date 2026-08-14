$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

git pull --rebase --quiet

$file = Join-Path $PSScriptRoot "activity.md"
if (-not (Test-Path $file)) {
    "# FSD Workshop Activity Log" | Set-Content $file -Encoding UTF8
    Add-Content $file ""
}

$batch = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content $file ""
Add-Content $file "## Batch $batch"

for ($i = 1; $i -le 10; $i++) {
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content $file "- [$stamp] Commit $i of batch"
    git add $file
    git commit -m "activity: commit $i of batch"
}

git push --quiet
Write-Host "Done. 10 commits created and pushed."
