-- ============================================================================
-- End-to-End Sales & Business Performance Analytics
-- File: sql/01_create_tables.sql
-- Description: DDL definitions for analytical tables & Star Schema.
-- Target Dialect: PostgreSQL (with ANSI SQL standard & SQLite compatibility notes)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Staging / Flat Transactional Table
-- Matches the cleaned transactional dataset exported by Python ETL.
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS superstore CASCADE;

CREATE TABLE superstore (
    row_id INT PRIMARY KEY,
    order_id VARCHAR(25) NOT NULL,
    order_date DATE NOT NULL,
    ship_date DATE NOT NULL,
    ship_mode VARCHAR(20) NOT NULL,
    customer_id VARCHAR(20) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    segment VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10),
    region VARCHAR(20) NOT NULL,
    product_id VARCHAR(25) NOT NULL,
    category VARCHAR(30) NOT NULL,
    sub_category VARCHAR(30) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    sales NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    discount NUMERIC(5, 4) NOT NULL CHECK (discount >= 0.0 AND discount <= 1.0),
    profit NUMERIC(10, 2) NOT NULL,
    shipping_days INT,
    order_year INT,
    order_month INT,
    order_year_month VARCHAR(7),
    profit_margin NUMERIC(7, 4),
    is_profitable BOOLEAN
);

-- Analytical Indexing on frequently filtered attributes
CREATE INDEX IF NOT EXISTS idx_superstore_order_date ON superstore(order_date);
CREATE INDEX IF NOT EXISTS idx_superstore_customer_id ON superstore(customer_id);
CREATE INDEX IF NOT EXISTS idx_superstore_product_id ON superstore(product_id);
CREATE INDEX IF NOT EXISTS idx_superstore_category ON superstore(category, sub_category);
CREATE INDEX IF NOT EXISTS idx_superstore_region ON superstore(region, state);


-- ----------------------------------------------------------------------------
-- 2. Star Schema Dimension & Fact Tables
-- Designed for enterprise Data Warehousing, Power BI, and Kimball Modeling.
-- ----------------------------------------------------------------------------

-- Dimension: Customer
DROP TABLE IF EXISTS dim_customer CASCADE;

CREATE TABLE dim_customer (
    customer_id VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    segment VARCHAR(20) NOT NULL
);

-- Dimension: Product
DROP TABLE IF EXISTS dim_product CASCADE;

CREATE TABLE dim_product (
    product_id VARCHAR(25) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(30) NOT NULL,
    sub_category VARCHAR(30) NOT NULL
);

-- Dimension: Geography
DROP TABLE IF EXISTS dim_geography CASCADE;

CREATE TABLE dim_geography (
    geography_id SERIAL PRIMARY KEY, -- In SQLite use INTEGER PRIMARY KEY AUTOINCREMENT
    postal_code VARCHAR(10),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    region VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- Dimension: Date (Calendar Master Table)
DROP TABLE IF EXISTS dim_date CASCADE;

CREATE TABLE dim_date (
    date_key INT PRIMARY KEY, -- Format: YYYYMMDD
    date DATE NOT NULL,
    date_str VARCHAR(10) NOT NULL,
    year INT NOT NULL,
    quarter VARCHAR(2) NOT NULL,
    month INT NOT NULL,
    month_name VARCHAR(15) NOT NULL,
    year_month VARCHAR(7) NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    is_weekend BOOLEAN NOT NULL
);

-- Fact: Sales Transactions
DROP TABLE IF EXISTS fact_sales CASCADE;

CREATE TABLE fact_sales (
    row_id INT PRIMARY KEY,
    order_id VARCHAR(25) NOT NULL,
    order_date DATE NOT NULL,
    ship_date DATE NOT NULL,
    ship_mode VARCHAR(20) NOT NULL,
    customer_id VARCHAR(20) NOT NULL,
    product_id VARCHAR(25) NOT NULL,
    geography_id INT,
    sales NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    discount NUMERIC(5, 4) NOT NULL CHECK (discount >= 0.0 AND discount <= 1.0),
    profit NUMERIC(10, 2) NOT NULL,
    shipping_days INT,
    profit_margin NUMERIC(7, 4)
);

-- Relational Foreign Key Constraints (Enforced in PostgreSQL / optional in SQLite)
-- ALTER TABLE fact_sales ADD CONSTRAINT fk_fact_customer FOREIGN KEY (customer_id) REFERENCES dim_customer(customer_id);
-- ALTER TABLE fact_sales ADD CONSTRAINT fk_fact_product FOREIGN KEY (product_id) REFERENCES dim_product(product_id);
-- ALTER TABLE fact_sales ADD CONSTRAINT fk_fact_geography FOREIGN KEY (geography_id) REFERENCES dim_geography(geography_id);
