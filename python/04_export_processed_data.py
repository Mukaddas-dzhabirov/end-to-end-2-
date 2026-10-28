#!/usr/bin/env python3
"""
End-to-End Sales & Business Performance Analytics
Module: Data Export & Star Schema Staging
File: python/04_export_processed_data.py

Description:
    Generates Star Schema relational dimension and fact tables from the cleaned
    transactional dataset, and creates a local SQLite database for instant SQL execution.
"""

import os
import sys
import sqlite3
import logging
import pandas as pd

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("DataExporter")


def export_star_schema(
    cleaned_csv: str = "data/processed/superstore_cleaned.csv",
    output_dir: str = "data/processed/star_schema",
    sqlite_db_path: str = "data/processed/superstore.db",
) -> None:
    """Decompose flat transactions into Star Schema dimension and fact tables."""
    if not os.path.exists(cleaned_csv):
        raise FileNotFoundError(f"Cleaned dataset not found at {cleaned_csv}")

    logger.info("Loading cleaned dataset from %s", cleaned_csv)
    df = pd.read_csv(cleaned_csv)

    os.makedirs(output_dir, exist_ok=True)

    # 1. DimCustomer
    dim_customer = (
        df[["customer_id", "customer_name", "segment"]]
        .drop_duplicates(subset=["customer_id"])
        .sort_values(by="customer_id")
        .reset_index(drop=True)
    )
    dim_customer.to_csv(f"{output_dir}/dim_customer.csv", index=False)
    logger.info("Exported DimCustomer (%d records)", len(dim_customer))

    # 2. DimProduct
    dim_product = (
        df[["product_id", "product_name", "category", "sub_category"]]
        .drop_duplicates(subset=["product_id"])
        .sort_values(by="product_id")
        .reset_index(drop=True)
    )
    dim_product.to_csv(f"{output_dir}/dim_product.csv", index=False)
    logger.info("Exported DimProduct (%d records)", len(dim_product))

    # 3. DimGeography
    dim_geography = (
        df[["postal_code", "city", "state", "region", "country"]]
        .drop_duplicates(subset=["postal_code", "city", "state"])
        .reset_index(drop=True)
    )
    dim_geography["geography_id"] = dim_geography.index + 1
    dim_geography = dim_geography[
        ["geography_id", "postal_code", "city", "state", "region", "country"]
    ]
    dim_geography.to_csv(f"{output_dir}/dim_geography.csv", index=False)
    logger.info("Exported DimGeography (%d records)", len(dim_geography))

    # 4. DimDate
    order_dates = pd.to_datetime(df["order_date"])
    ship_dates = pd.to_datetime(df["ship_date"])
    all_dates = pd.date_range(
        start=min(order_dates.min(), ship_dates.min()),
        end=max(order_dates.max(), ship_dates.max()),
        freq="D",
    )
    dim_date = pd.DataFrame({"date": all_dates})
    dim_date["date_key"] = dim_date["date"].dt.strftime("%Y%m%d").astype(int)
    dim_date["date_str"] = dim_date["date"].dt.strftime("%Y-%m-%d")
    dim_date["year"] = dim_date["date"].dt.year
    dim_date["quarter"] = "Q" + dim_date["date"].dt.quarter.astype(str)
    dim_date["month"] = dim_date["date"].dt.month
    dim_date["month_name"] = dim_date["date"].dt.month_name()
    dim_date["year_month"] = dim_date["date"].dt.strftime("%Y-%m")
    dim_date["day_of_week"] = dim_date["date"].dt.day_name()
    dim_date["is_weekend"] = dim_date["date"].dt.dayofweek >= 5
    dim_date.to_csv(f"{output_dir}/dim_date.csv", index=False)
    logger.info("Exported DimDate (%d records)", len(dim_date))

    # 5. FactSales
    fact_sales = df.merge(
        dim_geography, on=["postal_code", "city", "state", "region", "country"], how="left"
    )
    fact_cols = [
        "row_id",
        "order_id",
        "order_date",
        "ship_date",
        "ship_mode",
        "customer_id",
        "product_id",
        "geography_id",
        "sales",
        "quantity",
        "discount",
        "profit",
        "shipping_days",
        "profit_margin",
    ]
    fact_sales = fact_sales[fact_cols]
    fact_sales.to_csv(f"{output_dir}/fact_sales.csv", index=False)
    logger.info("Exported FactSales (%d records)", len(fact_sales))

    # 6. Build SQLite Analytical Database for Instant Local Querying
    logger.info("Building local SQLite analytical database at %s...", sqlite_db_path)
    os.makedirs(os.path.dirname(sqlite_db_path), exist_ok=True)
    conn = sqlite3.connect(sqlite_db_path)

    # Save both flat superstore table and normalized star schema
    df.to_sql("superstore", conn, if_exists="replace", index=False)
    dim_customer.to_sql("dim_customer", conn, if_exists="replace", index=False)
    dim_product.to_sql("dim_product", conn, if_exists="replace", index=False)
    dim_geography.to_sql("dim_geography", conn, if_exists="replace", index=False)
    dim_date.to_sql("dim_date", conn, if_exists="replace", index=False)
    fact_sales.to_sql("fact_sales", conn, if_exists="replace", index=False)

    conn.commit()
    conn.close()
    logger.info("SQLite database successfully created and indexed at %s", sqlite_db_path)


if __name__ == "__main__":
    cleaned_file = "data/processed/superstore_cleaned.csv"
    if not os.path.exists(cleaned_file):
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "data_cleaning", "python/01_data_cleaning.py"
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        module.run_pipeline()
    export_star_schema()
