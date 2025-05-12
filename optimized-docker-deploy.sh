#!/bin/bash

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

# Очистка Docker
cleanup_docker() {
  print_message "Очистка Docker кэша и неиспользуемых образов..."
  
  # Остановка и удаление всех контейнеров, связанных с проектом
  if docker ps -a | grep -q "arctic-olympiad"; then
    docker stop arctic-olympiad 2>/dev/null
    docker rm arctic-olympiad 2>/dev/null
  fi
  
  # Удаление неиспользуемых образов и кэша
  docker system prune -f
  
  print_message "Очистка завершена."
}

# Проверка наличия .env файла
check_env() {
  if [ ! -f .env ]; then
    print_warning "Файл .env не найден. Создание файла с пустыми значениями..."
    cat > .env << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
EOF
    print_message "Файл .env создан. Пожалуйста, заполните его правильными значениями."
    return 1
  fi
  return 0
}

# Построение и запуск Docker
build_and_run() {
  print_message "Начинаем сборку Docker образа (это может занять некоторое время)..."
  
  # Сборка образа с кэшированием слоев
  docker-compose build --parallel --no-cache web
  
  if [ $? -ne 0 ]; then
    print_error "Ошибка при сборке Docker образа."
    return 1
  fi
  
  print_message "Запуск контейнера..."
  docker-compose up -d
  
  if [ $? -ne 0 ]; then
    print_error "Ошибка при запуске контейнера."
    return 1
  fi
  
  print_message "Контейнер запущен успешно."
  return 0
}

# Основная логика скрипта
main() {
  print_message "Начало оптимизированного деплоя Арктической олимпиады..."
  
  # Шаг 1: Очистка Docker
  cleanup_docker
  
  # Шаг 2: Проверка .env файла
  check_env
  if [ $? -ne 0 ] && [ "$1" != "--force" ]; then
    print_warning "Запустите скрипт с флагом --force для продолжения без настроенного .env файла."
    exit 1
  fi
  
  # Шаг 3: Сборка и запуск
  build_and_run
  if [ $? -eq 0 ]; then
    print_message "Сайт успешно запущен на http://localhost:8080"
  else
    print_error "Не удалось запустить сайт. Проверьте логи для получения дополнительной информации."
    exit 1
  fi
}

# Запуск основной функции
main "$@" 