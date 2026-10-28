#!/usr/bin/env python3
"""
End-to-End Sales & Business Performance Analytics
Module: Data Cleaning, Validation, and Preprocessing Pipeline
File: python/01_data_cleaning.py

Description:
    Production-grade ETL script to load raw retail sales data, validate data types,
    enforce consistency constraints, handle anomalies, compute derived features,
    and generate an audited, reproducible processed dataset.
"""

import os
import sys
import json
import logging
from typing import Dict, Any, Tuple
import urllib.request
import pandas as pd
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("DataCleaningPipeline")

DEFAULT_RAW_URL = (
    "https://huggingface.co/s-a-n-08/superstoredataset1/resolve/main/Sample%20-%20Superstore.csv"
)

# Standard schema mapping from raw titles to snake_case names
COLUMN_MAPPING = {
    "Row ID": "row_id",
    "Order ID": "order_id",
    "Order Date": "order_date",
    "Ship Date": "ship_date",
    "Ship Mode": "ship_mode",
    "Customer ID": "customer_id",
    "Customer Name": "customer_name",
    "Segment": "segment",
    "Country": "country",
    "City": "city",
    "State": "state",
    "Postal Code": "postal_code",
    "Region": "region",
    "Product ID": "product_id",
    "Category": "category",
    "Sub-Category": "sub_category",
    "Product Name": "product_name",
    "Sales": "sales",
    "Quantity": "quantity",
    "Discount": "discount",
    "Profit": "profit",
}


def download_raw_data_if_missing(raw_path: str, url: str = DEFAULT_RAW_URL) -> None:
    """Download the raw Superstore dataset if it does not already exist."""
    if not os.path.exists(raw_path):
        os.makedirs(os.path.dirname(raw_path), exist_ok=True)
        logger.info("Raw dataset not found at %s. Downloading from %s...", raw_path, url)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as response, open(raw_path, "wb") as out_file:
                out_file.write(response.read())
            logger.info("Dataset downloaded successfully to %s", raw_path)
        except Exception as e:
            logger.error("Failed to download dataset: %s", e)
            raise


def load_raw_data(file_path: str) -> pd.DataFrame:
    """Load raw transactions from CSV file with standard encoding handling."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Input file not found at {file_path}")

    logger.info("Loading raw dataset from %s", file_path)
    df = None
    for enc in ["utf-8", "latin1", "cp1252", "iso-8859-1"]:
        try:
            df = pd.read_csv(file_path, encoding=enc)
            logger.info("Loaded successfully with %s encoding", enc)
            break
        except UnicodeDecodeError:
            continue

    if df is None:
        raise ValueError(f"Could not decode {file_path} with standard encodings.")

    logger.info("Loaded %d rows and %d columns", len(df), len(df.columns))
    return df


def standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize column names to snake_case format."""
    df_clean = df.copy()
    # Normalize exact matches first
    rename_dict = {}
    for col in df_clean.columns:
        if col in COLUMN_MAPPING:
            rename_dict[col] = COLUMN_MAPPING[col]
        else:
            # Fallback algorithmic snake_casing
            clean_name = (
                col.strip()
                .lower()
                .replace(" ", "_")
                .replace("-", "_")
                .replace("/", "_")
            )
            rename_dict[col] = clean_name

    df_clean = df_clean.rename(columns=rename_dict)
    return df_clean


def parse_dates(df: pd.DataFrame) -> pd.DataFrame:
    """Convert order_date and ship_date to standardized datetime format."""
    df_clean = df.copy()
    if "order_date" in df_clean.columns:
        df_clean["order_date"] = pd.to_datetime(
            df_clean["order_date"], errors="coerce"
        )
    if "ship_date" in df_clean.columns:
        df_clean["ship_date"] = pd.to_datetime(
            df_clean["ship_date"], errors="coerce"
        )
    return df_clean


def cast_numeric_types(df: pd.DataFrame) -> pd.DataFrame:
    """Convert sales, quantity, discount, and profit to appropriate numeric types."""
    df_clean = df.copy()
    if "sales" in df_clean.columns:
        df_clean["sales"] = pd.to_numeric(df_clean["sales"], errors="coerce").round(2)
    if "profit" in df_clean.columns:
        df_clean["profit"] = pd.to_numeric(df_clean["profit"], errors="coerce").round(2)
    if "discount" in df_clean.columns:
        df_clean["discount"] = pd.to_numeric(df_clean["discount"], errors="coerce").round(4)
    if "quantity" in df_clean.columns:
        df_clean["quantity"] = pd.to_numeric(
            df_clean["quantity"], errors="coerce"
        ).fillna(0).astype(int)

    # Clean postal_code as string to preserve leading zeros
    if "postal_code" in df_clean.columns:
        df_clean["postal_code"] = (
            df_clean["postal_code"]
            .fillna("")
            .astype(str)
            .str.replace(r"\.0$", "", regex=True)
            .str.zfill(5)
        )

    return df_clean


def validate_data_quality(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Perform comprehensive data quality audit:
    - Missing values count per column
    - Duplicate records
    - Date sequence integrity (ship_date >= order_date)
    - Value boundary validations
    - Key field completeness
    """
    total_records = len(df)
    missing_counts = df.isnull().sum().to_dict()
    # Convert numpy int to standard int for JSON serialization
    missing_counts = {k: int(v) for k, v in missing_counts.items()}

    duplicate_rows = int(df.duplicated().sum())

    # Date consistency check
    invalid_date_sequences = 0
    if "order_date" in df.columns and "ship_date" in df.columns:
        valid_dates_mask = df["order_date"].notnull() & df["ship_date"].notnull()
        invalid_dates_mask = valid_dates_mask & (df["ship_date"] < df["order_date"])
        invalid_date_sequences = int(invalid_dates_mask.sum())

    # Numeric boundary checks
    negative_sales_count = int((df["sales"] < 0).sum()) if "sales" in df.columns else 0
    invalid_discount_count = (
        int(((df["discount"] < 0) | (df["discount"] > 1.0)).sum())
        if "discount" in df.columns
        else 0
    )
    non_positive_qty_count = (
        int((df["quantity"] <= 0).sum()) if "quantity" in df.columns else 0
    )
    unprofitable_records = (
        int((df["profit"] < 0).sum()) if "profit" in df.columns else 0
    )

    # Key completeness
    missing_order_ids = (
        int(df["order_id"].isnull().sum()) if "order_id" in df.columns else 0
    )
    missing_customer_ids = (
        int(df["customer_id"].isnull().sum()) if "customer_id" in df.columns else 0
    )
    missing_product_ids = (
        int(df["product_id"].isnull().sum()) if "product_id" in df.columns else 0
    )

    report = {
        "total_records": total_records,
        "duplicate_rows": duplicate_rows,
        "missing_values": missing_counts,
        "date_consistency_errors": invalid_date_sequences,
        "negative_sales_errors": negative_sales_count,
        "invalid_discount_errors": invalid_discount_count,
        "non_positive_quantity_errors": non_positive_qty_count,
        "legitimate_negative_profit_records": unprofitable_records,
        "missing_key_identifiers": {
            "order_id": missing_order_ids,
            "customer_id": missing_customer_ids,
            "product_id": missing_product_ids,
        },
        "quality_status": "PASSED"
        if (
            invalid_date_sequences == 0
            and negative_sales_count == 0
            and invalid_discount_count == 0
            and non_positive_qty_count == 0
            and missing_order_ids == 0
        )
        else "FAILED_VALIDATION",
    }
    return report


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add analytical features for BI and modeling."""
    df_feat = df.copy()

    # Shipping duration in calendar days
    if "order_date" in df_feat.columns and "ship_date" in df_feat.columns:
        df_feat["shipping_days"] = (
            (df_feat["ship_date"] - df_feat["order_date"]).dt.days
        )

    # Date hierarchy
    if "order_date" in df_feat.columns:
        df_feat["order_year"] = df_feat["order_date"].dt.year
        df_feat["order_month"] = df_feat["order_date"].dt.month
        df_feat["order_year_month"] = df_feat["order_date"].dt.strftime("%Y-%m")
        df_feat["order_day_name"] = df_feat["order_date"].dt.day_name()
        df_feat["order_quarter"] = "Q" + df_feat["order_date"].dt.quarter.astype(str)

    # Profit Margin = Profit / Sales (safe division avoiding divide-by-zero)
    if "profit" in df_feat.columns and "sales" in df_feat.columns:
        df_feat["profit_margin"] = np.where(
            df_feat["sales"] != 0,
            (df_feat["profit"] / df_feat["sales"]).round(4),
            0.0,
        )
        df_feat["is_profitable"] = df_feat["profit"] > 0

    return df_feat


def run_pipeline(
    raw_path: str = "data/raw/sample_superstore.csv",
    output_path: str = "data/processed/superstore_cleaned.csv",
    report_path: str = "data/processed/data_quality_report.json",
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """Execute complete end-to-end data cleaning and validation pipeline."""
    logger.info("--- Starting Data Cleaning & Quality Pipeline ---")
    download_raw_data_if_missing(raw_path)

    df_raw = load_raw_data(raw_path)
    df_clean = standardize_columns(df_raw)
    df_clean = parse_dates(df_clean)
    df_clean = cast_numeric_types(df_clean)

    # Data Quality Validation
    quality_report = validate_data_quality(df_clean)
    logger.info("Data Quality Status: %s", quality_report["quality_status"])
    logger.info(
        "Audit Findings: Total Records: %d, Duplicates: %d, Invalid Dates: %d, Negative Profit Rows (Valid Commercial Losses): %d",
        quality_report["total_records"],
        quality_report["duplicate_rows"],
        quality_report["date_consistency_errors"],
        quality_report["legitimate_negative_profit_records"],
    )

    # Feature Engineering
    df_final = engineer_features(df_clean)

    # Ensure output directories exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    os.makedirs(os.path.dirname(report_path), exist_ok=True)

    # Export Processed Data
    # Format date columns back to clean ISO string for CSV export
    export_df = df_final.copy()
    if "order_date" in export_df.columns:
        export_df["order_date"] = export_df["order_date"].dt.strftime("%Y-%m-%d")
    if "ship_date" in export_df.columns:
        export_df["ship_date"] = export_df["ship_date"].dt.strftime("%Y-%m-%d")

    export_df.to_csv(output_path, index=False)
    logger.info("Saved cleaned dataset to %s (%d records)", output_path, len(export_df))

    # Save Quality Report
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(quality_report, f, indent=2)
    logger.info("Saved data quality audit report to %s", report_path)

    return df_final, quality_report


if __name__ == "__main__":
    raw_file = "data/raw/sample_superstore.csv"
    proc_file = "data/processed/superstore_cleaned.csv"
    rep_file = "data/processed/data_quality_report.json"
    run_pipeline(raw_file, proc_file, rep_file)
