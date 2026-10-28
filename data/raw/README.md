# Raw Data: Sample Superstore Dataset

This folder contains the untouched, original retail transactions from the standard **Sample Superstore** dataset.

## Dataset Specifications

- **Domain**: Retail Office Supplies, Furniture, and Technology e-commerce & B2B orders.
- **Records**: 9,994 transactional rows.
- **Columns**: 21 fields.
- **Timeframe**: Multi-year retail order history across the United States.

## Column Dictionary

| Column Name | Data Type (Source) | Description |
|---|---|---|
| `Row ID` | Integer | Row identifier index |
| `Order ID` | String | Unique order number (e.g., CA-2016-152156) |
| `Order Date` | String / Date | Date order placed (e.g., 11/8/2016 or 2016-11-08) |
| `Ship Date` | String / Date | Date shipment dispatched |
| `Ship Mode` | String | Shipping tier: Standard Class, Second Class, First Class, Same Day |
| `Customer ID` | String | Unique customer identifier (e.g., CG-12520) |
| `Customer Name` | String | Full customer name |
| `Segment` | String | Consumer, Corporate, or Home Office |
| `Country` | String | Country (United States) |
| `City` | String | City of delivery |
| `State` | String | US State of delivery |
| `Postal Code` | String / Numeric | 5-digit ZIP code |
| `Region` | String | Geographic sales territory: West, East, Central, South |
| `Product ID` | String | Unique product identifier (e.g., FUR-BO-10001798) |
| `Category` | String | Top-level category: Furniture, Office Supplies, Technology |
| `Sub-Category` | String | 17 sub-categories (e.g., Bookcases, Chairs, Phones, Binders) |
| `Product Name` | String | Detailed product title |
| `Sales` | Float | Gross transaction amount in USD |
| `Quantity` | Integer | Units ordered |
| `Discount` | Float | Promotional discount applied (0.0 to 0.8) |
| `Profit` | Float | Net operating margin / financial profit in USD (can be negative) |

## Acquisition Sources

1. **Direct Download**:
   Download the standard dataset from Kaggle:
   [Kaggle Superstore Dataset](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final)
   Save as `sample_superstore.csv` inside this folder (`data/raw/`).

2. **Automated Fetch via Python**:
   Run the acquisition script:
   ```bash
   python python/01_data_cleaning.py --download
   ```
   Or using curl:
   ```bash
   curl -L "https://raw.githubusercontent.com/leonism/sample-superstore/master/data/superstore.csv" -o data/raw/sample_superstore.csv
   ```
