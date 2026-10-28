-- ============================================================================
-- End-to-End Sales & Business Performance Analytics
-- File: sql/03_sales_performance.sql
-- Description: Core Sales & Revenue Performance Analytics.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Executive Headline KPIs
-- Key performance indicators matching executive Power BI metrics
-- ----------------------------------------------------------------------------
SELECT 
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    SUM(quantity) AS total_units_sold,
    ROUND(SUM(sales) / NULLIF(COUNT(DISTINCT order_id), 0), 2) AS average_order_value,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(discount) * 100.0, 2) AS average_discount_pct,
    ROUND(AVG(shipping_days), 1) AS average_shipping_days
FROM superstore;

-- ----------------------------------------------------------------------------
-- 2. Annual Sales & Profit Performance with Year-over-Year (YoY) Growth
-- Utilizes Window Function LAG() to calculate YoY revenue and profit growth %
-- ----------------------------------------------------------------------------
WITH annual_summary AS (
    SELECT 
        order_year,
        ROUND(SUM(sales), 2) AS annual_sales,
        ROUND(SUM(profit), 2) AS annual_profit,
        COUNT(DISTINCT order_id) AS order_volume,
        ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS annual_margin_pct
    FROM superstore
    GROUP BY order_year
)
SELECT 
    order_year,
    annual_sales,
    annual_profit,
    order_volume,
    annual_margin_pct,
    LAG(annual_sales, 1) OVER (ORDER BY order_year) AS prior_year_sales,
    ROUND(
        ((annual_sales - LAG(annual_sales, 1) OVER (ORDER BY order_year)) 
        / NULLIF(LAG(annual_sales, 1) OVER (ORDER BY order_year), 0)) * 100.0, 
        2
    ) AS sales_yoy_growth_pct,
    ROUND(
        ((annual_profit - LAG(annual_profit, 1) OVER (ORDER BY order_year)) 
        / NULLIF(LAG(annual_profit, 1) OVER (ORDER BY order_year), 0)) * 100.0, 
        2
    ) AS profit_yoy_growth_pct
FROM annual_summary
ORDER BY order_year ASC;

-- ----------------------------------------------------------------------------
-- 3. Monthly Sales Trajectory & Seasonality Analysis
-- Evaluates monthly revenue, profit, and running total across the full timeline
-- ----------------------------------------------------------------------------
SELECT 
    order_year_month,
    ROUND(SUM(sales), 2) AS monthly_sales,
    ROUND(SUM(profit), 2) AS monthly_profit,
    COUNT(DISTINCT order_id) AS monthly_orders,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS monthly_margin_pct,
    -- Running cumulative revenue
    ROUND(SUM(SUM(sales)) OVER (ORDER BY order_year_month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 2) AS cumulative_sales
FROM superstore
GROUP BY order_year_month
ORDER BY order_year_month ASC;

-- ----------------------------------------------------------------------------
-- 4. Shipping Mode Efficiency and Fulfillment Analysis
-- Analyzes sales distribution, delivery velocity, and profit impact per tier
-- ----------------------------------------------------------------------------
SELECT 
    ship_mode,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(shipping_days), 1) AS avg_delivery_days,
    ROUND((SUM(sales) / SUM(SUM(sales)) OVER ()) * 100.0, 2) AS sales_share_pct
FROM superstore
GROUP BY ship_mode
ORDER BY total_sales DESC;
