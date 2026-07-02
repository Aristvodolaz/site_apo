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

# Попытка сборки
docker-compose build
docker-compose down
docker-compose up -d

if [ $? -ne 0 ]; then
  print_error "Ошибка при запуске Docker-контейнеров."
  exit 1
fi

# 3. Настройка Nginx
print_message "Настройка Nginx..."
if [ -f "$NGINX_CONF" ]; then
  # Временная конфигурация без SSL для получения сертификата
  cat > /etc/nginx/sites-available/arctolymp.conf << EOF
server {
    listen 80;
    server_name arctolymp.ru www.arctolymp.ru;
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    location / {
        return 301 https://\$host\$request_uri;
    }
}
EOF
  
  mkdir -p /var/www/letsencrypt
  ln -sf /etc/nginx/sites-available/arctolymp.conf /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default
  
  nginx -t && systemctl restart nginx
  
  # 4. Настройка SSL (Certbot)
  print_message "Проверка SSL сертификатов..."
  SSL_SUCCESS=false
  if ! certbot certificates | grep -q "$DOMAIN"; then
    print_message "Генерация SSL сертификата для $DOMAIN..."
    if certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN; then
      SSL_SUCCESS=true
    else
      print_warning "Не удалось получить SSL сертификат. Сайт будет доступен по HTTP."
    fi
  else
    SSL_SUCCESS=true
  fi

  if [ "$SSL_SUCCESS" = true ]; then
    # Применяем полную конфигурацию с SSL
    cp "$NGINX_CONF" /etc/nginx/sites-available/arctolymp.conf
    print_message "Применена конфигурация с SSL."
  else
    # Оставляем HTTP конфигурацию, но проксируем на докер
    cat > /etc/nginx/sites-available/arctolymp.conf << EOF
server {
    listen 80;
    server_name arctolymp.ru www.arctolymp.ru;
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
    print_warning "Применена временная конфигурация без SSL."
  fi
  
  nginx -t && systemctl restart nginx
  print_message "Nginx успешно настроен и перезапущен."
else
  print_warning "Файл конфигурации Nginx $NGINX_CONF не найден."
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
