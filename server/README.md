# Server — интеграция с amoCRM

Бэкенд тестового задания: OAuth-авторизация в amoCRM, хранение токенов и проксирование запросов к amoCRM API v4.

Стек: NestJS 11, Prisma 7 + PostgreSQL, Axios, class-validator.

## Запуск

Из корня репозитория:

```bash
npm i
npm run dev:server
```

Или из папки `server`:

```bash
npm run start:dev
```

Сервер: http://localhost:3000.

## Окружение

Создайте `server/.env` на основе `.env.example` и заполните:

```env
DATABASE_URL=
AMO_CLIENT_ID=...
AMO_CLIENT_SECRET=...
AMO_REDIRECT_URI=http://localhost:3000/oauth/callback

# необязательно
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## База данных

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

Схема — `prisma/schema.prisma`, модель `AmoToken` хранит токены по `referer` (домен аккаунта amoCRM). Конфиг Prisma 7 — `prisma7.config.ts`, он подхватывается CLI автоматически.

## Авторизация в amoCRM

1. Создайте интеграцию в amoCRM (внешняя интеграция) и укажите redirect URI, совпадающий с `AMO_REDIRECT_URI`.
2. Запустите сервер и откройте:

```text
http://localhost:3000/oauth/authorize
```

3. После подтверждения amoCRM вернёт код на `/oauth/callback`; сервер обменяет его на токены и сохранит их в PostgreSQL.

Особенности реализации:

- `state` генерируется случайно и проверяется через httpOnly-cookie (защита от CSRF).
- Проверяется формат `referer` (`*.amocrm.ru` / `*.amocrm.com`).
- Access-токен обновляется автоматически при ответе `401` от amoCRM; параллельные запросы ждут один refresh.
- Токены сохраняются через `upsert` по `referer`.

## Эндпоинты

| Метод | Путь | Описание |
| --- | --- | --- |
| `GET` | `/oauth/authorize` | редирект на авторизацию amoCRM |
| `GET` | `/oauth/callback` | обмен кода на токены, сохранение в БД |
| `GET` | `/api/leads?page=1&limit=50` | лиды (limit ограничен 1..250) |
| `GET` | `/api/pipelines` | воронки со статусами |
| `GET` | `/api/users` | пользователи аккаунта |

## CLI: тестовые лиды

Создаёт по одному лиду на каждый этап каждой воронки.

```bash
# из server/
npm run seed:leads
npm run seed:leads:dry   # показать план без создания

# из корня
npm run seed:leads -w server
```

Перед запуском нужна авторизация в amoCRM (в БД должен быть токен).

## Скрипты

| Команда | Что делает |
| --- | --- |
| `npm run start:dev` | dev-режим с watch |
| `npm run build` | сборка NestJS |
| `npm run start:prod` | запуск собранного приложения |
| `npm run lint` | eslint |
| `npm run test` | unit-тесты |
| `npm run seed:leads` | создать тестовые лиды |
