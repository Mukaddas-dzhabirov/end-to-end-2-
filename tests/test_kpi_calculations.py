"""
End-to-End Sales & Business Performance Analytics
Unit Test Suite: Business KPI Calculation Engine
File: tests/test_kpi_calculations.py
"""

import pytest
import pandas as pd
import importlib.util

spec = importlib.util.spec_from_file_location(
    "kpi_module", "python/03_kpi_calculation.py"
)
kpi = importlib.util.module_from_spec(spec)
spec.loader.exec_module(kpi)


@pytest.fixture
def synthetic_order_batch():
    """Synthetic dataset with known mathematical outcomes for KPI testing."""
    return pd.DataFrame(
        [
            {
                "order_id": "ORD-001",
                "customer_id": "C-1",
                "category": "Technology",
                "sub_category": "Phones",
                "region": "West",
                "segment": "Consumer",
                "sales": 1000.00,
                "profit": 200.00,
                "quantity": 2,
                "discount": 0.10,
                "shipping_days": 3,
            },
            {
                "order_id": "ORD-001",  # Same order, second line item
                "customer_id": "C-1",
                "category": "Technology",
                "sub_category": "Accessories",
                "region": "West",
                "segment": "Consumer",
                "sales": 500.00,
                "profit": 100.00,
                "quantity": 3,
                "discount": 0.05,
                "shipping_days": 3,
            },
            {
                "order_id": "ORD-002",
                "customer_id": "C-2",
                "category": "Furniture",
                "sub_category": "Tables",
                "region": "Central",
                "segment": "Corporate",
                "sales": 1500.00,
                "profit": -300.00,  # Negative profit line
                "quantity": 5,
                "discount": 0.30,
                "shipping_days": 5,
            },
        ]
    )


def test_core_kpi_math(synthetic_order_batch):
    """Verify core KPI aggregations, distinct order counts, and safe margin %."""
    metrics = kpi.calculate_core_kpis(synthetic_order_batch)

    # Total Sales = 1000 + 500 + 1500 = 3000.00
    assert metrics["total_sales"] == 3000.00
    # Total Profit = 200 + 100 + (-300) = 0.00
    assert metrics["total_profit"] == 0.00
    # Distinct Orders = ORD-001, ORD-002 = 2 (NOT 3 rows)
    assert metrics["total_orders"] == 2
    # Total Quantity = 2 + 3 + 5 = 10
    assert metrics["total_quantity"] == 10
    # Average Order Value = 3000 / 2 = 1500.00
    assert metrics["average_order_value"] == 1500.00
    # Profit Margin % = 0 / 3000 = 0.0%
    assert metrics["profit_margin_pct"] == 0.00
    # Average Shipping Days = (3 + 3 + 5) / 3 = 3.67 -> 3.7
    assert metrics["average_shipping_days"] == 3.7


def test_empty_dataset_edge_case():
    """Verify zero-division resilience on empty dataset."""
    empty_df = pd.DataFrame(
        columns=[
            "order_id",
            "customer_id",
            "sales",
            "profit",
            "quantity",
            "discount",
            "shipping_days",
        ]
    )
    metrics = kpi.calculate_core_kpis(empty_df)

    assert metrics["total_sales"] == 0.0
    assert metrics["total_profit"] == 0.0
    assert metrics["total_orders"] == 0
    assert metrics["average_order_value"] == 0.0
    assert metrics["profit_margin_pct"] == 0.0


def test_zero_sales_division_handling():
    """Verify safe division when sales sum is 0 to avoid ZeroDivisionError."""
    zero_sales_df = pd.DataFrame(
        [
            {
                "order_id": "ORD-FREE",
                "sales": 0.0,
                "profit": 0.0,
                "quantity": 1,
                "discount": 1.0,
                "shipping_days": 2,
            }
        ]
    )
    metrics = kpi.calculate_core_kpis(zero_sales_df)
    assert metrics["profit_margin_pct"] == 0.0
    assert metrics["average_order_value"] == 0.0


def test_category_breakdown(synthetic_order_batch):
    """Verify category grouping, profit margins, and sales share."""
    breakdown = kpi.calculate_category_breakdown(synthetic_order_batch)
    assert len(breakdown) == 2

    # Technology should have 1500 sales, 300 profit, 20% margin
    tech = next(item for item in breakdown if item["category"] == "Technology")
    assert tech["sales"] == 1500.00
    assert tech["profit"] == 300.00
    assert tech["profit_margin_pct"] == 20.00
    assert tech["sales_share_pct"] == 50.00

    # Furniture should have 1500 sales, -300 profit, -20% margin
    furn = next(item for item in breakdown if item["category"] == "Furniture")
    assert furn["sales"] == 1500.00
    assert furn["profit"] == -300.00
    assert furn["profit_margin_pct"] == -20.00


def test_regional_breakdown(synthetic_order_batch):
    """Verify regional grouping and order counts."""
    regional = kpi.calculate_regional_breakdown(synthetic_order_batch)
    assert len(regional) == 2
    west = next(item for item in regional if item["region"] == "West")
    assert west["sales"] == 1500.00
    assert west["orders"] == 1  # 2 items in ORD-001
