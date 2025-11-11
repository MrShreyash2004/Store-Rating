Write-Host "Starting services (docker-compose up --build -d)..."
docker-compose up --build -d

Write-Host "Waiting for backend to be ready (checking logs)..."
$max = 30
$count = 0
while ($count -lt $max) {
    try {
        $logs = docker-compose logs backend --no-color 2>$null
    } catch {
        $logs = ""
    }
    if ($logs -match 'Server running on port 4000') {
        Write-Host "Backend appears ready."
        break
    }
    Write-Host "Waiting 5s... ($count/$max)"
    Start-Sleep -Seconds 5
    $count++
}

if ($count -ge $max) {
    Write-Host "Timeout waiting for backend to report ready. Showing recent backend logs:" -ForegroundColor Yellow
    docker-compose logs --no-color --tail=100 backend
    exit 1
}

Write-Host "Installing backend dependencies and running seed script inside container..."
docker-compose exec backend sh -lc "npm install && npm run seed"

Write-Host "Demo setup complete. Open the frontend at: http://localhost:5173"
Write-Host "Demo accounts:" -ForegroundColor Green
Write-Host "  - admin: admin@storely.test / Admin@1234"
Write-Host "  - owner: owner@storely.test / Owner@1234"
Write-Host "  - user: user@storely.test / User@1234"

Write-Host "Press Enter to exit..."
[Console]::In.ReadLine() | Out-Null
