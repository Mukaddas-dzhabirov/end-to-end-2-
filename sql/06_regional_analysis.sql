-- ============================================================================
-- End-to-End Sales & Business Performance Analytics
-- File: sql/06_regional_analysis.sql
-- Description: Geographic Performance, State Profitability, and Territory Variance.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Regional Sales & Profitability Macro Benchmark
-- Compares the 4 major US sales regions: West, East, Central, South
-- ----------------------------------------------------------------------------
SELECT 
    region,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    COUNT(DISTINCT customer_id) AS total_customers,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(discount) * 100.0, 2) AS avg_discount_pct,
    ROUND((SUM(sales) / SUM(SUM(sales)) OVER ()) * 100.0, 2) AS revenue_share_pct
FROM superstore
GROUP BY region
ORDER BY total_sales DESC;

-- ----------------------------------------------------------------------------
-- 2. State-Level Performance: Top 10 Most Profitable States
-- ----------------------------------------------------------------------------
SELECT 
    state,
    region,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(discount) * 100.0, 2) AS avg_discount_pct
FROM superstore
GROUP BY state, region
ORDER BY total_profit DESC
LIMIT 10;

-- ----------------------------------------------------------------------------
-- 3. State-Level Performance: Top 10 Loss-Making States (Underperforming Markets)
-- Documents regions suffering from aggressive discounting and structural losses
-- ----------------------------------------------------------------------------
SELECT 
    state,
    region,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS net_loss,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(discount) * 100.0, 2) AS avg_discount_pct
FROM superstore
GROUP BY state, region
HAVING SUM(profit) < 0
ORDER BY net_loss ASC
LIMIT 10;

-- ----------------------------------------------------------------------------
-- 4. Metro / City Level Performance Matrix (Top 10 Cities by Revenue)
-- ----------------------------------------------------------------------------
SELECT 
    city,
    state,
    region,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct
FROM superstore
GROUP BY city, state, region
ORDER BY total_sales DESC
LIMIT 10;
