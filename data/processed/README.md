# Processed Data Documentation

This folder stores the cleaned, standardized, and validated dataset produced by the automated data pipeline in `python/01_data_cleaning.py`.

## Output Files

- `superstore_cleaned.csv`: Fully transformed dataset containing cleaned snake_case fields and derived analytical columns.
- `data_quality_report.json`: Summary audit file documenting record counts, missing values, duplicate detection, and validation checks.

## Transformation & Cleaning Rules Applied

1. **Column Normalization**:
   - Headers converted to clean, lowercase, snake_case strings:
     - `Order ID` -> `order_id`
     - `Order Date` -> `order_date`
     - `Ship Date` -> `ship_date`
     - `Ship Mode` -> `ship_mode`
     - `Customer ID` -> `customer_id`
     - `Postal Code` -> `postal_code` (cast as 5-character string with leading zero preservation)
     - `Sub-Category` -> `sub_category`
     - `Sales` -> `sales`
     - `Profit` -> `profit`
     - `Discount` -> `discount`
     - `Quantity` -> `quantity`

2. **Date Type Casting & Consistency**:
   - Dates parsed as ISO `YYYY-MM-DD`.
   - Verified that `ship_date >= order_date` for all records.

3. **Numeric Type Validation**:
   - `sales`: Positive float, rounded to 2 decimal places.
   - `profit`: Float, rounded to 2 decimal places (negative profit is retained as valid commercial losses).
   - `discount`: Float bounded between 0.00 and 1.00.
   - `quantity`: Integer >= 1.

4. **Engineered Analytical Features**:
   - `shipping_days`: Days elapsed between `order_date` and `ship_date` (`ship_date - order_date`).
   - `order_year`: Extracted calendar year.
   - `order_month`: Extracted calendar month (1-12).
   - `order_year_month`: String period format (e.g., `2016-11`).
   - `profit_margin`: Percentage profit computed as `profit / sales` (with safe division).
   - `is_profitable`: Boolean indicator flag (`profit > 0`).

5. **Data Quality Integrity**:
   - 0 duplicate transaction rows detected.
   - 0 null values in primary operational fields (`order_id`, `customer_id`, `product_id`, `sales`, `profit`).
