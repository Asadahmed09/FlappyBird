$basePath = "c:\Users\asad ahmed\Desktop\flapyBird"

$dirs = @(
    "src",
    "src\components",
    "src\components\Game",
    "src\components\UI",
    "src\components\Layout",
    "src\hooks",
    "src\contexts",
    "src\utils",
    "src\types"
)

foreach ($dir in $dirs) {
    $fullPath = Join-Path -Path $basePath -ChildPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created: $fullPath"
    } else {
        Write-Host "Already exists: $fullPath"
    }
}

Write-Host "`nDirectory structure created successfully!"
