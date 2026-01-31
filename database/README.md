# Схема БД для MySQL Workbench

Файл **schema.sql** описывает структуру данных тестового приложения ZenCode в виде таблиц MySQL. Его можно открыть в MySQL Workbench и сравнить «что спроектировали» и «что в итоге реализовано» в тестовом (db.json + JSON Server).

## Как открыть в MySQL Workbench

1. Запустите **MySQL Workbench**.
2. **File → Open SQL Script** (или Ctrl+Shift+O).
3. Укажите файл `database/schema.sql`.
4. Скрипт откроется в редакторе. При необходимости выполните его на сервере (молния), чтобы создать БД и таблицы.
5. Чтобы построить **EER-диаграмму** по этой схеме:
   - Подключитесь к серверу MySQL.
   - Выполните `schema.sql` в нужной базе (или создайте новую и выполните скрипт).
   - **Database → Reverse Engineer** → выберите эту базу → отобразится диаграмма таблиц и связей.

## Что в схеме

- **orders** — приходы (id, title, date, description). Соответствует массиву `orders` в db.json.
- **products** — продукты (id, serial_number, title, type, order_id → orders.id, guarantee_start/end, date и др.). Соответствует массиву `products` в db.json; поле `order` в JSON = `order_id` в таблице.
- **product_prices** — цены продукта в разных валютах (product_id, value, symbol, is_default). В тестовом это массив `products[].price[]`.

Связи: один приход (order) — много продуктов (products); один продукт — много записей цен (product_prices).
