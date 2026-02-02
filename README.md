# ZenCode

Веб-приложение для учёта приходов (Orders) и продуктов (Products): отдельные страницы, навигация, фильтры, удаление с подтверждением, дата/время в реальном времени и счётчик активных сессий по WebSocket.

Дуеплой проекта https://zencode-bice.onrender.com
---

## Стек

- **Frontend:** React 19, TypeScript, Vite 7, React Router 7, Redux Toolkit, Bootstrap 5, Motion (анимации)
- **API:** JSON Server (`db.json`)
- **Realtime:** WebSocket (Node.js, библиотека `ws`) — активные сессии в браузерах

---

## Структура проекта

```
ZenCode/
├── src/
│   ├── components/       # UI-компоненты
│   │   ├── Header.tsx    # Шапка: логотип, поиск, TopMenu
│   │   ├── TopMenu.tsx  # Дата и время в реальном времени
│   │   ├── NavigationMenu.tsx  # Боковое меню с роут-ссылками
│   │   ├── ActiveConnections.tsx  # Счётчик активных сессий (WebSocket)
│   │   ├── OrderRow.tsx  # Строка прихода
│   │   ├── ProductRow.tsx
│   │   ├── ConfirmDeleteModal.tsx
│   │   └── ...
│   ├── layout/
│   │   └── MainLayout.tsx  # Header + NavigationMenu + Outlet
│   ├── pages/
│   │   ├── OrdersPage.tsx   # Страница «Приход»
│   │   └── ProductsPage.tsx # Страница «Продукты»
│   ├── router/
│   │   └── Router.tsx   # Маршруты: /, /products, *
│   ├── store/           # Redux: products, orders, connections
│   ├── services/        # API, WebSocket
│   └── types.ts
├── db.json              # Данные JSON Server (products, orders)
├── ws-server.js        # WebSocket-сервер (активные сессии)
├── docker-compose.yml  # frontend (nginx), api (json-server), ws
└── Dockerfile, Dockerfile.api, Dockerfile.ws
```

---

## Функциональность

- **Отдельные страницы:** «Приход» (`/`), «Продукты» (`/products`), 404 для остальных путей.
- **Navigation Menu:** боковое меню с роут-ссылками (Приход, Продукты и др.); активный пункт подсвечивается.
- **TopMenu (в шапке):** дата и время в реальном времени (обновление раз в 30 с).
- **Счётчик активных сессий:** компонент `ActiveConnections` подключается к WebSocket и отображает количество активных сессий в браузерах в реальном времени.
- **Orders (Приход):**
  - Список приходов: название, количество продуктов, даты в двух форматах, сумма в двух валютах (USD, UAH).
  - Клик по приходу — справа открывается блок с продуктами этого прихода; блок можно закрыть.
  - Кнопка удаления прихода (без попапа в текущей реализации; удаление через API).
- **Products (Продукты):**
  - Список всех продуктов; фильтр по типу (один селект, например «Все» / «Мониторы»).
  - В карточке продукта: название, тип, даты гарантии в разных форматах, цены в разных валютах, название прихода.
  - Кнопка удаления продукта — открывается попап подтверждения, затем удаление через API.
- **Данные:** структура и связь Orders ↔ Products заданы в `db.json` (поля и отношения можно смотреть там и в `src/types.ts`).

---

## Данные (API)

- **Источник:** `db.json` — JSON Server на порту 3001.
- **Сущности:** `products`, `orders`. У продукта есть поле `order` (id прихода); у прихода — массив продуктов по этому id.
- Пример полей: в `src/types.ts` (интерфейсы `Product`, `Order`).

---

## Локальный запуск

Убедитесь, что установлены Node.js и npm.

```bash
# Установка зависимостей
npm install

# Запуск API, WebSocket и фронта одной командой
npm run dev:all
```

- Фронт: http://localhost:5173 (или порт из вывода Vite)
- API: http://localhost:3001
- WebSocket: ws://localhost:8080

По отдельности:

```bash
npm run server   # json-server --watch db.json --port 3001
npm run ws       # node ws-server.js
npm run dev      # vite
```

---

## Docker

Приложение собирается в три контейнера: фронт (nginx), API (json-server), WebSocket-сервер.

```bash
docker compose up -d --build
```

- Фронт: http://localhost  
- API: http://localhost:3001  
- WebSocket: ws://localhost:8080  

Остановка: `docker compose down`.

Данные API хранятся в `db.json` на хосте (volume), при перезапуске контейнеров не теряются.

**Деплой на сервер:** скопируйте `env.example` в `.env`, при необходимости задайте `VITE_API_URL` и `VITE_WS_URL` (URL, по которым браузер обращается к API и WS), затем пересоберите образ фронта: `docker compose up -d --build`.

| Действие | Команда |
|----------|---------|
| Запуск (сборка) | `docker compose up -d --build` |
| Остановка | `docker compose down` |
| Логи | `docker compose logs -f` или `docker compose logs -f api` / `frontend` / `ws` |
| Пересборка фронта | `docker compose up -d --build frontend` |

