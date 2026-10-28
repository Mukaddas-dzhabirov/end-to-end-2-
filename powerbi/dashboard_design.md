# Power BI Interactive Dashboard Design Specification

## Executive Dashboard Canvas & Theme System

* **Resolution**: Standard 16:9 Widescreen (`1280 x 720` or `1920 x 1080` px)
* **Background Color**: `#F8FAFC` (Slate 50 Canvas)
* **Card & Container Fill**: `#FFFFFF` (Pure White) with 1px border `#E2E8F0` and 4px subtle drop shadow
* **Typography**:
  - Headers / Titles: `Segoe UI Semibold`, `14pt - 18pt`, Color `#0F172A`
  - KPI Callout Values: `DIN` or `Segoe UI Bold`, `24pt - 28pt`, Color `#0F172A`
  - Axis Labels & Captions: `Segoe UI`, `9pt - 10pt`, Color `#64748B`
* **Color Palette Tokens**:
  - Primary Revenue Accent: `#2563EB` (Royal Blue)
  - Positive Profit Accent: `#10B981` (Emerald Green)
  - Negative Profit / Risk Accent: `#EF4444` (Crimson Red)
  - Warning / Moderate Margin: `#F59E0B` (Amber)
  - Neutral / Benchmarks: `#94A3B8` (Slate Gray)

---

## Global Filter / Slicer Panel (Persistent Top or Left Rail)

Positioned at `X: 0, Y: 0, Width: 1920, Height: 70` (Top Ribbon Bar) across all 3 pages:
1. **Date Range Slicer**: `dim_date[date]` (Slider / Between selector)
2. **Region Slicer**: `dim_geography[region]` (Tile or Dropdown: West, East, Central, South)
3. **Category Slicer**: `dim_product[category]` (Dropdown: Furniture, Office Supplies, Technology)
4. **Customer Segment Slicer**: `dim_customer[segment]` (Dropdown: Consumer, Corporate, Home Office)
5. **Ship Mode Slicer**: `fact_sales[ship_mode]` (Dropdown: Standard Class, Second Class, First Class, Same Day)
6. **Reset Filters Button**: Power BI Bookmark resetting all slicers.

---

## Page 1: Executive Overview (`executive_overview`)

**Purpose**: High-level C-Suite situational awareness on top-line revenue, bottom-line profitability, order volume, and macro divisional distribution.

```
+---------------------------------------------------------------------------------------------------+
|  [SLICER BAR: Date Range | Region | Category | Segment | Ship Mode | Clear Filters]               |
+---------------------------------------------------------------------------------------------------+
| [KPI 1]              | [KPI 2]              | [KPI 3]              | [KPI 4]                      |
| Total Sales          | Total Profit         | Distinct Orders      | Profit Margin %              |
| $2,297,200.65        | $286,396.54          | 5,009                | 12.47%                       |
| YoY: +20.3%          | YoY: +14.2%          | AOV: $458.61         | Benchmark Target: 15.0%      |
+----------------------+----------------------+----------------------+------------------------------+
| [VISUAL 1: Line Chart]                                             | [VISUAL 2: Donut Chart]      |
| Monthly Sales & Profit Revenue Trajectory (2014 - 2017)            | Sales by Category            |
| X: dim_date[year_month]                                            | Legend: dim_product[category]|
| Y1 (Bar): [Total Sales] ($2.30M total)                             | Values: [Total Sales]        |
| Y2 (Line): [Total Profit]                                          | Technology: 36.4% ($836K)    |
| Tooltip: MoM Growth %, Margin %                                    | Furniture: 32.3% ($742K)     |
|                                                                    | Office Supplies: 31.3% ($719K|
+--------------------------------------------------------------------+------------------------------+
| [VISUAL 3: Clustered Column Chart]                                 | [VISUAL 4: Matrix Grid]      |
| Regional Performance: Sales vs. Net Profit                         | Divisional Margin Summary    |
| Category: dim_geography[region] (West, East, Central, South)       | Rows: Region                 |
| Value 1: [Total Sales] | Value 2: [Total Profit]                   | Cols: Category               |
| Conditional Formatting: Red highlight on Central Region            | Values: [Sales], [Profit],   |
| (Central has 24.0% avg discount and low 7.9% profit margin)        | [Margin %] with data bars    |
+--------------------------------------------------------------------+------------------------------+
```

### Visual Configuration Steps:
1. **KPI Cards (New Card Visual)**:
   - Add 4 Cards side-by-side (`Width: 280, Height: 120`).
   - Card 1: `[Total Sales]`, sub-label `[Sales YoY Growth %]`.
   - Card 2: `[Total Profit]`, sub-label `[Profit YoY Growth %]`.
   - Card 3: `[Total Orders]`, sub-label `[Average Order Value]`.
   - Card 4: `[Profit Margin %]`, conditional formatting font color `#10B981` if `>= 12%`, `#EF4444` if `< 10%`.
2. **Monthly Trajectory Chart**:
   - Visual: **Line and Clustered Column Chart**.
   - Shared Axis: `dim_date[year_month]`.
   - Column values: `[Total Sales]` (`#2563EB`).
   - Line values: `[Total Profit]` (`#10B981`).
3. **Category Donut**:
   - Visual: **Donut Chart**.
   - Legend: `dim_product[category]`.
   - Values: `[Total Sales]`.
   - Data labels: Category name + Percent of total.
4. **Regional Column**:
   - Visual: **Clustered Bar Chart**.
   - Y-Axis: `dim_geography[region]`.
   - X-Axis: `[Total Sales]`, `[Total Profit]`.

---

## Page 2: Product & Regional Performance (`product_regional`)

**Purpose**: Granular operational diagnosis identifying top commercial revenue drivers, geographic hotspots, and unprofitable product leakage.

```
+---------------------------------------------------------------------------------------------------+
|  [SLICER BAR: Date Range | Region | Category | Segment | Ship Mode]                               |
+---------------------------------------------------------------------------------------------------+
| [VISUAL 1: Treemap]                                | [VISUAL 2: Scatter Plot - Discount Drag]    |
| Sales & Profit Margin by Sub-Category (17 Sectors) | Price Discount % vs. Profit Margin %         |
| Group: category > Details: sub_category            | X-Axis: [Average Discount %]                 |
| Values: [Total Sales]                              | Y-Axis: [Profit Margin %]                    |
| Saturation: [Profit Margin %] (Diverging Red-Green)| Size: [Total Sales]                          |
| *Notice: Tables (-$17.7K) & Bookcases (-$3.5K)     | Details: dim_product[sub_category]           |
| appear deep red despite high sales volume!         | *Clear downward slope: discounts > 20% cliff!|
+----------------------------------------------------+----------------------------------------------+
| [VISUAL 3: Horizontal Ranked Bar Chart]            | [VISUAL 4: Filled Map / Shape Map]          |
| Top 10 Profitable Products vs. Bottom 10 Losses    | US State Profitability & Revenue Map         |
| Axis: dim_product[product_name]                    | Location: dim_geography[state]               |
| Filter: Top 10 by [Total Profit] / Bottom 10 Losses| Color Saturation: [Total Profit]             |
| Loss Leader Callout:                               | Green: California ($76.4K), New York ($74.0K)|
| - Cubify CubeX 3D Printer (Net Loss: -$8,879.97)   | Red: Texas (-$25.7K), Ohio (-$17.0K),        |
| - Lexmark Laser Printer (Net Loss: -$4,589.97)     | Pennsylvania (-$15.6K), Illinois (-$12.6K)   |
+----------------------------------------------------+----------------------------------------------+
```

### Visual Configuration Steps:
1. **Sub-Category Treemap**:
   - Visual: **Treemap**.
   - Category: `dim_product[category]`, Details: `dim_product[sub_category]`.
   - Values: `[Total Sales]`.
   - Colors: Advanced conditional formatting on `[Profit Margin %]`: Minimum (-15%) `#EF4444`, Center (0%) `#F8FAFC`, Maximum (+30%) `#10B981`.
2. **Discount Elasticity Scatter Plot**:
   - Visual: **Scatter Chart**.
   - Details: `dim_product[sub_category]`.
   - X Axis: `[Average Discount %]`.
   - Y Axis: `[Profit Margin %]`.
   - Size: `[Total Sales]`.
   - Add reference line at Y = 0 (Break-even line).
3. **State Geographic Fill Map**:
   - Visual: **Shape Map** or **Filled Map**.
   - Location: `dim_geography[state]`.
   - Color Saturation: `[Total Profit]`. Diverging 3-color gradient.
4. **Bottom 10 Loss Leader Table**:
   - Visual: **Table / Matrix**.
   - Fields: `product_name`, `category`, `sub_category`, `[Total Sales]`, `[Total Profit]`, `[Average Discount %]`.
   - Top N Filter: Bottom 10 by `[Total Profit]`.

---

## Page 3: Customer Analytics & Segmentation (`customer_analytics`)

**Purpose**: Customer Lifetime Value, segmentation dynamics, repeat order frequency, and account concentration.

```
+---------------------------------------------------------------------------------------------------+
|  [SLICER BAR: Date Range | Region | Category | Segment | Ship Mode]                               |
+---------------------------------------------------------------------------------------------------+
| [KPI 1]              | [KPI 2]              | [KPI 3]              | [KPI 4]                      |
| Total Customers      | Repeat Buyer Rate    | Revenue / Customer   | Profitable Accounts %        |
| 793 Accounts         | 98.1% (778 accounts) | $2,896.85            | 84.6% (671 accounts)         |
+----------------------+----------------------+----------------------+------------------------------+
| [VISUAL 1: 100% Stacked Bar Chart]                 | [VISUAL 2: Clustered Column Chart]          |
| Customer Segment Contribution Breakdown            | Purchase Frequency Tier Breakdown            |
| Segments: Consumer (50.6%), Corporate (30.7%),     | Cohorts: 1 Order, 2-4 Orders, 5-9 Orders,    |
| Home Office (18.7%)                                | 10+ Orders                                   |
| Margin: Home Office leads with 14.0% margin!       | Metric: Customer Count & Aggregate Sales     |
+----------------------------------------------------+----------------------------------------------+
| [VISUAL 3: Top 10 High-Value Accounts Table]                                                      |
| Customer Name     | Segment     | Orders | Total Spend | Total Profit | Margin % | Loyalty Tier   |
| Sean Miller       | Home Office | 5      | $25,043.05  | -$1,980.74   | -7.9%    | *High Loss!    |
| Tamara Chand      | Corporate   | 5      | $19,052.22  | $8,981.32    | 47.1%    | Star Account   |
| Raymond Buch      | Consumer    | 6      | $15,117.34  | $6,976.18    | 46.1%    | Star Account   |
| Tom Ashbrook      | Home Office | 6      | $14,595.62  | $4,703.79    | 32.2%    | Star Account   |
| Adrian Barton     | Consumer    | 10     | $14,473.57  | $5,444.81    | 37.6%    | Power Buyer    |
+---------------------------------------------------------------------------------------------------+
```

### Visual Configuration Steps:
1. **Customer KPI Cards**:
   - Distinct Customers: `DISTINCTCOUNT(fact_sales[customer_id])` -> 793.
   - Revenue per Customer: `DIVIDE([Total Sales], DISTINCTCOUNT(fact_sales[customer_id]))` -> $2,896.85.
2. **Order Frequency Tier Visual**:
   - Visual: **Clustered Column Chart**.
   - X Axis: Loyalty Tier (One-time, Developing, Loyal, Power Buyer).
   - Y Axis: Customer Count & `[Total Sales]`.
3. **Top Customer Drill-Down Table**:
   - Visual: **Table**.
   - Columns: `customer_name`, `segment`, `[Total Orders]`, `[Total Sales]`, `[Total Profit]`, `[Profit Margin %]`.
   - Sort descending by `[Total Sales]`.
   - Conditional color on `[Total Profit]`: Red for negative, Green for positive.
