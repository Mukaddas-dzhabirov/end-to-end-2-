#!/usr/bin/env python3
"""
End-to-End Sales & Business Performance Analytics
Module: Business KPI Calculation & Analytics Engine
File: python/03_kpi_calculation.py

Description:
    Computes audited business performance metrics, profit margin ratios,
    customer analytics, time-series growth rates, and category segment benchmarks.
    Ensures mathematical consistency with SQL and Power BI DAX measures.
"""

import os
import sys
import json
import logging
from typing import Dict, Any
import pandas as pd
import numpy as np

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("KPICalculation")


def calculate_core_kpis(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Calculate executive core KPIs.
    Guarantees:
    - distinct order count (avoiding row-count inflation)
    - safe division for profit margin and average order value
    """
    if df.empty:
        return {
            "total_sales": 0.0,
            "total_profit": 0.0,
            "total_orders": 0,
            "total_quantity": 0,
            "average_order_value": 0.0,
            "profit_margin_pct": 0.0,
            "average_discount_pct": 0.0,
            "average_shipping_days": 0.0,
            "profitable_orders_pct": 0.0,
        }

    total_sales = float(df["sales"].sum())
    total_profit = float(df["profit"].sum())
    total_quantity = int(df["quantity"].sum())
    total_orders = int(df["order_id"].nunique())
    avg_discount = float(df["discount"].mean()) * 100.0

    avg_order_value = total_sales / total_orders if total_orders > 0 else 0.0
    profit_margin_pct = (total_profit / total_sales * 100.0) if total_sales > 0 else 0.0

    avg_shipping_days = (
        float(df["shipping_days"].mean()) if "shipping_days" in df.columns else 0.0
    )

    # Order level profitability (aggregate profit per order_id)
    order_profit = df.groupby("order_id")["profit"].sum()
    profitable_orders_count = int((order_profit > 0).sum())
    profitable_orders_pct = (
        (profitable_orders_count / total_orders * 100.0) if total_orders > 0 else 0.0
    )

    return {
        "total_sales": round(total_sales, 2),
        "total_profit": round(total_profit, 2),
        "total_orders": total_orders,
        "total_quantity": total_quantity,
        "average_order_value": round(avg_order_value, 2),
        "profit_margin_pct": round(profit_margin_pct, 2),
        "average_discount_pct": round(avg_discount, 2),
        "average_shipping_days": round(avg_shipping_days, 1),
        "profitable_orders_pct": round(profitable_orders_pct, 2),
    }


def calculate_category_breakdown(df: pd.DataFrame) -> list:
    """Compute sales, profit, margin, and order counts per category."""
    if df.empty:
        return []

    grouped = (
        df.groupby("category")
        .agg(
            sales=("sales", "sum"),
            profit=("profit", "sum"),
            quantity=("quantity", "sum"),
            orders=("order_id", "nunique"),
            avg_discount=("discount", "mean"),
        )
        .reset_index()
    )

    grouped["profit_margin_pct"] = np.where(
        grouped["sales"] > 0,
        (grouped["profit"] / grouped["sales"] * 100.0).round(2),
        0.0,
    )
    grouped["sales_share_pct"] = (
        grouped["sales"] / grouped["sales"].sum() * 100.0
    ).round(2)
    grouped["sales"] = grouped["sales"].round(2)
    grouped["profit"] = grouped["profit"].round(2)
    grouped["avg_discount_pct"] = (grouped["avg_discount"] * 100.0).round(2)

    return grouped.sort_values(by="sales", ascending=False).to_dict(orient="records")


def calculate_regional_breakdown(df: pd.DataFrame) -> list:
    """Compute regional performance, profit, and margin metrics."""
    if df.empty:
        return []

    grouped = (
        df.groupby("region")
        .agg(
            sales=("sales", "sum"),
            profit=("profit", "sum"),
            quantity=("quantity", "sum"),
            orders=("order_id", "nunique"),
            avg_discount=("discount", "mean"),
        )
        .reset_index()
    )

    grouped["profit_margin_pct"] = np.where(
        grouped["sales"] > 0,
        (grouped["profit"] / grouped["sales"] * 100.0).round(2),
        0.0,
    )
    grouped["sales"] = grouped["sales"].round(2)
    grouped["profit"] = grouped["profit"].round(2)
    grouped["avg_discount_pct"] = (grouped["avg_discount"] * 100.0).round(2)

    return grouped.sort_values(by="sales", ascending=False).to_dict(orient="records")


def calculate_segment_breakdown(df: pd.DataFrame) -> list:
    """Compute customer segment performance (Consumer, Corporate, Home Office)."""
    if df.empty:
        return []

    grouped = (
        df.groupby("segment")
        .agg(
            sales=("sales", "sum"),
            profit=("profit", "sum"),
            customers=("customer_id", "nunique"),
            orders=("order_id", "nunique"),
        )
        .reset_index()
    )

    grouped["profit_margin_pct"] = np.where(
        grouped["sales"] > 0,
        (grouped["profit"] / grouped["sales"] * 100.0).round(2),
        0.0,
    )
    grouped["sales"] = grouped["sales"].round(2)
    grouped["profit"] = grouped["profit"].round(2)

    return grouped.sort_values(by="sales", ascending=False).to_dict(orient="records")


def calculate_sub_category_breakdown(df: pd.DataFrame) -> list:
    """Compute 17 sub-categories performance with profit margin and loss identification."""
    if df.empty:
        return []

    grouped = (
        df.groupby(["category", "sub_category"])
        .agg(
            sales=("sales", "sum"),
            profit=("profit", "sum"),
            quantity=("quantity", "sum"),
            orders=("order_id", "nunique"),
            avg_discount=("discount", "mean"),
        )
        .reset_index()
    )

    grouped["profit_margin_pct"] = np.where(
        grouped["sales"] > 0,
        (grouped["profit"] / grouped["sales"] * 100.0).round(2),
        0.0,
    )
    grouped["sales"] = grouped["sales"].round(2)
    grouped["profit"] = grouped["profit"].round(2)
    grouped["avg_discount_pct"] = (grouped["avg_discount"] * 100.0).round(2)

    return grouped.sort_values(by="sales", ascending=False).to_dict(orient="records")


def identify_unprofitable_products(df: pd.DataFrame, top_n: int = 10) -> list:
    """Identify products with high sales volume generating severe operating losses."""
    if df.empty:
        return []

    prod_perf = (
        df.groupby(["product_id", "product_name", "category", "sub_category"])
        .agg(
            total_sales=("sales", "sum"),
            total_profit=("profit", "sum"),
            units_sold=("quantity", "sum"),
            avg_discount=("discount", "mean"),
        )
        .reset_index()
    )

    unprofitable = prod_perf[prod_perf["total_profit"] < 0].copy()
    unprofitable["profit_margin_pct"] = (
        unprofitable["total_profit"] / unprofitable["total_sales"] * 100.0
    ).round(2)
    unprofitable["total_sales"] = unprofitable["total_sales"].round(2)
    unprofitable["total_profit"] = unprofitable["total_profit"].round(2)
    unprofitable["avg_discount_pct"] = (unprofitable["avg_discount"] * 100.0).round(2)

    return (
        unprofitable.sort_values(by="total_profit", ascending=True)
        .head(top_n)
        .to_dict(orient="records")
    )


def compute_all_kpis(cleaned_path: str = "data/processed/superstore_cleaned.csv") -> Dict[str, Any]:
    """Execute complete KPI calculation workflow and export summary metrics."""
    if not os.path.exists(cleaned_path):
        raise FileNotFoundError(f"Cleaned dataset not found at {cleaned_path}")

    logger.info("Computing business KPIs from %s...", cleaned_path)
    df = pd.read_csv(cleaned_path)

    core_kpis = calculate_core_kpis(df)
    category_kpis = calculate_category_breakdown(df)
    regional_kpis = calculate_regional_breakdown(df)
    segment_kpis = calculate_segment_breakdown(df)
    subcategory_kpis = calculate_sub_category_breakdown(df)
    unprofitable_prods = identify_unprofitable_products(df)

    kpi_report = {
        "core_kpis": core_kpis,
        "category_breakdown": category_kpis,
        "regional_breakdown": regional_kpis,
        "segment_breakdown": segment_kpis,
        "sub_category_breakdown": subcategory_kpis,
        "top_unprofitable_products": unprofitable_prods,
    }

    output_json = "data/processed/kpi_summary.json"
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(kpi_report, f, indent=2)

    logger.info("KPI calculations finished successfully! Output written to %s", output_json)
    return kpi_report


if __name__ == "__main__":
    compute_all_kpis()
