-- ============================================================================
-- End-to-End Sales & Business Performance Analytics
-- File: sql/05_customer_analysis.sql
-- Description: Customer Segmentation, LTV, Retention, and Concentration Analysis.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Customer Segment Commercial Benchmark
-- Evaluates performance across Consumer, Corporate, and Home Office cohorts
-- ----------------------------------------------------------------------------
SELECT 
    segment,
    COUNT(DISTINCT customer_id) AS total_customers,
    COUNT(DISTINCT order_id) AS total_orders,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND(SUM(sales) / NULLIF(COUNT(DISTINCT order_id), 0), 2) AS avg_order_value,
    ROUND(SUM(sales) / NULLIF(COUNT(DISTINCT customer_id), 0), 2) AS revenue_per_customer,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND((SUM(sales) / SUM(SUM(sales)) OVER ()) * 100.0, 2) AS sales_contribution_pct
FROM superstore
GROUP BY segment
ORDER BY total_sales DESC;

-- ----------------------------------------------------------------------------
-- 2. Top 10 Customers by Revenue & Profit Contribution
-- High-value client ranking using DENSE_RANK()
-- ----------------------------------------------------------------------------
WITH ranked_customers AS (
    SELECT 
        customer_id,
        customer_name,
        segment,
        COUNT(DISTINCT order_id) AS order_count,
        SUM(quantity) AS total_units,
        ROUND(SUM(sales), 2) AS total_sales,
        ROUND(SUM(profit), 2) AS total_profit,
        ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
        DENSE_RANK() OVER (ORDER BY SUM(sales) DESC) AS revenue_rank
    FROM superstore
    GROUP BY customer_id, customer_name, segment
)
SELECT 
    revenue_rank,
    customer_name,
    segment,
    order_count,
    total_sales,
    total_profit,
    profit_margin_pct
FROM ranked_customers
WHERE revenue_rank <= 10
ORDER BY revenue_rank ASC;

-- ----------------------------------------------------------------------------
-- 3. Customer Repeat Purchase Behavior & Frequency Distribution
-- Segments customer base by total number of completed purchase orders
-- ----------------------------------------------------------------------------
WITH customer_order_counts AS (
    SELECT 
        customer_id,
        COUNT(DISTINCT order_id) AS order_frequency,
        SUM(sales) AS total_spend,
        SUM(profit) AS total_profit
    FROM superstore
    GROUP BY customer_id
)
SELECT 
    CASE 
        WHEN order_frequency = 1 THEN '1 Order (One-Time Buyer)'
        WHEN order_frequency BETWEEN 2 AND 4 THEN '2 - 4 Orders (Developing)'
        WHEN order_frequency BETWEEN 5 AND 9 THEN '5 - 9 Orders (Loyal)'
        ELSE '10+ Orders (Power Buyer)'
    END AS customer_loyalty_tier,
    COUNT(*) AS customer_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_order_counts)), 2) AS pct_of_customer_base,
    ROUND(SUM(total_spend), 2) AS aggregate_sales,
    ROUND(SUM(total_profit), 2) AS aggregate_profit,
    ROUND((SUM(total_spend) / SUM(SUM(total_spend)) OVER ()) * 100.0, 2) AS sales_share_pct
FROM customer_order_counts
GROUP BY 
    CASE 
        WHEN order_frequency = 1 THEN '1 Order (One-Time Buyer)'
        WHEN order_frequency BETWEEN 2 AND 4 THEN '2 - 4 Orders (Developing)'
        WHEN order_frequency BETWEEN 5 AND 9 THEN '5 - 9 Orders (Loyal)'
        ELSE '10+ Orders (Power Buyer)'
    END
ORDER BY aggregate_sales DESC;

-- ----------------------------------------------------------------------------
-- 4. Unprofitable Customer Accounts (Loss-makers)
-- Pinpoints client relationships eroding company bottom-line
-- ----------------------------------------------------------------------------
SELECT 
    customer_id,
    customer_name,
    segment,
    COUNT(DISTINCT order_id) AS order_count,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS net_loss,
    ROUND(AVG(discount) * 100.0, 2) AS avg_discount_pct
FROM superstore
GROUP BY customer_id, customer_name, segment
HAVING SUM(profit) < 0
ORDER BY net_loss ASC
LIMIT 10;
