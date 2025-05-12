# Function to display script usage
function Show-Usage {
    Write-Host "Usage: .\docker-deploy.ps1 [build|start|stop|restart|logs]"
    Write-Host "Commands:"
    Write-Host "  build   - Build Docker image"
    Write-Host "  start   - Start containers"
    Write-Host "  stop    - Stop containers"
    Write-Host "  restart - Restart containers"
    Write-Host "  logs    - Show container logs"
}

# Check if command is provided
if ($args.Count -eq 0) {
    Show-Usage
    exit 1
}

# Process commands
switch ($args[0]) {
    "build" {
        docker-compose build
    }
    "start" {
        docker-compose up -d
        Write-Host "Application started on http://localhost:3000"
    }
    "stop" {
        docker-compose down
    }
    "restart" {
        docker-compose down
        docker-compose up -d
        Write-Host "Application restarted on http://localhost:3000"
    }
    "logs" {
        docker-compose logs -f
    }
    default {
        Show-Usage
        exit 1
    }
} 