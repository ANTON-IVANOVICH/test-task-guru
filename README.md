# Test Task Guru

Приложение для работы с сущностями товаров:

- авторизация через DummyJSON Auth
- список товаров с загрузкой из DummyJSON Products
- поиск через API
- сортировка по столбцам
- локальное редактирование и добавление позиций
- сохранение сессии с учетом чекбокса "Запомнить данные"

## Стек

- React + TypeScript + Vite
- Mantine UI
- Zustand
- react-router-dom
- @tanstack/react-query
- Docker + Docker Compose

## Запуск локально

```bash
cp .env.example .env
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`.

## Запуск в Docker одной командой

```bash
docker compose up --build
```

Приложение будет доступно по адресу `http://localhost:8080`.

## Тестовая авторизация

Используйте любые валидные учетные данные из документации DummyJSON Auth:

- https://dummyjson.com/docs/auth

API товаров:

- https://dummyjson.com/docs/products

## Переменные окружения

```bash
VITE_API_BASE_URL=https://dummyjson.com
```
