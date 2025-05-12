#!/bin/bash

# Function to display script usage
show_usage() {
    echo "Usage: $0 [build|start|stop|restart|logs]"
    echo "Commands:"
    echo "  build   - Build Docker image"
    echo "  start   - Start containers"
    echo "  stop    - Stop containers"
    echo "  restart - Restart containers"
    echo "  logs    - Show container logs"
}

# Check if command is provided
if [ $# -eq 0 ]; then
    show_usage
    exit 1
fi

# Process commands
case "$1" in
    build)
        docker-compose build
        ;;
    start)
        docker-compose up -d
        echo "Application started on http://localhost:3000"
        ;;
    stop)
        docker-compose down
        ;;
    restart)
        docker-compose down
        docker-compose up -d
        echo "Application restarted on http://localhost:3000"
        ;;
    logs)
        docker-compose logs -f
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 