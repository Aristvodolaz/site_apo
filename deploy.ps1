# Скрипт для деплоя сайта на сервер (Windows PowerShell)

# Функции для вывода сообщений
function Print-Message {
    param([string]$message)
    Write-Host "[DEPLOY] $message" -ForegroundColor Green
}

function Print-Warning {
    param([string]$message)
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Print-Error {
    param([string]$message)
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

# Проверка наличия .env файла
if (-not (Test-Path .env)) {
    Print-Error "Файл .env не найден. Создайте файл .env с переменными Firebase."
    exit 1
}

# Проверка переменных Firebase
$envContent = Get-Content .env
$apiKeyExists = $envContent | Where-Object { $_ -like "NEXT_PUBLIC_FIREBASE_API_KEY=*" -and $_ -notlike "*your_api_key_here*" }
$projectIdExists = $envContent | Where-Object { $_ -like "NEXT_PUBLIC_FIREBASE_PROJECT_ID=*" -and $_ -notlike "*your_project_id_here*" }

if (-not $apiKeyExists -or -not $projectIdExists) {
    Print-Error "В файле .env отсутствуют необходимые переменные Firebase или они содержат значения по умолчанию."
    Print-Message "Убедитесь, что в файле .env определены следующие переменные с актуальными значениями:"
    Write-Host "  NEXT_PUBLIC_FIREBASE_API_KEY"
    Write-Host "  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    Write-Host "  NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    Write-Host "  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    Write-Host "  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    Write-Host "  NEXT_PUBLIC_FIREBASE_APP_ID"
    exit 1
}

# Сборка и запуск через Docker
Print-Message "Начинаем деплой сайта..."

# Сборка Docker-образа
Print-Message "Сборка Docker-образа..."
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Print-Error "Ошибка при сборке Docker-образа."
    exit 1
}

# Остановка предыдущего контейнера
Print-Message "Останавливаем предыдущую версию сайта..."
docker-compose down

# Запуск нового контейнера
Print-Message "Запускаем новую версию сайта..."
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Print-Error "Ошибка при запуске Docker-контейнера."
    exit 1
}

# Проверка доступности сайта
Print-Message "Проверка доступности сайта..."
Start-Sleep -Seconds 5

$statusCode = $null
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
    $statusCode = $response.StatusCode
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
}

if ($statusCode -eq 200) {
    Print-Message "Сайт успешно запущен и доступен по адресу http://localhost:3000"
} else {
    Print-Warning "Сайт запущен, но не отвечает с кодом 200. Проверьте логи: docker-compose logs -f"
}

# Вывод логов (опционально)
$showLogs = Read-Host "Показать логи контейнера? (y/n)"
if ($showLogs -eq "y") {
    docker-compose logs -f
}

Print-Message "Деплой завершен!" 