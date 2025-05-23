# Арктическая олимпиада "Полярный круг" 2025

Официальный сайт Арктической олимпиады "Полярный круг" 2025 года. Всероссийская олимпиада школьников по математике, биологии, физике и химии, проводимая при поддержке Департамента образования ЯНАО.

## Функциональность сайта

- Главная страница с общей информацией об олимпиаде, статистикой и новостями
- Страница истории олимпиады
- Архив с материалами прошлых олимпиад
- Отдельные страницы для каждого предмета олимпиады
- Страница с официальными документами
- Контактная информация
- Форма регистрации участников

## Технологии

- Next.js
- React
- Bootstrap 5
- CSS Modules

## Структура проекта

```
arctic-olympiad/
├── public/              # Статические файлы
│   ├── documents/       # PDF документы
│   ├── files/           # Файлы с заданиями
│   └── images/          # Изображения
├── src/                 # Исходный код
│   ├── components/      # React компоненты
│   ├── data/            # Данные для страниц
│   ├── pages/           # Страницы сайта
│   └── styles/          # CSS стили
└── package.json         # Зависимости проекта
```

## Установка и запуск

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env.local` в корне проекта со следующими переменными:

```
# Конфигурация Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Секретный ключ для JWT
JWT_SECRET=your-secret-key
```

3. Запустите проект в режиме разработки:

```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Сборка для продакшена

```bash
npm run build
npm run start
```

## Использование Firebase

Проект поддерживает использование Firebase для хранения данных. Для настройки Firebase:

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Создайте веб-приложение в проекте
3. Скопируйте данные конфигурации в файл `.env.local`
4. Зайдите в административную панель по адресу `/admin/login` (логин: admin, пароль: arctic2025olympiad)
5. Перейдите в раздел "Миграция данных" и запустите процесс миграции

## Административная панель

Для доступа к административной панели перейдите по адресу `/admin/login`:
- Логин: `admin`
- Пароль: `arctic2025olympiad`

В административной панели доступны:
- Управление новостями
- Редактирование содержимого страниц
- Миграция данных в Firebase

## Docker

Проект включает в себя Docker-конфигурацию для запуска в контейнере:

```bash
# Для Windows
./docker-deploy.ps1

# Для Linux/Mac
./docker-deploy.sh
```

## Страницы сайта

- `/` - Главная страница
- `/about/history` - История олимпиады
- `/about/archive` - Архив олимпиады
- `/subjects/math` - Олимпиада по математике
- `/subjects/biology` - Олимпиада по биологии
- `/subjects/physics` - Олимпиада по физике
- `/subjects/chemistry` - Олимпиада по химии
- `/documents` - Документы олимпиады
- `/contacts` - Контакты
- `/register` - Регистрация участников 

## Деплой на сервер с Firebase

### Настройка Firebase 

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. В разделе Authentication включите аутентификацию через Email/Password
3. В разделе Firestore Database создайте базу данных
4. Во вкладке Project Settings получите конфигурацию Firebase для веб-приложения

### Настройка переменных окружения

1. Создайте файл `.env` в корне проекта на основе `.env.example`
2. Заполните следующие переменные окружения из консоли Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### Деплой с использованием Docker

1. Убедитесь, что Docker и Docker Compose установлены на сервере
2. Запустите скрипт деплоя:

```bash
# Для Linux/Mac
./deploy.sh

# Для Windows (PowerShell)
.\deploy.ps1
```

3. После успешного деплоя приложение будет доступно по адресу http://localhost:3000

### Ручной деплой без Docker

1. Установите зависимости:
```bash
npm install
```

2. Создайте оптимизированную сборку:
```bash
npm run build
```

3. Запустите сервер:
```bash
npm start
```

4. Приложение будет доступно по адресу http://localhost:3000

## Управление контентом

После деплоя необходимо инициализировать базовый контент в Firebase:

1. Импортируйте данные о контактах:
```bash
node src/scripts/addContactsData.js
```

2. Импортируйте документы:
```bash
node src/scripts/addDocumentsData.js
```

## Устранение неполадок

### Проблемы с Firebase

- Убедитесь, что ваш IP-адрес разрешен в правилах безопасности Firebase
- Проверьте правильность всех переменных окружения
- Для отладки проверьте консоль браузера на наличие ошибок аутентификации

### Проблемы с Docker

- Проверьте логи контейнера: `docker-compose logs -f`
- Перестройте контейнер с нуля: `docker-compose build --no-cache` 