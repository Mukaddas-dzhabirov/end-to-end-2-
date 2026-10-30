# End-to-End Sales & Business Performance Analytics
### Transforming Retail Sales Data into Actionable Business Insights Using SQL, Python, and Power BI

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Tests: Pytest Passing](https://img.shields.io/badge/Tests-11%20Passed-emerald.svg)](./tests/)
[![SQL: PostgreSQL & SQLite](https://img.shields.io/badge/SQL-PostgreSQL%20%7C%20SQLite-orange.svg)](./sql/)
[![BI: Power BI Desktop](https://img.shields.io/badge/Power%20BI-Star%20Schema%20%2B%20DAX-gold.svg)](./powerbi/)

---

## 1. Project Overview

This repository houses a complete, professional, portfolio-grade Data Analytics & Business Intelligence solution developed on the commercial **Sample Superstore** transactional dataset (9,994 retail sales transactions across the United States).

The project simulates an enterprise-level analytics initiative designed to evaluate multi-year commercial performance, diagnose severe operating margin leakage across product categories and sales territories, evaluate price discount elasticity, and deliver an actionable governance roadmap for executive decision-makers.

### Primary Skills Demonstrated:
* **Exploratory Data Analysis (EDA) & Python Engineering**: Automated data validation pipelines, missing value and duplicate auditing, datetime sequence verification, and statistical distributions.
* **Production-Grade SQL Analytics**: Window functions (`LAG`, `DENSE_RANK`, `ROW_NUMBER`, `NTILE`), Common Table Expressions (CTEs), multi-table Star Schema joins, running totals, and conditional aggregations.
* **Business Intelligence & Data Modeling**: Ralph Kimball Star Schema architecture (`FactSales` and 4 conforming dimensions), relationship cardinality optimization, and calendar table generation.
* **DAX Measure Engineering**: 20+ audited DAX measures covering Core KPIs, time intelligence (YoY, YTD, MoM), and ranking analytics.
* **Executive Business Reporting & Stakeholder Presentation**: Diagnostic root-cause analysis distinguishing direct empirical findings from operational hypotheses and future data collection requirements.

---

## 2. Business Problem & Strategic Objectives

A multi-regional US retailer recorded **$2,297,200.65 in gross revenue** across 5,009 unique customer orders between 2014 and 2017. While top-line revenue expanded significantly (+29.5% in 2016 and +20.4% in 2017), executive leadership observed alarming margin compression:
1. **Operating Margin Variance**: Overall operating margin stood at **12.47% ($286,396.54 profit)**, well below the corporate benchmark of 15.0%.
2. **Category Profit Imbalance**: **Technology (17.40% margin)** and **Office Supplies (17.04% margin)** generated over 93% of company profits, while **Furniture produced only 2.49% profit margin** ($18,451.10 profit on $741,999.73 sales).
3. **Uncontrolled Promotional Discounting**: Sales representatives utilized aggressive discounting to hit revenue quotas, inadvertently converting high-ticket equipment into substantial cash-flow losses.
4. **Regional Profit Disparities**: While the West Region yielded a 14.94% profit margin, the Central Region generated only 7.92% margin, suffering massive losses across Texas (-$25.7K) and Ohio (-$17.0K).

### Core Analytics Objectives:
* Build an automated, reproducible Python data cleaning and validation pipeline.
* Structure and deploy a relational Star Schema warehouse in PostgreSQL and SQLite.
* Write production-style SQL queries answering vital commercial questions.
* Formulate 20+ DAX measures with exact mathematical formulas.
* Design an interactive, 3-page Power BI dashboard specification.
* Formulate data-driven strategic recommendations to recover estimated annual margin leakage.

---

## 3. Technology Stack

* **Data Engineering & Scripting**: Python 3.10+ (Standard Library, `urllib`, `sqlite3`, `json`, `logging`)
* **Data Manipulation & Analysis**: `pandas` (>= 2.0.0), `numpy` (>= 1.24.0)
* **Statistical Visualization & EDA**: `matplotlib` (>= 3.7.0), `seaborn` (>= 0.12.0), `jupyter`
* **Automated Quality Assurance**: `pytest` (>= 7.3.0)
* **Database & Analytical Query Engines**: SQL (ANSI, PostgreSQL-compatible, and local SQLite 3)
* **Business Intelligence & Reporting**: Microsoft Power BI Desktop, DAX (Data Analysis Expressions)
* **Version Control & Documentation**: Git, GitHub Markdown, VS Code

---

## 4. Repository Structure

```
end-to-end-sales-business-analytics/
│
├── README.md                              # Main portfolio documentation & reproduction guide
├── requirements.txt                       # Core Python analytical dependencies
├── .gitignore                             # Git ignore rules for Python, Node, and cache files
├── LICENSE                                # MIT Open Source License
│
├── data/
│   ├── README.md                          # Data architecture and lifecycle documentation
│   ├── raw/
│   │   ├── README.md                      # Source specifications & acquisition guide
│   │   └── sample_superstore.csv          # Canonical raw transactional dataset (9,994 rows)
│   └── processed/
│       ├── README.md                      # Transformation audit log & dictionary
│       ├── superstore_cleaned.csv         # Cleaned, standardized, feature-engineered CSV
│       ├── superstore.db                  # Local SQLite relational database with indexes
│       ├── data_quality_report.json       # Automated data quality audit metrics
│       ├── kpi_summary.json               # Computed executive KPIs & segment metrics
│       └── star_schema/                   # Exported dimensional CSV files for BI
│           ├── fact_sales.csv             # 9,994 sales fact records
│           ├── dim_customer.csv           # 793 unique customer accounts
│           ├── dim_product.csv            # 1,862 distinct products
│           ├── dim_geography.csv          # 632 unique geographic delivery zones
│           └── dim_date.csv               # 1,464 calendar dates with quarter/month hierarchy
│
├── sql/
│   ├── 01_create_tables.sql               # DDL for staging tables & Star Schema dimensions
│   ├── 02_data_quality_checks.sql         # SQL validation test suite for nulls and anomalies
│   ├── 03_sales_performance.sql           # Headline KPIs, YoY annual growth, and running totals
│   ├── 04_product_analysis.sql            # Category margins, sub-categories, top SKUs, loss leaders
│   ├── 05_customer_analysis.sql           # Segment performance, RFM frequency tiers, top clients
│   ├── 06_regional_analysis.sql           # Regional breakdown, state gainers/losers, city analysis
│   └── 07_advanced_analysis.sql           # CTEs, discount cliff brackets, NTILE deciles, joins
│
├── python/
│   ├── 01_data_cleaning.py                # Reusable ETL pipeline & automated data quality audit
│   ├── 02_exploratory_data_analysis.ipynb # 20-section Jupyter Notebook with Seaborn visualizations
│   ├── 03_kpi_calculation.py              # Math-verified business KPI engine
│   └── 04_export_processed_data.py        # Star Schema table generation & SQLite builder
│
├── powerbi/
│   ├── README.md                          # Power BI architecture & implementation guide
│   ├── data_model.md                      # Star Schema relationships, cardinalities, keys
│   ├── dax_measures.md                    # 20+ tested DAX formulas (Core, Time-Intel, Ranks)
│   └── dashboard_design.md                # 3-page layout wireframes, color tokens, visual specs
│
├── reports/
│   ├── executive_summary.md               # C-Suite executive briefing & high-level financial metrics
│   ├── business_insights.md               # 5-stage diagnostic findings (Result, Cause, Action)
│   ├── recommendations.md                 # 3-tiered action framework (Evidence vs. Hypotheses)
│   └── linkedin_project_description.md    # Portfolio summary formatted for LinkedIn Projects
│
├── screenshots/
│   └── README.md                          # Visual asset guidelines & screenshot placeholders
│
└── tests/
    ├── test_data_cleaning.py              # Pytest suite for column cleaning, parsing, validations
    └── test_kpi_calculations.py          # Pytest suite for KPI math, AOV, margins, zero-division
```

---

## 5. Analytical Workflow & Methodology

```
+---------------------------------------------------------------------------------------+
| 1. DATA ACQUISITION & AUDIT                                                           |
| Canonical 9,994-row Sample Superstore dataset acquired with encoding safeguards.      |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| 2. AUTOMATED PYTHON ETL PIPELINE (python/01_data_cleaning.py)                         |
| - Header standardization to snake_case                                                |
| - ISO date parsing & chronological validation (ship_date >= order_date)               |
| - Numeric type casting and boundary checks (discounts in [0, 1], quantity >= 1)        |
| - Feature engineering: shipping_days, profit_margin, order_year_month, is_profitable  |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| 3. STAR SCHEMA RELATIONAL MODELING (python/04_export_processed_data.py)               |
| Decomposes flat records into FactSales, DimCustomer, DimProduct, DimGeography, DimDate|
| Generates local indexed SQLite database (superstore.db) for instant querying.         |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| 4. ADVANCED SQL ANALYTICS (sql/01 - 07)                                               |
| CTEs, Window functions (LAG, DENSE_RANK, NTILE), Star Schema joins, running totals    |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| 5. POWER BI MODELING & DAX MEASURE ENGINEERING                                        |
| Star schema 1:* relationships, Date Table designation, 20+ DAX formulas               |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
| 6. EXECUTIVE REPORTING & RECOMMENDATIONS (reports/)                                   |
| Evidence-backed insights, 20% discount cliff analysis, and strategic governance.      |
+---------------------------------------------------------------------------------------+
```

---

## 6. Executive Key Performance Indicators (Computed)

All values below were mathematically computed from the authentic 9,994-record dataset:

| KPI Metric | Exact Calculated Value | Formula / Method | Business Context |
|---|---|---|---|
| **Total Gross Sales** | **$2,297,200.65** | `SUM(sales)` | Total top-line transaction volume |
| **Total Net Profit** | **$286,396.54** | `SUM(profit)` | Net operating profit |
| **Operating Profit Margin** | **12.47%** | `Total Profit / Total Sales` | Corporate target benchmark: 15.0% |
| **Unique Customer Orders** | **5,009** | `DISTINCTCOUNT(order_id)` | Deduplicated distinct order count |
| **Total Products Delivered** | **37,873** | `SUM(quantity)` | Physical units shipped |
| **Average Order Value (AOV)**| **$458.61** | `Total Sales / Total Orders` | Mean revenue per checkout order |
| **Average Discount Rate** | **15.62%** | `AVG(discount)` | Mean promotional discount applied |
| **Average Fulfillment Time** | **4.0 Days** | `AVG(ship_date - order_date)` | Mean delivery velocity |
| **Profitable Order Rate** | **79.26%** | `Profitable Orders / Orders` | 3,970 of 5,009 orders were profitable |

---

## 7. Major Business Insights & Empirical Findings

### Finding 1: The Furniture Margin Crisis (Tables & Bookcases)
* **Data Result**: Technology delivered **$836,154.02 in sales** at a strong **17.40% margin** ($145,455.44 profit). Office Supplies produced **$719,046.90** at a **17.04% margin** ($122,490.00 profit). In contrast, **Furniture delivered $741,999.73 (32.3% of revenue)** but generated only **$18,451.10 in profit (2.49% margin)**.
* **Root Cause**: The **Tables** sub-category incurred an aggregate net operating loss of **-$17,725.57** (-8.56% margin, avg discount: 26.13%), and **Bookcases** lost **-$3,472.59** (-3.02% margin).
* **Strategic Action**: Restructure furniture pricing by reducing maximum allowable discounts from 40% to 15% and bundling tables with high-margin office products.

### Finding 2: The Commercial Discount "Profit Cliff" at 20%
* **Data Result**:
  - **0% - 10% Discount**: Generated **+$345,183** in profit at margins exceeding 20% - 30% (95% - 100% profitable transaction rate).
  - **11% - 20% Discount**: Generated **+$102,572** in profit at 10.92% margin.
  - **> 20% Discount**: Transactions plummeted into severe negative margins, producing **-$161,359 in cumulative net losses**.
  - **> 30% Discount**: All 712 transactions were loss-makers (**0.0% profitable transaction rate**), producing a net loss of -$146,797 on $78,258 in sales.
* **Strategic Action**: Institute an automated hard cap in the ERP/CRM system preventing discounts over 20% without VP-level authorization.

### Finding 3: Central Region Discount Drag & Underperforming States
* **Data Result**: The Central Region produced an operating margin of only **7.92% ($39,706 profit on $501,240 sales)** compared to **14.94% in the West ($108,418 profit on $725,458 sales)**. Central's average discount rate was **24.04%**, compared to only **10.93% in the West**.
* **Loss Concentration**: Four states destroyed **$70,868 in profit**:
  - **Texas**: -$25,729.39 net loss
  - **Ohio**: -$16,971.37 net loss
  - **Pennsylvania**: -$15,559.96 net loss
  - **Illinois**: -$12,607.89 net loss
* **Strategic Action**: Standardize regional pricing guidelines and tie sales commission structures to gross margin rather than gross sales volume.

### Finding 4: High-Ticket "Profit Drainer" SKUs
* **Data Result**: Three specific printer/machine products generated $35,930 in revenue but wiped out **-$17,310 in company profits**:
  - *Cubify CubeX 3D Printer Double Head*: -$8,879.97 loss (-80.0% margin; 53.3% avg discount).
  - *Lexmark MX611dhe Laser Printer*: -$4,589.97 loss (-27.3% margin; 40.0% avg discount).
  - *Cubify CubeX 3D Printer Triple Head*: -$3,839.99 loss (-48.0% margin; 50.0% avg discount).
* **Strategic Action**: Eliminate promotional discounts entirely on high-cost hardware SKUs.

---

## 8. Power BI Interactive Dashboard Architecture

The dashboard design is structured into three dedicated analytical views:

```
+-----------------------------------------------------------------------------------+
| PAGE 1: EXECUTIVE OVERVIEW                                                        |
| - 4 High-level KPI Cards: Total Sales, Total Profit, Unique Orders, Profit Margin |
| - Monthly Revenue & Net Profit Trajectory (Line & Column Combo)                   |
| - Category Sales & Margin Donut Visual                                            |
| - Regional Performance Matrix & Slicers (Date, Region, Category, Segment)         |
+-----------------------------------------------------------------------------------+
| PAGE 2: PRODUCT & REGIONAL DEEP DIVE                                              |
| - Sub-Category Performance Treemap (Color saturated by Profit Margin %)          |
| - Discount Elasticity Scatter Plot (Average Discount vs. Profit Margin %)         |
| - State Geographic Map (Color gradient: Green for profit, Red for losses)         |
| - Top 10 High-Loss Product Table (Immediate remediation list)                     |
+-----------------------------------------------------------------------------------+
| PAGE 3: CUSTOMER ANALYTICS & SEGMENTATION                                         |
| - Customer Segment Comparison (Consumer, Corporate, Home Office)                  |
| - Purchase Frequency Cohorts (1x, 2-4x, 5-9x, 10+ Orders)                         |
| - Top 10 Accounts Matrix (Sales, Profit, Margin %, Loyalty Tier)                  |
+-----------------------------------------------------------------------------------+
```

Detailed DAX measures and layout specs are available in:
* [`powerbi/data_model.md`](./powerbi/data_model.md)
* [`powerbi/dax_measures.md`](./powerbi/dax_measures.md)
* [`powerbi/dashboard_design.md`](./powerbi/dashboard_design.md)

---

## 9. How to Reproduce this Project (Step-by-Step)

### Prerequisites
* Python 3.10 or higher
* Git
* Microsoft Power BI Desktop (for .pbix authoring on Windows)

### Windows Command Line / PowerShell Instructions

```powershell
# 1. Clone the repository
git clone https://github.com/<your-username>/end-to-end-sales-business-analytics.git
cd end-to-end-sales-business-analytics

# 2. Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate

# 3. Install required Python libraries
pip install -r requirements.txt

# 4. Execute the automated Data Cleaning & Preprocessing pipeline
# (Downloads the canonical dataset if missing, validates data, and exports processed data)
python python\01_data_cleaning.py

# 5. Run the Business KPI Engine
python python\03_kpi_calculation.py

# 6. Export Star Schema tables & build local SQLite database
python python\04_export_processed_data.py

# 7. Run the Automated Unit Test Suite
pytest tests\ -v
```

### Mac / Linux Terminal Instructions

```bash
# 1. Clone and navigate
git clone https://github.com/<your-username>/end-to-end-sales-business-analytics.git
cd end-to-end-sales-business-analytics

# 2. Virtual environment setup
python3 -m venv .venv
source .venv/bin/activate

# 3. Dependency installation
pip install -r requirements.txt

# 4. Run pipeline
python3 python/01_data_cleaning.py
python3 python/03_kpi_calculation.py
python3 python/04_export_processed_data.py

# 5. Run automated tests
pytest tests/ -v
```

### Power BI Desktop Reproduction
1. Open **Power BI Desktop**.
2. Click **Get Data** > **CSV** > Navigate to `data/processed/star_schema/` and import `fact_sales.csv`, `dim_customer.csv`, `dim_product.csv`, `dim_geography.csv`, and `dim_date.csv`.
3. Set relationships in Model View as defined in [`powerbi/data_model.md`](./powerbi/data_model.md).
4. Right-click `dim_date` > **Mark as date table** > Select `date`.
5. Create a dedicated measure table `_Measures` and copy DAX formulas from [`powerbi/dax_measures.md`](./powerbi/dax_measures.md).
6. Build canvas pages following visual grids in [`powerbi/dashboard_design.md`](./powerbi/dashboard_design.md).

---

## 10. Automated Testing & Verification

The project includes unit tests in `tests/` utilizing small synthetic fixtures independent of live data downloads:

```bash
python3 -m pytest tests/ -v
```

### Test Suite Coverage:
* `test_standardize_columns`: Validates proper snake_case transformation across headers.
* `test_parse_dates`: Enforces ISO datetime parsing and date consistency.
* `test_cast_numeric_types`: Verifies numerical bounds and postal code zero-padding.
* `test_validate_data_quality_clean_data`: Verifies audit pass criteria on clean records.
* `test_validate_data_quality_invalid_records`: Confirms flagging of anomalous dates and discounts.
* `test_feature_engineering`: Validates `shipping_days` elapsed time and `profit_margin`.
* `test_core_kpi_math`: Validates distinct order counting (5,009 orders vs 9,994 rows) and sum calculations.
* `test_empty_dataset_edge_case`: Validates safe zero-division handling on null frames.
* `test_zero_sales_division_handling`: Protects against `ZeroDivisionError` in margin calculations.
* `test_category_breakdown` & `test_regional_breakdown`: Verifies grouping integrity.

**Result**: 11 passed in 0.57s (100% pass rate).

---

## 11. Project Limitations & Future Scope

### Analytical Limitations
* **Freight and Dimensional Weight**: The dataset does not provide item shipping weight or parcel dimensions. The severe losses in Furniture are likely exacerbated by high carrier freight tariffs that are not broken out as separate line items.
* **Customer Acquisition Cost (CAC)**: Marketing channel spend is unrecorded, precluding complete CAC vs. LTV ratio analysis.
* **Returns & Damaged Goods**: Product return authorizations and warranty claim rates are absent.

### Planned Enhancements
* Machine Learning predictive model (Random Forest / XGBoost) to forecast the probability of order cancellation or unprofitability based on discount rate and cart composition.
* Live PostgreSQL database containerization using Docker Compose.
* CI/CD GitHub Action workflow automating `pytest` on every commit.

---

## 12. Author & Contact

* **Lead Analyst**: *[Your Name]*  
* **Role**: Senior Data Analyst / Analytics Engineer  
* **LinkedIn**: *[Your LinkedIn Profile URL]*  
* **Portfolio**: *[Your GitHub Profile URL]*  
* **Email**: *[Your Professional Email Address]*

---

## 13. License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
