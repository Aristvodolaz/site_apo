#!/bin/bash

# Скрипт для деплоя сайта на сервер

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Функция вывода сообщений
print_message() {
  echo -e "${GREEN}[DEPLOY]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка наличия .env файла
if [ ! -f .env ]; then
  print_error "Файл .env не найден. Создайте файл .env с переменными Firebase."
  exit 1
fi

# Проверка подключения к Firebase
source .env
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ] || [ -z "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" ]; then
  print_error "В файле .env отсутствуют необходимые переменные Firebase."
  print_message "Убедитесь, что в файле .env определены следующие переменные:"
  echo "  NEXT_PUBLIC_FIREBASE_API_KEY"
  echo "  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  echo "  NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  echo "  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
  echo "  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  echo "  NEXT_PUBLIC_FIREBASE_APP_ID"
  exit 1
fi

# Сборка и запуск через Docker
print_message "Начинаем деплой сайта..."

# Сборка Docker-образа
print_message "Сборка Docker-образа..."
docker-compose build

if [ $? -ne 0 ]; then
  print_error "Ошибка при сборке Docker-образа."
  exit 1
fi

# Остановка предыдущего контейнера
print_message "Останавливаем предыдущую версию сайта..."
docker-compose down

# Запуск нового контейнера
print_message "Запускаем новую версию сайта..."
docker-compose up -d

if [ $? -ne 0 ]; then
  print_error "Ошибка при запуске Docker-контейнера."
  exit 1
fi

# Проверка доступности сайта
print_message "Проверка доступности сайта..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ $response -eq 200 ]; then
  print_message "Сайт успешно запущен и доступен по адресу http://localhost:3000"
else
  print_warning "Сайт запущен, но не отвечает с кодом 200. Проверьте логи: docker-compose logs -f"
fi

# Вывод логов (опционально)
read -p "Показать логи контейнера? (y/n): " show_logs
if [ "$show_logs" = "y" ]; then
  docker-compose logs -f
fi

print_message "Деплой завершен!" 