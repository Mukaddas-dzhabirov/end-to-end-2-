# Power BI DAX Measures Reference Library

This document provides tested, production-grade DAX measures for the **End-to-End Sales & Business Performance Analytics** solution.

---

## 1. Core Business KPIs

### Total Sales
```dax
Total Sales = 
SUM('fact_sales'[sales])
```
* **Format**: Currency (`$#,##0.00`)
* **Description**: Gross transaction revenue across all filtered sales lines.

---

### Total Profit
```dax
Total Profit = 
SUM('fact_sales'[profit])
```
* **Format**: Currency (`$#,##0.00`)
* **Description**: Net financial profit (retains negative values representing commercial losses).

---

### Total Orders
```dax
Total Orders = 
DISTINCTCOUNT('fact_sales'[order_id])
```
* **Format**: Whole Number (`#,##0`)
* **Description**: Total unique orders placed. Using `DISTINCTCOUNT` is critical—counting table rows would inflate orders because multiple items share the same `order_id`.

---

### Total Quantity Sold
```dax
Total Quantity = 
SUM('fact_sales'[quantity])
```
* **Format**: Whole Number (`#,##0`)
* **Description**: Aggregate units delivered across all SKUs.

---

### Average Order Value (AOV)
```dax
Average Order Value = 
DIVIDE(
    [Total Sales],
    [Total Orders],
    0
)
```
* **Format**: Currency (`$#,##0.00`)
* **Description**: Average revenue generated per distinct customer order. Employs `DIVIDE()` to safely handle zero-order scenarios.

---

### Profit Margin %
```dax
Profit Margin % = 
DIVIDE(
    [Total Profit],
    [Total Sales],
    0
)
```
* **Format**: Percentage (`0.0%` or `0.00%`)
* **Description**: Percentage of gross revenue retained as profit.

---

### Average Discount Rate %
```dax
Average Discount % = 
AVERAGE('fact_sales'[discount])
```
* **Format**: Percentage (`0.0%`)
* **Description**: Mean promotional discount rate applied across line items.

---

### Average Shipping Duration
```dax
Average Shipping Days = 
AVERAGE('fact_sales'[shipping_days])
```
* **Format**: Decimal (`0.0 days`)
* **Description**: Average calendar days elapsed between order date and fulfillment ship date.

---

## 2. Time-Intelligence Measures

> **Prerequisite**: Requires `dim_date` marked as an official Date Table with an active relationship to `fact_sales[order_date]`.

### Sales YTD (Year-To-Date)
```dax
Sales YTD = 
TOTALYTD(
    [Total Sales],
    'dim_date'[date]
)
```

### Profit YTD
```dax
Profit YTD = 
TOTALYTD(
    [Total Profit],
    'dim_date'[date]
)
```

### Prior Year Sales (Sales PY)
```dax
Sales Prior Year = 
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR('dim_date'[date])
)
```

### Prior Year Profit (Profit PY)
```dax
Profit Prior Year = 
CALCULATE(
    [Total Profit],
    SAMEPERIODLASTYEAR('dim_date'[date])
)
```

### Sales Year-over-Year (YoY) Growth %
```dax
Sales YoY Growth % = 
VAR CurrentSales = [Total Sales]
VAR PriorSales = [Sales Prior Year]
RETURN
DIVIDE(
    CurrentSales - PriorSales,
    PriorSales,
    0
)
```
* **Format**: Percentage (`+0.0%;-0.0%;0.0%`)

### Profit Year-over-Year (YoY) Growth %
```dax
Profit YoY Growth % = 
VAR CurrentProfit = [Total Profit]
VAR PriorProfit = [Profit Prior Year]
RETURN
DIVIDE(
    CurrentProfit - PriorProfit,
    ABS(PriorProfit),
    0
)
```

### Month-over-Month (MoM) Sales Growth %
```dax
Sales MoM Growth % = 
VAR CurrentSales = [Total Sales]
VAR PreviousMonthSales = 
    CALCULATE(
        [Total Sales],
        DATEADD('dim_date'[date], -1, MONTH)
    )
RETURN
DIVIDE(
    CurrentSales - PreviousMonthSales,
    PreviousMonthSales,
    0
)
```

---

## 3. Analytical & Share-of-Wallet Measures

### Sales % of Total
```dax
Sales % of Total = 
DIVIDE(
    [Total Sales],
    CALCULATE(
        [Total Sales],
        ALLSELECTED('fact_sales')
    ),
    0
)
```

### Profit % of Total
```dax
Profit % of Total = 
DIVIDE(
    [Total Profit],
    CALCULATE(
        [Total Profit],
        ALLSELECTED('fact_sales')
    ),
    0
)
```

### Product Rank by Sales
```dax
Product Sales Rank = 
IF(
    ISINSCOPE('dim_product'[product_name]),
    RANKX(
        ALLSELECTED('dim_product'[product_name]),
        [Total Sales],
        ,
        DESC,
        DENSE
    ),
    BLANK()
)
```

### Product Rank by Profit
```dax
Product Profit Rank = 
IF(
    ISINSCOPE('dim_product'[product_name]),
    RANKX(
        ALLSELECTED('dim_product'[product_name]),
        [Total Profit],
        ,
        DESC,
        DENSE
    ),
    BLANK()
)
```

### Profit Status Indicator (KPI Flag)
```dax
Profit Status Color = 
SWITCH(
    TRUE(),
    [Profit Margin %] >= 0.15, "#10B981",  -- Emerald Green (Strong Margin)
    [Profit Margin %] >= 0.00, "#F59E0B",  -- Amber Warning (Low Margin)
    "#EF4444"                              -- Crimson Red (Loss Leader / Bleeding Margin)
)
```
