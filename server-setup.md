# Инструкция по настройке сервера для сайта Arctic Olympiad

## Предварительные требования

- Ubuntu Server 20.04 или выше
- Права sudo
- Зарегистрированное доменное имя (arctic-olympiad.ru или ваше)

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

## 2. Настройка Docker и проекта

```bash
# Добавляем текущего пользователя в группу docker
sudo usermod -aG docker $USER

# Создаем директорию проекта
sudo mkdir -p /var/www/site_apo
sudo chown $USER:$USER /var/www/site_apo

# Клонируем проект
cd /var/www/site_apo
git clone https://github.com/Aristvodolaz/site_apo.git .

# Копируем подготовленные файлы (которые мы создали ранее)
# Вы также можете создать эти файлы непосредственно на сервере
```

## 3. Настройка переменных окружения

```bash
# Создаем файл .env для Firebase
cat > .env << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=ваш_ключ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ваш_домен
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ваш_проект_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ваш_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=ваш_app_id
EOF
```

## 4. Настройка Nginx и SSL

```bash
# Копируем конфигурацию Nginx
sudo cp nginx-config.conf /etc/nginx/sites-available/arctic-olympiad.conf

# Создаем символическую ссылку
sudo ln -s /etc/nginx/sites-available/arctic-olympiad.conf /etc/nginx/sites-enabled/

# Удаляем дефолтную конфигурацию
sudo rm /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
sudo nginx -t

# Создаем директорию для Let's Encrypt
sudo mkdir -p /var/www/letsencrypt

# Генерируем SSL-сертификат
sudo certbot --nginx -d arctic-olympiad.ru -d www.arctic-olympiad.ru

# Перезапускаем Nginx
sudo systemctl restart nginx
```

## 5. Настройка автозапуска при перезагрузке сервера

```bash
# Копируем systemd сервис
sudo cp arctic-olympiad.service /etc/systemd/system/

# Включаем и запускаем сервис
sudo systemctl daemon-reload
sudo systemctl enable arctic-olympiad
sudo systemctl start arctic-olympiad
```

## 6. Настройка резервного копирования

```bash
# Копируем скрипт резервного копирования
sudo cp backup.sh /var/www/site_apo/
sudo chmod +x /var/www/site_apo/backup.sh

# Создаем директорию для резервных копий
sudo mkdir -p /var/backups/arctic-olympiad
sudo chown $USER:$USER /var/backups/arctic-olympiad

# Настраиваем автоматическое резервное копирование через cron
cat backup-crontab | sudo tee -a /etc/crontab

# Создаем лог-файл
sudo touch /var/log/arctic-backup.log
sudo chown $USER:$USER /var/log/arctic-backup.log
```

## 7. Запуск приложения

```bash
# Запуск через Docker Compose
cd /var/www/site_apo
sudo chmod +x optimized-docker-deploy.sh
./optimized-docker-deploy.sh
```

## 8. Проверка работоспособности

1. Откройте в браузере https://arctic-olympiad.ru
2. Убедитесь, что:
   - Сайт доступен по HTTPS
   - Загружаются все страницы и ресурсы
   - Работает админ-панель

## 9. Полезные команды для обслуживания

```bash
# Просмотр логов Docker-контейнера
docker logs arctic-olympiad

# Перезапуск контейнера
docker-compose restart

# Обновление проекта из Git
git pull
./optimized-docker-deploy.sh

# Проверка статуса SSL-сертификата
sudo certbot certificates

# Обновление SSL-сертификата вручную
sudo certbot renew

# Проверка резервного копирования
ls -la /var/backups/arctic-olympiad
```

## 10. Проверка безопасности

1. Проверьте оценку SSL: https://www.ssllabs.com/ssltest/analyze.html?d=arctic-olympiad.ru
2. Проверьте безопасность заголовков: https://securityheaders.com/?q=arctic-olympiad.ru 