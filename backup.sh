#!/bin/bash

# Настройки
BACKUP_DIR="/var/backups/arctic-olympiad"
APP_DIR="/var/www/site_apo"
BACKUP_FILENAME="arctic-olympiad-$(date +%Y-%m-%d-%H%M%S).tar.gz"
KEEP_DAYS=30  # Хранить резервные копии 30 дней

# Создаем директорию для резервных копий, если она не существует
mkdir -p $BACKUP_DIR

# Сохраняем переменные окружения
cd $APP_DIR
if [ -f .env ]; then
  cp .env $BACKUP_DIR/env-backup-$(date +%Y-%m-%d-%H%M%S)
fi

# Создаем резервную копию кода
tar -czf $BACKUP_DIR/$BACKUP_FILENAME -C $APP_DIR .

# Если используется Firebase, можно добавить экспорт данных (требуется настройка Firebase CLI)
# firebase --project YOUR_PROJECT_ID firestore:export $BACKUP_DIR/firestore-$(date +%Y-%m-%d-%H%M%S)

# Удаляем старые резервные копии
find $BACKUP_DIR -name "arctic-olympiad-*.tar.gz" -type f -mtime +$KEEP_DAYS -delete
find $BACKUP_DIR -name "env-backup-*" -type f -mtime +$KEEP_DAYS -delete

# Сообщение об успешном завершении
echo "Резервное копирование завершено: $BACKUP_DIR/$BACKUP_FILENAME"
echo "Размер архива: $(du -h $BACKUP_DIR/$BACKUP_FILENAME | cut -f1)" 