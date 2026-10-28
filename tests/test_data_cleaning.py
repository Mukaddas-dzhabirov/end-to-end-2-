"""
End-to-End Sales & Business Performance Analytics
Unit Test Suite: Data Cleaning & Preprocessing Pipeline
File: tests/test_data_cleaning.py
"""

import pytest
import pandas as pd
import numpy as np
import importlib.util

# Load data cleaning module dynamically to support numeric module name
spec = importlib.util.spec_from_file_location(
    "data_cleaning", "python/01_data_cleaning.py"
)
cleaning = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cleaning)


@pytest.fixture
def synthetic_raw_records():
    """Labeled synthetic fixture representing uncleaned raw sales transactions."""
    return pd.DataFrame(
        [
            {
                "Row ID": 1,
                "Order ID": "ORD-2023-001",
                "Order Date": "2023-01-10",
                "Ship Date": "2023-01-14",
                "Ship Mode": "Standard Class",
                "Customer ID": "CUST-001",
                "Customer Name": "Alice Johnson",
                "Segment": "Consumer",
                "Country": "United States",
                "City": "Seattle",
                "State": "Washington",
                "Postal Code": 98101,
                "Region": "West",
                "Product ID": "TEC-PH-100",
                "Category": "Technology",
                "Sub-Category": "Phones",
                "Product Name": "Smartphone Pro Max",
                "Sales": "500.00",
                "Quantity": "2",
                "Discount": "0.10",
                "Profit": "120.50",
            },
            {
                "Row ID": 2,
                "Order ID": "ORD-2023-001",
                "Order Date": "2023-01-10",
                "Ship Date": "2023-01-14",
                "Ship Mode": "Standard Class",
                "Customer ID": "CUST-001",
                "Customer Name": "Alice Johnson",
                "Segment": "Consumer",
                "Country": "United States",
                "City": "Seattle",
                "State": "Washington",
                "Postal Code": 98101,
                "Region": "West",
                "Product ID": "OFF-PA-200",
                "Category": "Office Supplies",
                "Sub-Category": "Paper",
                "Product Name": "Copy Paper Ream",
                "Sales": 50.00,
                "Quantity": 5,
                "Discount": 0.0,
                "Profit": 25.00,
            },
            {
                "Row ID": 3,
                "Order ID": "ORD-2023-002",
                "Order Date": "2023-02-01",
                "Ship Date": "2023-02-03",
                "Ship Mode": "Second Class",
                "Customer ID": "CUST-002",
                "Customer Name": "Bob Smith",
                "Segment": "Corporate",
                "Country": "United States",
                "City": "Dallas",
                "State": "Texas",
                "Postal Code": 75201,
                "Region": "Central",
                "Product ID": "FUR-TA-300",
                "Category": "Furniture",
                "Sub-Category": "Tables",
                "Product Name": "Conference Table Large",
                "Sales": 1200.00,
                "Quantity": 1,
                "Discount": 0.50,
                "Profit": -300.00,  # Legitimate commercial loss
            },
        ]
    )


def test_standardize_columns(synthetic_raw_records):
    """Verify conversion of human-formatted headers to clean snake_case."""
    df_clean = cleaning.standardize_columns(synthetic_raw_records)
    expected_cols = [
        "row_id",
        "order_id",
        "order_date",
        "ship_date",
        "customer_id",
        "sales",
        "profit",
        "quantity",
        "discount",
    ]
    for col in expected_cols:
        assert col in df_clean.columns, f"Expected {col} in standardized columns"


def test_parse_dates(synthetic_raw_records):
    """Verify date parsing into datetime64 format and handling of ISO dates."""
    df_std = cleaning.standardize_columns(synthetic_raw_records)
    df_dates = cleaning.parse_dates(df_std)

    assert pd.api.types.is_datetime64_any_dtype(df_dates["order_date"])
    assert pd.api.types.is_datetime64_any_dtype(df_dates["ship_date"])
    assert df_dates["order_date"].iloc[0] == pd.Timestamp("2023-01-10")


def test_cast_numeric_types(synthetic_raw_records):
    """Verify casting of strings and numeric inputs to float/int with rounding."""
    df_std = cleaning.standardize_columns(synthetic_raw_records)
    df_num = cleaning.cast_numeric_types(df_std)

    assert pd.api.types.is_float_dtype(df_num["sales"])
    assert pd.api.types.is_float_dtype(df_num["profit"])
    assert pd.api.types.is_integer_dtype(df_num["quantity"])
    assert pd.api.types.is_float_dtype(df_num["discount"])
    assert df_num["sales"].iloc[0] == 500.00
    assert df_num["quantity"].iloc[0] == 2
    assert df_num["postal_code"].iloc[0] == "98101"


def test_validate_data_quality_clean_data(synthetic_raw_records):
    """Verify validation passes on clean, consistent synthetic records."""
    df_std = cleaning.standardize_columns(synthetic_raw_records)
    df_dates = cleaning.parse_dates(df_std)
    df_num = cleaning.cast_numeric_types(df_dates)
    report = cleaning.validate_data_quality(df_num)

    assert report["quality_status"] == "PASSED"
    assert report["total_records"] == 3
    assert report["duplicate_rows"] == 0
    assert report["date_consistency_errors"] == 0
    assert report["negative_sales_errors"] == 0
    assert report["legitimate_negative_profit_records"] == 1  # Record 3 is a valid commercial loss


def test_validate_data_quality_invalid_records():
    """Verify detection of anomalous conditions: negative shipping days and invalid discounts."""
    anomalous_df = pd.DataFrame(
        [
            {
                "row_id": 99,
                "order_id": "ORD-ERR-1",
                "customer_id": "C-1",
                "product_id": "P-1",
                "order_date": pd.Timestamp("2023-05-10"),
                "ship_date": pd.Timestamp("2023-05-01"),  # Error: Ship before order
                "sales": -50.00,  # Error: Negative sales
                "quantity": 0,  # Error: Zero quantity
                "discount": 1.5,  # Error: Discount > 1.0
                "profit": 10.00,
            }
        ]
    )
    report = cleaning.validate_data_quality(anomalous_df)
    assert report["quality_status"] == "FAILED_VALIDATION"
    assert report["date_consistency_errors"] == 1
    assert report["negative_sales_errors"] == 1
    assert report["invalid_discount_errors"] == 1
    assert report["non_positive_quantity_errors"] == 1


def test_feature_engineering(synthetic_raw_records):
    """Verify correct calculation of shipping_days, date parts, and profit margin."""
    df_std = cleaning.standardize_columns(synthetic_raw_records)
    df_dates = cleaning.parse_dates(df_std)
    df_num = cleaning.cast_numeric_types(df_dates)
    df_feat = cleaning.engineer_features(df_num)

    assert "shipping_days" in df_feat.columns
    assert "order_year" in df_feat.columns
    assert "profit_margin" in df_feat.columns
    assert "is_profitable" in df_feat.columns

    # Record 1: 2023-01-14 - 2023-01-10 = 4 days
    assert df_feat["shipping_days"].iloc[0] == 4
    # Record 1 margin: 120.50 / 500.00 = 0.2410
    assert df_feat["profit_margin"].iloc[0] == 0.2410
    assert df_feat["is_profitable"].iloc[0] is True or df_feat["is_profitable"].iloc[0] == 1
    # Record 3 margin: -300 / 1200 = -0.2500
    assert df_feat["profit_margin"].iloc[2] == -0.2500
    assert df_feat["is_profitable"].iloc[2] is False or df_feat["is_profitable"].iloc[2] == 0
