# Power BI Business Intelligence Architecture & Implementation Guide

This directory houses the comprehensive enterprise Power BI documentation, Star Schema dimensional specifications, DAX measure reference, and interactive dashboard layout guides for the **End-to-End Sales & Business Performance Analytics** solution.

## Portfolio Deliverables Summary

| Document | Purpose & Content |
|---|---|
| [`data_model.md`](./data_model.md) | Star Schema architecture, entity relationships, cardinalities, keys, and Date Dimension configuration |
| [`dax_measures.md`](./dax_measures.md) | 20+ audited DAX measure formulas categorized by Core KPIs, Time Intelligence, and Ranking analytics |
| [`dashboard_design.md`](./dashboard_design.md) | Exact visual specs, canvas grids, color tokens, and layout wireframes for all 3 dashboard pages |

## Why is a `.pbix` not directly checked in as binary?

In accordance with professional software engineering principles and version control best practices:
1. Microsoft Power BI Desktop `.pbix` files are proprietary OLE/ZIP binary blobs containing zipped data models and cache engines. Storing binary blobs in Git repositories creates bloated Git histories and prevents Git diffing.
2. In enterprise data teams and CI/CD pipelines, Power BI solutions are managed either via PBIP (Power BI Project format) or reproducible scripts and documentation.
3. Every single component—from data source ingestion, dimensional modeling, DAX logic, to canvas placement—is meticulously documented herein so that any analyst can build the identical, pixel-perfect `.pbix` in Power BI Desktop in under 15 minutes.

## 5-Minute Quickstart in Power BI Desktop

1. Open **Power BI Desktop**.
2. Click **Get Data** -> **Text/CSV** -> Select `data/processed/superstore_cleaned.csv` (or the individual Star Schema files in `data/processed/star_schema/`).
3. Set relationships as specified in [`data_model.md`](./data_model.md).
4. Mark the Date dimension as an official Date Table (`dim_date[date]`).
5. Create a dedicated measure table `_Measures` and paste the DAX formulas from [`dax_measures.md`](./dax_measures.md).
6. Build Page 1 (Executive Overview), Page 2 (Product & Regional Performance), and Page 3 (Customer Analytics) following [`dashboard_design.md`](./dashboard_design.md).
