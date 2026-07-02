# Инструкция по настройке сервера для arctolymp.ru

## Предварительные требования

- Ubuntu Server 20.04 или выше
- Права sudo
- Зарегистрированное доменное имя **arctolymp.ru**

## 1. Установка необходимых пакетов

```bash
# Обновление системы
sudo apt update
sudo apt upgrade -y

# Установка Docker и Docker Compose
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce docker-compose

# Установка Nginx
sudo apt install -y nginx

# Установка дополнительных инструментов
sudo apt install -y git certbot python3-certbot-nginx
```

## 2. Настройка проекта

```bash
# Добавляем текущего пользователя в группу docker
sudo usermod -aG docker $USER

# Создаем директорию проекта
sudo mkdir -p /var/www/site_apo
sudo chown $USER:$USER /var/www/site_apo

# Клонируем проект
cd /var/www/site_apo
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ> .
```

## 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cat > .env << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=ваш_ключ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ваш_домен
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ваш_проект_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ваш_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=ваш_app_id
EOF
```

## 4. Быстрый деплой

Для автоматической настройки Nginx, получения SSL сертификата и запуска Docker-контейнеров используйте скрипт `deploy-arctolymp.sh`:

```bash
chmod +x deploy-arctolymp.sh
sudo ./deploy-arctolymp.sh
```

Этот скрипт выполнит следующие действия:
1. Подтянет последние изменения из Git.
2. Соберет и запустит Docker-контейнеры.
3. Настроит Nginx для домена `arctolymp.ru`.
4. Получит SSL-сертификат через Certbot (если он еще не получен).
5. Перезапустит Nginx.

## 5. Проверка работоспособности

1. Откройте в браузере https://arctolymp.ru
2. Убедитесь, что:
   - Сайт доступен по HTTPS.
   - Все страницы отображаются корректно.

## 6. Полезные команды

```bash
# Просмотр логов приложения
docker-compose logs -f

# Перезапуск всего стека
docker-compose restart

# Проверка статуса Nginx
sudo systemctl status nginx
```
