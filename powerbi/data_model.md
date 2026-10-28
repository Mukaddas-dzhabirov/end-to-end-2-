# Power BI Star Schema Data Model Specification

## 1. Architectural Overview

The analytical data model follows Ralph Kimball's dimensional modeling principles, structured as a clean **Star Schema**. This decouples business transaction metrics from descriptive entities, optimizes VertiPaq compression in Microsoft Analysis Services, maximizes query speed, and guarantees intuitive DAX authoring.

```
                  +-------------------+
                  |     dim_date      |
                  +-------------------+
                  | PK: date_key      |
                  |     date (Date)   |
                  |     year          |
                  |     quarter       |
                  |     month_name    |
                  +---------+---------+
                            | 1
                            |
                            | *
+-------------------+       |       +-------------------+
|   dim_customer    |       |       |    dim_product    |
+-------------------+       |       +-------------------+
| PK: customer_id   |       |       | PK: product_id    |
|     customer_name |       |       |     product_name  |
|     segment       |       |       |     category      |
+---------+---------+       |       |     sub_category  |
          | 1               |       +---------+---------+
          |                 |                 | 1
          | *               |                 | *
+---------+-----------------+-----------------+---------+
|                       fact_sales                      |
+-------------------------------------------------------+
| PK: row_id                                            |
| FK: order_date    ------> dim_date[date]              |
| FK: customer_id   ------> dim_customer[customer_id]   |
| FK: product_id    ------> dim_product[product_id]     |
| FK: geography_id  ------> dim_geography[geography_id] |
|     order_id                                          |
|     ship_mode                                         |
|     sales (Currency)                                  |
|     profit (Currency)                                 |
|     discount (Percentage)                             |
|     quantity (Integer)                                |
|     shipping_days (Integer)                           |
+-------------------------------------------------------+
                            | *
                            |
                            | 1
                  +---------+---------+
                  |   dim_geography   |
                  +-------------------+
                  | PK: geography_id  |
                  |     city          |
                  |     state         |
                  |     region        |
                  |     postal_code   |
                  +-------------------+
```

---

## 2. Table Specifications & Cardinalities

### Fact Table: `fact_sales`
- **Granularity**: One row per item per order line.
- **Attributes**: `row_id`, `order_id`, `order_date`, `ship_date`, `ship_mode`, `customer_id`, `product_id`, `geography_id`.
- **Measures / Additive Metrics**: `sales`, `quantity`, `discount`, `profit`, `shipping_days`.

### Dimension: `dim_date`
- **Primary Key**: `date` (or `date_key`).
- **Hierarchy**: `Year` -> `Quarter` -> `Month` -> `Date`.
- **Mark as Date Table**: Required. Set `dim_date[date]` as the unique date identifier to enable standard Power BI time-intelligence functions (`TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`).

### Dimension: `dim_customer`
- **Primary Key**: `customer_id`
- **Cardinality to Fact**: `1 to Many (1:*)`
- **Cross-Filter Direction**: Single (Filters `fact_sales`).

### Dimension: `dim_product`
- **Primary Key**: `product_id`
- **Hierarchy**: `Category` -> `Sub-Category` -> `Product Name`.
- **Cardinality to Fact**: `1 to Many (1:*)`
- **Cross-Filter Direction**: Single.

### Dimension: `dim_geography`
- **Primary Key**: `geography_id`
- **Hierarchy**: `Country` -> `Region` -> `State` -> `City` -> `Postal Code`.
- **Cardinality to Fact**: `1 to Many (1:*)`
- **Cross-Filter Direction**: Single.

---

## 3. Step-by-Step Data Model Setup in Power BI Desktop

1. **Load Data**:
   - In Power BI Desktop, navigate to **Home** > **Get Data** > **Folder** or **CSV**.
   - Load `data/processed/star_schema/` tables: `fact_sales.csv`, `dim_customer.csv`, `dim_product.csv`, `dim_geography.csv`, and `dim_date.csv`.
2. **Model View Relationships**:
   - Link `dim_customer[customer_id]` to `fact_sales[customer_id]` (`1:*`, Single).
   - Link `dim_product[product_id]` to `fact_sales[product_id]` (`1:*`, Single).
   - Link `dim_geography[geography_id]` to `fact_sales[geography_id]` (`1:*`, Single).
   - Link `dim_date[date]` to `fact_sales[order_date]` (`1:*`, Single, Active).
   - *(Optional inactive relationship)* Link `dim_date[date]` to `fact_sales[ship_date]` for fulfillment duration analysis with `USERELATIONSHIP()`.
3. **Mark Date Table**:
   - Right-click `dim_date` in the Data pane > **Mark as date table** > Select `date` column.
4. **Sort Columns by Column**:
   - Sort `month_name` by `month` numeric column.
   - Sort `quarter` by `quarter` chronological key.
5. **Hide Foreign Key Columns**:
   - In Model View, right-click foreign keys in `fact_sales` (`customer_id`, `product_id`, `geography_id`) and select **Hide in report view** to prevent report creators from dragging unaggregated raw keys onto canvases.
