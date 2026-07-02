#!/bin/bash

# Скрипт для деплоя сайта arctolymp.ru на сервер

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

DOMAIN="arctolymp.ru"
NGINX_CONF="nginx-arctolymp.conf"
PROJECT_DIR="/var/www/site_apo"

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

# Проверка прав root
if [ "$EUID" -ne 0 ]; then
  print_error "Пожалуйста, запустите скрипт от имени root (sudo ./deploy-arctolymp.sh)"
  exit 1
fi

# Проверка наличия необходимых инструментов
if ! command -v docker &> /dev/null; then
  print_error "Docker не установлен. Пожалуйста, установите его согласно инструкции server-setup-arctolymp.md"
  exit 1
fi

if ! command -v docker-compose &> /dev/null; then
  print_error "Docker Compose не установлен. Пожалуйста, установите его согласно инструкции server-setup-arctolymp.md"
  exit 1
fi

if ! command -v nginx &> /dev/null; then
  print_error "Nginx не установлен. Пожалуйста, установите его: sudo apt install nginx"
  exit 1
fi

# Проверка наличия .env файла
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    print_warning "Файл .env не найден. Создаю его на основе .env.example..."
    cp .env.example .env
    print_message "Файл .env создан. ПОЖАЛУЙСТА, ОТРЕДАКТИРУЙТЕ ЕГО ПЕРЕД ЗАПУСКОМ: nano .env"
    exit 1
  else
    print_error "Файл .env не найден и шаблон .env.example отсутствует. Создайте .env вручную."
    exit 1
  fi
fi

print_message "Начинаем деплой для домена $DOMAIN..."

# 1. Обновление кода из Git (если мы в репозитории)
if [ -d .git ]; then
  print_message "Обновление кода из Git..."
  # Сбрасываем локальные изменения в служебных файлах деплоя, чтобы избежать конфликтов
  git checkout deploy-arctolymp.sh nginx-arctolymp.conf Dockerfile 2>/dev/null
  git pull
fi

# 2. Сборка и запуск Docker-контейнеров
print_message "Сборка и запуск Docker-контейнеров..."

# Глубокая очистка Docker для освобождения места
print_message "Глубокая очистка Docker..."
docker system prune -a -f --volumes

# Попытка сборки с использованием BuildKit для оптимизации места
export DOCKER_BUILDKIT=1
docker-compose build --no-cache
docker-compose down
docker-compose up -d

if [ $? -ne 0 ]; then
  print_error "Ошибка при запуске Docker-контейнеров."
  exit 1
fi

# 3. Настройка Nginx
print_message "Настройка Nginx..."
if [ -f "$NGINX_CONF" ]; then
  cp "$NGINX_CONF" /etc/nginx/sites-available/arctolymp.conf
  ln -sf /etc/nginx/sites-available/arctolymp.conf /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default
  
  nginx -t
  if [ $? -eq 0 ]; then
    systemctl restart nginx
    print_message "Nginx успешно настроен и перезапущен."
  else
    print_error "Ошибка в конфигурации Nginx."
    exit 1
  fi
else
  print_warning "Файл конфигурации Nginx $NGINX_CONF не найден."
fi

# 4. Настройка SSL (Certbot)
print_message "Проверка SSL сертификатов..."
if ! certbot certificates | grep -q "$DOMAIN"; then
  print_message "Генерация SSL сертификата для $DOMAIN..."
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN
  
  if [ $? -eq 0 ]; then
    print_message "SSL сертификат успешно получен."
    systemctl restart nginx
  else
    print_warning "Не удалось получить SSL сертификат. Проверьте настройки DNS и Certbot."
  fi
else
  print_message "SSL сертификат для $DOMAIN уже существует."
fi

# 5. Проверка доступности
print_message "Проверка доступности сайта..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)

if [ $response -eq 200 ] || [ $response -eq 301 ] || [ $response -eq 302 ]; then
  print_message "Сайт успешно запущен и доступен локально (код $response)."
  print_message "Проверьте работу по адресу: https://$DOMAIN"
else
  print_warning "Сайт запущен, но вернул код $response. Проверьте логи: docker-compose logs -f"
fi

print_message "Деплой завершен!"
