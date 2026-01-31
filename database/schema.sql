-- =============================================================================
-- ZenCode — схема БД для MySQL Workbench
-- Соответствует структуре данных в тестовом (db.json + src/types.ts).
-- Откройте файл в MySQL Workbench: File → Open SQL Script → выберите schema.sql
-- Либо: Database → Reverse Engineer (если нужна визуализация по существующей БД).
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Таблица приходов (Orders)
-- В тестовом: массив orders в db.json. Связь: один приход — много продуктов.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `product_prices`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL COMMENT 'Название прихода',
  `date` DATETIME NOT NULL COMMENT 'Дата создания прихода',
  `description` TEXT NULL COMMENT 'Описание прихода',
  PRIMARY KEY (`id`),
  INDEX `idx_orders_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Приходы (Orders). В тестовом — JSON Server, массив orders.';

-- -----------------------------------------------------------------------------
-- Таблица продуктов (Products)
-- В тестовом: массив products в db.json. Поле order — id прихода (FK).
-- guarantee и price в JSON Server хранятся как вложенные объект/массив;
-- здесь нормализовано в отдельные колонки и таблицу product_prices.
-- -----------------------------------------------------------------------------
CREATE TABLE `products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `serial_number` INT NOT NULL COMMENT 'Серийный номер',
  `is_new` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 — новый, 0 — нет',
  `photo` VARCHAR(500) NULL COMMENT 'Путь к фото',
  `title` VARCHAR(500) NOT NULL COMMENT 'Название продукта',
  `type` VARCHAR(100) NOT NULL COMMENT 'Тип продукта (Monitors, Keyboard и т.д.)',
  `user_id` INT UNSIGNED NULL COMMENT 'ID пользователя (если есть)',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT 'Статус (0 — доступен, и т.д.)',
  `specification` TEXT NULL COMMENT 'Спецификация',
  `guarantee_start` DATETIME NULL COMMENT 'Начало гарантии (в JSON: guarantee.start)',
  `guarantee_end` DATETIME NULL COMMENT 'Конец гарантии (в JSON: guarantee.end)',
  `order_id` INT UNSIGNED NOT NULL COMMENT 'ID прихода (FK → orders.id)',
  `date` DATETIME NOT NULL COMMENT 'Дата продукта',
  PRIMARY KEY (`id`),
  INDEX `idx_products_order_id` (`order_id`),
  INDEX `idx_products_type` (`type`),
  INDEX `idx_products_date` (`date`),
  CONSTRAINT `fk_products_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Продукты. В тестовом — products[].order ссылается на orders.id.';

-- -----------------------------------------------------------------------------
-- Цены продукта в разных валютах
-- В тестовом: products[].price — массив { value, symbol, isDefault }.
-- -----------------------------------------------------------------------------
CREATE TABLE `product_prices` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED NOT NULL,
  `value` DECIMAL(14,2) NOT NULL COMMENT 'Значение цены',
  `symbol` VARCHAR(10) NOT NULL COMMENT 'Валюта (USD, UAH и т.д.)',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 — основная валюта отображения',
  PRIMARY KEY (`id`),
  INDEX `idx_product_prices_product_id` (`product_id`),
  CONSTRAINT `fk_product_prices_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Цены продукта в разных валютах. В тестовом — products[].price[].';

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- Соответствие «спроектировано vs реализовано в тестовом»
-- =============================================================================
-- Реализовано в тестовом (db.json + JSON Server):
--   • orders: id, title, date, description — как в схеме выше.
--   • products: id, serialNumber, isNew, photo, title, type, userId, status,
--     specification, guarantee { start, end }, price [ { value, symbol, isDefault } ],
--     order (FK на orders.id), date.
-- В данной SQL-схеме:
--   • orders — одна таблица, поля 1:1 с JSON.
--   • products — одна таблица; guarantee вынесен в guarantee_start/guarantee_end;
--     price вынесен в отдельную таблицу product_prices для нормализации.
-- Открытие в MySQL Workbench: File → Open SQL Script → database/schema.sql
-- После открытия можно построить EER-диаграмму: Database → Reverse Engineer
-- (если подключиться к серверу и создать БД из этого скрипта).
-- =============================================================================
