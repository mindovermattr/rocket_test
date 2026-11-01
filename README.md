# Rocket Test — лиды из amoCRM

Тестовое задание: таблица лидов из amoCRM с фильтрами, статистикой и переходом в карточку лида.

Монорепозиторий на npm workspaces:

- `client` — Vue 3 + TypeScript + Vite, PrimeVue, TanStack Vue Query
- `server` — NestJS 11, Prisma 7 + PostgreSQL, интеграция с amoCRM API v4

## Быстрый старт

Требования: Node.js 22.18+ (или 24.12+), PostgreSQL.

```bash
# 1. Зависимости
npm i

# 2. Переменные окружения
# скопируйте server/.env.example -> server/.env и client/.env.example -> client/.env
# в server/.env обязательно добавьте DATABASE_URL
```

`server/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/rocket_test
AMO_CLIENT_ID=...
AMO_CLIENT_SECRET=...
AMO_REDIRECT_URI=http://localhost:3000/oauth/callback
# необязательно
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

`client/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_PRIME_LICENSE_KEY=
```

```bash
# 3. База данных
cd server
npx prisma migrate dev
npx prisma generate        # выполняется автоматически при migrate, но можно явно

# 4. Авторизация в amoCRM
npm run start:dev          # в отдельном терминале
# откройте http://localhost:3000/oauth/authorize
# токен сохранится в таблицу AmoToken

# 5. Запуск клиента и сервера из корня
cd ..
npm run dev
```

Клиент: http://localhost:5173, API: http://localhost:3000/api.

> В настройках интеграции amoCRM redirect URI должен совпадать с `AMO_REDIRECT_URI`.
> Подробнее — в [server/README.md](server/README.md).

## Скрипты (из корня)

| Команда | Что делает |
| --- | --- |
| `npm run dev` | клиент + сервер одновременно |
| `npm run dev:client` | только клиент |
| `npm run dev:server` | только сервер (watch) |
| `npm run build` | сборка клиента и сервера |
| `npm run lint` | линт клиента и сервера |

## Что реализовано

- OAuth-авторизация в amoCRM с проверкой `state` и сохранением токенов в PostgreSQL.
- Автоматическое обновление access-токена при `401` (без параллельных refresh-запросов).
- Проксирующие эндпоинты: лиды, воронки со статусами, пользователи.
- Таблица лидов: ID (ссылка в amoCRM), название, сумма, дата создания, статус, воронка, ответственный.
- Фильтры: воронка, этап, ответственный, диапазон бюджета; сброс фильтров.
- Статистика по отфильтрованным лидам: количество и сумма.
- Состояния загрузки и ошибки с возможностью повторить запрос.
- CLI-команда для создания тестовых лидов по одному на каждый этап каждой воронки.
