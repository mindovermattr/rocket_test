# Server — интеграция с amoCRM

Бэкенд тестового задания: OAuth-авторизация в amoCRM, хранение токенов и проксирование запросов к amoCRM API v4.

Стек: NestJS 11, Prisma 7 + PostgreSQL, Axios, class-validator.

## Запуск

Для первого запуска необходимо инициалзировать БД. Для этого настройте окружение в .env и выполните команды:

```bash
npm i

npx prisma migrate dev
npx prisma generate
```

Запуск приложения:

```bash
npm i
npm run dev:server
```

Сервер: http://localhost:3000.

Для того, чтобы получить в БД первый токен и начать работу с amo, необходимо перейти по ссылке http://localhost:3000/oauth/authorize. Подробнее можно найти в разделе "Авторизация в amoCRM" 

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
| `npm run seed:leads` | создать тестовые лиды |

## Что сделал бы по-другому в prod версии

1) Добавил поддержку нескольких аккаунтов

2) Вместо PostgreSQL можно было бы использовать более легковесную БД (например, sqlite)

3) Обработка ошибок от api amocrm

4) Доработал обработку ошибок (добавил понятный общий интерфейс и все ошибки мапил в него)

5) Добавил валидацию всех DTO
