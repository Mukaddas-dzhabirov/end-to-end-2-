-- ============================================================================
-- End-to-End Sales & Business Performance Analytics
-- File: sql/07_advanced_analysis.sql
-- Description: Advanced Analytical SQL: CTEs, Window Functions, Discount Elasticity,
--              Running Totals, Star Schema JOINs, and Decile Performance.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Discount Sensitivity & Profitability Cliff Analysis
-- Evaluates the financial impact of discounting by tiering transactions
-- Demonstrates: CASE WHEN, Conditional Aggregation, Percentage of Total
-- ----------------------------------------------------------------------------
WITH discount_brackets AS (
    SELECT 
        order_id,
        sales,
        profit,
        discount,
        CASE 
            WHEN discount = 0.0 THEN '0% (No Discount)'
            WHEN discount <= 0.10 THEN '1% - 10% (Low)'
            WHEN discount <= 0.20 THEN '11% - 20% (Moderate)'
            WHEN discount <= 0.30 THEN '21% - 30% (Aggressive)'
            ELSE '> 30% (Deep Discount)'
        END AS discount_tier
    FROM superstore
)
SELECT 
    discount_tier,
    COUNT(*) AS total_transactions,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND((SUM(sales) / SUM(SUM(sales)) OVER ()) * 100.0, 2) AS sales_pct_of_total,
    ROUND((SUM(CASE WHEN profit > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS profitable_transaction_rate_pct
FROM discount_brackets
GROUP BY discount_tier
ORDER BY MIN(discount) ASC;

-- ----------------------------------------------------------------------------
-- 2. Star Schema Multi-Table Analytical Join
-- Demonstrates relational joins across FactSales, DimCustomer, DimProduct, and DimGeography
-- ----------------------------------------------------------------------------
SELECT 
    c.segment,
    p.category,
    g.region,
    COUNT(DISTINCT f.order_id) AS distinct_orders,
    ROUND(SUM(f.sales), 2) AS total_sales,
    ROUND(SUM(f.profit), 2) AS total_profit,
    ROUND((SUM(f.profit) / NULLIF(SUM(f.sales), 0)) * 100.0, 2) AS profit_margin_pct
FROM fact_sales f
JOIN dim_customer c ON f.customer_id = c.customer_id
JOIN dim_product p ON f.product_id = p.product_id
JOIN dim_geography g ON f.geography_id = g.geography_id
GROUP BY c.segment, p.category, g.region
ORDER BY total_sales DESC
LIMIT 15;

-- ----------------------------------------------------------------------------
-- 3. Monthly Sales Trajectory with Moving Averages & Period-over-Period
-- Demonstrates: CTE, LAG(), Window Functions, 3-Month Moving Average
-- ----------------------------------------------------------------------------
WITH monthly_metrics AS (
    SELECT 
        order_year_month,
        ROUND(SUM(sales), 2) AS sales,
        ROUND(SUM(profit), 2) AS profit
    FROM superstore
    GROUP BY order_year_month
)
SELECT 
    order_year_month,
    sales,
    profit,
    LAG(sales, 1) OVER (ORDER BY order_year_month) AS prev_month_sales,
    ROUND(
        ((sales - LAG(sales, 1) OVER (ORDER BY order_year_month)) 
        / NULLIF(LAG(sales, 1) OVER (ORDER BY order_year_month), 0)) * 100.0, 
        2
    ) AS mom_sales_growth_pct,
    -- 3-Month Moving Average for smoothed trend detection
    ROUND(
        AVG(sales) OVER (
            ORDER BY order_year_month 
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 
        2
    ) AS rolling_3m_avg_sales,
    -- Cumulative Running Total
    ROUND(
        SUM(sales) OVER (
            ORDER BY order_year_month 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ), 
        2
    ) AS ytd_running_total_sales
FROM monthly_metrics
ORDER BY order_year_month ASC;

-- ----------------------------------------------------------------------------
-- 4. Top 3 Selling Products Per Category using ROW_NUMBER()
-- Demonstrates: Window partitioning, ROW_NUMBER vs DENSE_RANK
-- ----------------------------------------------------------------------------
WITH ranked_products_by_category AS (
    SELECT 
        category,
        sub_category,
        product_name,
        ROUND(SUM(sales), 2) AS total_sales,
        ROUND(SUM(profit), 2) AS total_profit,
        ROW_NUMBER() OVER (
            PARTITION BY category 
            ORDER BY SUM(sales) DESC
        ) AS rank_in_category
    FROM superstore
    GROUP BY category, sub_category, product_name
)
SELECT 
    category,
    rank_in_category,
    sub_category,
    product_name,
    total_sales,
    total_profit
FROM ranked_products_by_category
WHERE rank_in_category <= 3
ORDER BY category, rank_in_category;

-- ----------------------------------------------------------------------------
-- 5. Customer Revenue Deciles (Pareto 80/20 Concentration Validation)
-- Demonstrates: NTILE() windowing and cumulative percentile contributions
-- ----------------------------------------------------------------------------
WITH customer_totals AS (
    SELECT 
        customer_id,
        customer_name,
        ROUND(SUM(sales), 2) AS customer_sales,
        ROUND(SUM(profit), 2) AS customer_profit,
        NTILE(10) OVER (ORDER BY SUM(sales) DESC) AS revenue_decile
    FROM superstore
    GROUP BY customer_id, customer_name
)
SELECT 
    revenue_decile,
    COUNT(*) AS customer_count,
    ROUND(SUM(customer_sales), 2) AS decile_sales,
    ROUND(SUM(customer_profit), 2) AS decile_profit,
    ROUND((SUM(customer_sales) / (SELECT SUM(sales) FROM superstore)) * 100.0, 2) AS pct_of_company_sales
FROM customer_totals
GROUP BY revenue_decile
ORDER BY revenue_decile ASC;
