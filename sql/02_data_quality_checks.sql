-- ============================================================================
-- End-to-End Sales & Business Performance Analytics
-- File: sql/02_data_quality_checks.sql
-- Description: Automated SQL Data Quality & Integrity Validation Test Suite.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Test 1: Null Value Audit on Critical Business Attributes
-- Expected Result: 0 rows returned
-- ----------------------------------------------------------------------------
SELECT 
    'Null Value Check' AS test_name,
    COUNT(*) AS failure_count
FROM superstore
WHERE order_id IS NULL
   OR customer_id IS NULL
   OR product_id IS NULL
   OR order_date IS NULL
   OR ship_date IS NULL
   OR sales IS NULL
   OR profit IS NULL;

-- ----------------------------------------------------------------------------
-- Test 2: Duplicate Transaction Row Verification
-- Expected Result: 0 duplicate rows
-- ----------------------------------------------------------------------------
SELECT 
    'Duplicate Row ID Check' AS test_name,
    row_id,
    COUNT(*) AS occurrences
FROM superstore
GROUP BY row_id
HAVING COUNT(*) > 1;

-- ----------------------------------------------------------------------------
-- Test 3: Chronological Integrity (Ship Date >= Order Date)
-- Expected Result: 0 records with ship_date earlier than order_date
-- ----------------------------------------------------------------------------
SELECT 
    'Negative Shipping Duration Check' AS test_name,
    COUNT(*) AS anomalous_records
FROM superstore
WHERE ship_date < order_date;

-- ----------------------------------------------------------------------------
-- Test 4: Financial & Numerical Boundary Validation
-- Sales must be strictly positive; discounts bounded between 0.0 and 1.0; quantity >= 1
-- Expected Result: 0 anomalous records
-- ----------------------------------------------------------------------------
SELECT 
    'Numerical Domain Boundary Check' AS test_name,
    COUNT(*) AS invalid_records
FROM superstore
WHERE sales <= 0
   OR discount < 0.0 
   OR discount > 1.0
   OR quantity <= 0;

-- ----------------------------------------------------------------------------
-- Test 5: Distinct Entities and Cardinality Audit
-- Provides high-level operational baseline counts
-- ----------------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_rows,
    COUNT(DISTINCT order_id) AS total_unique_orders,
    COUNT(DISTINCT customer_id) AS total_unique_customers,
    COUNT(DISTINCT product_id) AS total_unique_products,
    COUNT(DISTINCT state) AS total_states_served,
    COUNT(DISTINCT region) AS total_regions,
    MIN(order_date) AS earliest_order_date,
    MAX(order_date) AS latest_order_date
FROM superstore;
