# Data Directory Architecture

This directory houses the raw source data, transformed analytical data, and schemas used throughout the **End-to-End Sales & Business Performance Analytics** project.

## Directory Structure

```
data/
├── raw/
│   ├── README.md                  # Acquisition instructions & data dictionary
│   └── sample_superstore.csv      # Original raw transactional dataset (9,994 records)
├── processed/
│   ├── README.md                  # Cleaning log & transformation documentation
│   ├── superstore_cleaned.csv     # Cleaned, validated, and normalized dataset
│   └── data_quality_report.json   # Machine-readable validation audit metrics
└── README.md
```

## Data Lifecycle

1. **Acquisition**: The original raw transactions are placed in `data/raw/sample_superstore.csv`.
2. **Validation & Cleaning**: `python/01_data_cleaning.py` executes data quality rules, checks date consistency, validates numerical values, logs audit metrics, and writes to `data/processed/superstore_cleaned.csv`.
3. **Database Staging**: SQL scripts load `superstore_cleaned.csv` into analytical tables in PostgreSQL or SQLite.
4. **BI Ingestion**: Power BI loads the processed data file into a Star Schema (`FactSales` and supporting dimensions).
