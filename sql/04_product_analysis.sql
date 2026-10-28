-- ============================================================================
-- End-to-End Sales & Business Performance Analytics
-- File: sql/04_product_analysis.sql
-- Description: Product Portfolio, Category Profitability, and SKU Risk Analysis.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Category Financial Matrix
-- Overall sales volume, net profit, margin %, and revenue contribution
-- ----------------------------------------------------------------------------
SELECT 
    category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    SUM(quantity) AS units_sold,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(discount) * 100.0, 2) AS avg_discount_pct,
    ROUND((SUM(sales) / SUM(SUM(sales)) OVER ()) * 100.0, 2) AS sales_contribution_pct
FROM superstore
GROUP BY category
ORDER BY total_sales DESC;

-- ----------------------------------------------------------------------------
-- 2. Sub-Category In-Depth Performance & Loss Identification
-- Identifies structurally unprofitable sub-categories (e.g. Tables, Bookcases)
-- ----------------------------------------------------------------------------
SELECT 
    category,
    sub_category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    SUM(quantity) AS units_sold,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(discount) * 100.0, 2) AS avg_discount_pct,
    CASE 
        WHEN SUM(profit) < 0 THEN 'Loss-Making Segment'
        WHEN (SUM(profit) / NULLIF(SUM(sales), 0)) < 0.10 THEN 'Low Margin (<10%)'
        ELSE 'Healthy Margin (>=10%)'
    END AS segment_health_status
FROM superstore
GROUP BY category, sub_category
ORDER BY total_profit ASC;

-- ----------------------------------------------------------------------------
-- 3. Top 10 Products by Total Sales Revenue
-- Using Window Function DENSE_RANK()
-- ----------------------------------------------------------------------------
WITH ranked_sales AS (
    SELECT 
        product_id,
        product_name,
        category,
        sub_category,
        ROUND(SUM(sales), 2) AS total_sales,
        ROUND(SUM(profit), 2) AS total_profit,
        SUM(quantity) AS total_units,
        ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
        DENSE_RANK() OVER (ORDER BY SUM(sales) DESC) AS sales_rank
    FROM superstore
    GROUP BY product_id, product_name, category, sub_category
)
SELECT 
    sales_rank,
    product_name,
    category,
    sub_category,
    total_sales,
    total_profit,
    total_units,
    profit_margin_pct
FROM ranked_sales
WHERE sales_rank <= 10
ORDER BY sales_rank ASC;

-- ----------------------------------------------------------------------------
-- 4. Top 10 Products by Net Profit
-- Using Window Function DENSE_RANK()
-- ----------------------------------------------------------------------------
WITH ranked_profit AS (
    SELECT 
        product_id,
        product_name,
        category,
        sub_category,
        ROUND(SUM(sales), 2) AS total_sales,
        ROUND(SUM(profit), 2) AS total_profit,
        SUM(quantity) AS total_units,
        ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
        DENSE_RANK() OVER (ORDER BY SUM(profit) DESC) AS profit_rank
    FROM superstore
    GROUP BY product_id, product_name, category, sub_category
)
SELECT 
    profit_rank,
    product_name,
    category,
    sub_category,
    total_sales,
    total_profit,
    total_units,
    profit_margin_pct
FROM ranked_profit
WHERE profit_rank <= 10
ORDER BY profit_rank ASC;

-- ----------------------------------------------------------------------------
-- 5. High-Sales "Profit Drainers" (Revenue > $2,000 with Net Losses)
-- Pinpoints specific SKUs driving operational value destruction
-- ----------------------------------------------------------------------------
SELECT 
    product_id,
    product_name,
    category,
    sub_category,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS net_loss,
    SUM(quantity) AS units_sold,
    ROUND(AVG(discount) * 100.0, 2) AS avg_discount_pct,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct
FROM superstore
GROUP BY product_id, product_name, category, sub_category
HAVING SUM(sales) >= 2000 AND SUM(profit) < 0
ORDER BY net_loss ASC;
