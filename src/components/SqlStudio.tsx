import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  Copy, 
  Check, 
  Code2, 
  Terminal, 
  Clock, 
  Table as TableIcon
} from 'lucide-react';

interface QueryPreset {
  id: string;
  title: string;
  file: string;
  description: string;
  tags: string[];
  sql: string;
  mockResult: {
    headers: string[];
    rows: (string | number)[][];
    rowCount: number;
    executionTimeMs: number;
  };
}

const SQL_PRESETS: QueryPreset[] = [
  {
    id: 'kpi_executive',
    title: '1. Executive Headline KPIs',
    file: 'sql/03_sales_performance.sql',
    description: 'Calculates overall gross sales, profit, distinct orders, AOV, and margin % matching executive BI metrics.',
    tags: ['Aggregations', 'Safe Division', 'DISTINCTCOUNT'],
    sql: `-- Executive Headline KPIs matching Power BI metrics
SELECT 
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    COUNT(DISTINCT order_id) AS total_orders,
    SUM(quantity) AS total_units_sold,
    ROUND(SUM(sales) / NULLIF(COUNT(DISTINCT order_id), 0), 2) AS average_order_value,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND(AVG(discount) * 100.0, 2) AS average_discount_pct,
    ROUND(AVG(shipping_days), 1) AS average_shipping_days
FROM superstore;`,
    mockResult: {
      headers: ['total_sales', 'total_profit', 'total_orders', 'total_units_sold', 'average_order_value', 'profit_margin_pct', 'average_discount_pct', 'average_shipping_days'],
      rows: [
        [2297200.65, 286396.54, 5009, 37873, 458.61, 12.47, 15.62, 4.0]
      ],
      rowCount: 1,
      executionTimeMs: 14
    }
  },
  {
    id: 'yoy_growth',
    title: '2. Annual Sales Trajectory & YoY Growth',
    file: 'sql/03_sales_performance.sql',
    description: 'Utilizes Window Function LAG() to calculate Year-over-Year revenue and profit growth percentages.',
    tags: ['Window Functions', 'LAG()', 'CTEs', 'Time Intelligence'],
    sql: `WITH annual_summary AS (
    SELECT 
        order_year,
        ROUND(SUM(sales), 2) AS annual_sales,
        ROUND(SUM(profit), 2) AS annual_profit,
        COUNT(DISTINCT order_id) AS order_volume,
        ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS annual_margin_pct
    FROM superstore
    GROUP BY order_year
)
SELECT 
    order_year,
    annual_sales,
    annual_profit,
    order_volume,
    annual_margin_pct,
    LAG(annual_sales, 1) OVER (ORDER BY order_year) AS prior_year_sales,
    ROUND(((annual_sales - LAG(annual_sales, 1) OVER (ORDER BY order_year)) 
        / NULLIF(LAG(annual_sales, 1) OVER (ORDER BY order_year), 0)) * 100.0, 2) AS sales_yoy_growth_pct
FROM annual_summary
ORDER BY order_year ASC;`,
    mockResult: {
      headers: ['order_year', 'annual_sales', 'annual_profit', 'order_volume', 'annual_margin_pct', 'prior_year_sales', 'sales_yoy_growth_pct'],
      rows: [
        [2014, 484247.50, 49543.97, 969, 10.23, 'NULL', 'NULL'],
        [2015, 470532.51, 61618.60, 1038, 13.10, 484247.50, -2.83],
        [2016, 609205.60, 81795.17, 1315, 13.43, 470532.51, 29.47],
        [2017, 733215.04, 93438.80, 1687, 12.74, 609205.60, 20.36]
      ],
      rowCount: 4,
      executionTimeMs: 18
    }
  },
  {
    id: 'discount_cliff',
    title: '3. Discount Sensitivity & Profit Cliff',
    file: 'sql/07_advanced_analysis.sql',
    description: 'Tiers transactions into discount brackets and proves that discounts > 20% lead to severe negative margins.',
    tags: ['CASE WHEN', 'Window % of Total', 'Conditional Aggregation'],
    sql: `WITH discount_brackets AS (
    SELECT 
        order_id,
        sales,
        profit,
        discount,
        CASE 
            WHEN discount = 0.0 THEN '0% (No Discount)'
            WHEN discount <= 0.10 THEN '1% - 10% (Low)'
            WHEN discount <= 0.20 THEN '11% - 20% (Moderate)'
            WHEN discount <= 0.30 THEN '21% - 30% (Aggressive)'
            ELSE '> 30% (Deep Discount)'
        END AS discount_tier
    FROM superstore
)
SELECT 
    discount_tier,
    COUNT(*) AS total_transactions,
    ROUND(SUM(sales), 2) AS total_sales,
    ROUND(SUM(profit), 2) AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(sales), 0)) * 100.0, 2) AS profit_margin_pct,
    ROUND((SUM(sales) / SUM(SUM(sales)) OVER ()) * 100.0, 2) AS sales_pct_of_total,
    ROUND((SUM(CASE WHEN profit > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2) AS profitable_tx_rate_pct
FROM discount_brackets
GROUP BY discount_tier
ORDER BY MIN(discount) ASC;`,
    mockResult: {
      headers: ['discount_tier', 'total_transactions', 'total_sales', 'total_profit', 'profit_margin_pct', 'sales_pct_of_total', 'profitable_tx_rate_pct'],
      rows: [
        ['0% (No Discount)', 4798, 1077732.18, 320988.42, 29.78, 46.91, 100.00],
        ['1% - 10% (Low)', 461, 118506.24, 24195.12, 20.42, 5.16, 94.80],
        ['11% - 20% (Moderate)', 3657, 938984.11, 102572.33, 10.92, 40.87, 86.10],
        ['21% - 30% (Aggressive)', 366, 83720.59, -14562.18, -17.39, 3.64, 18.30],
        ['> 30% (Deep Discount)', 712, 78257.53, -146797.15, -187.58, 3.42, 0.00]
      ],
      rowCount: 5,
      executionTimeMs: 22
    }
  },
  {
    id: 'top_skus_ranked',
    title: '4. Top 10 Products by Sales using DENSE_RANK',
    file: 'sql/04_product_analysis.sql',
    description: 'Ranks top products by gross revenue and compares profit contribution.',
    tags: ['DENSE_RANK()', 'Window Functions', 'Ranking'],
    sql: `WITH ranked_sales AS (
    SELECT 
        product_id,
        product_name,
        category,
        sub_category,
        ROUND(SUM(sales), 2) AS total_sales,
        ROUND(SUM(profit), 2) AS total_profit,
        SUM(quantity) AS total_units,
        DENSE_RANK() OVER (ORDER BY SUM(sales) DESC) AS sales_rank
    FROM superstore
    GROUP BY product_id, product_name, category, sub_category
)
SELECT 
    sales_rank,
    product_name,
    category,
    sub_category,
    total_sales,
    total_profit,
    total_units
FROM ranked_sales
WHERE sales_rank <= 5
ORDER BY sales_rank ASC;`,
    mockResult: {
      headers: ['sales_rank', 'product_name', 'category', 'sub_category', 'total_sales', 'total_profit', 'total_units'],
      rows: [
        [1, 'Canon imageCLASS 2200 Advanced Copier', 'Technology', 'Copiers', 61599.82, 25199.93, 20],
        [2, 'Fellowes PB500 Electric Punch Binding Machine', 'Office Supplies', 'Binders', 27453.38, 7753.04, 31],
        [3, 'Cisco TelePresence System EX90 Video Unit', 'Technology', 'Machines', 22638.48, -1811.08, 6],
        [4, 'HON 5400 Series Task Chairs', 'Furniture', 'Chairs', 21870.58, 0.00, 73],
        [5, 'GBC DocuBind TL300 Electric Binding System', 'Office Supplies', 'Binders', 19823.48, 4853.75, 37]
      ],
      rowCount: 5,
      executionTimeMs: 16
    }
  },
  {
    id: 'star_schema_join',
    title: '5. Star Schema Relational Join Query',
    file: 'sql/07_advanced_analysis.sql',
    description: 'Demonstrates Kimball dimensional joining between FactSales, DimCustomer, DimProduct, and DimGeography.',
    tags: ['INNER JOIN', 'Star Schema', 'Dimensional Modeling'],
    sql: `SELECT 
    c.segment,
    p.category,
    g.region,
    COUNT(DISTINCT f.order_id) AS distinct_orders,
    ROUND(SUM(f.sales), 2) AS total_sales,
    ROUND(SUM(f.profit), 2) AS total_profit,
    ROUND((SUM(f.profit) / NULLIF(SUM(f.sales), 0)) * 100.0, 2) AS profit_margin_pct
FROM fact_sales f
JOIN dim_customer c ON f.customer_id = c.customer_id
JOIN dim_product p ON f.product_id = p.product_id
JOIN dim_geography g ON f.geography_id = g.geography_id
GROUP BY c.segment, p.category, g.region
ORDER BY total_sales DESC
LIMIT 5;`,
    mockResult: {
      headers: ['segment', 'category', 'region', 'distinct_orders', 'total_sales', 'total_profit', 'profit_margin_pct'],
      rows: [
        ['Consumer', 'Technology', 'East', 229, 135441.26, 26972.58, 19.91],
        ['Consumer', 'Technology', 'West', 254, 132991.75, 23512.18, 17.68],
        ['Consumer', 'Furniture', 'West', 311, 119808.12, 5748.24, 4.80],
        ['Consumer', 'Furniture', 'East', 302, 107472.95, 4125.10, 3.84],
        ['Corporate', 'Technology', 'East', 151, 93946.04, 15410.22, 16.40]
      ],
      rowCount: 5,
      executionTimeMs: 25
    }
  }
];

export const SqlStudio: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<QueryPreset>(SQL_PRESETS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(true);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResult(true);
    }, 280);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedPreset.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>Interactive SQL Analytics Studio</span>
          </h2>
          <p className="text-xs text-slate-500">
            Execute production-grade analytical queries directly against the Superstore schema
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 font-mono text-[11px] font-semibold text-slate-700">
            Dialect: PostgreSQL &amp; SQLite
          </span>
        </div>
      </div>

      {/* Query Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {SQL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedPreset(preset);
              setShowResult(true);
            }}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
              selectedPreset.id === preset.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* SQL Code View & Execution Container */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
        {/* Editor Header Bar */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400">
              {selectedPreset.file}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executing...' : 'Run Query'}</span>
            </button>
          </div>
        </div>

        {/* Metadata info */}
        <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">
            {selectedPreset.description}
          </span>
          <div className="flex items-center gap-1.5">
            {selectedPreset.tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-sm bg-slate-800 text-blue-300 text-[10px] font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* SQL Code Block */}
        <div className="p-4 overflow-x-auto text-xs font-mono text-blue-100 leading-relaxed bg-slate-950">
          <pre>{selectedPreset.sql}</pre>
        </div>
      </div>

      {/* Query Execution Results */}
      {showResult && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Query Output Result Set
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Execution: {selectedPreset.mockResult.executionTimeMs} ms
              </span>
              <span>•</span>
              <span>{selectedPreset.mockResult.rowCount} rows returned</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs text-slate-800 font-mono">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
                <tr>
                  {selectedPreset.mockResult.headers.map((h) => (
                    <th key={h} className="py-2 px-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {selectedPreset.mockResult.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
                        {typeof cell === 'number' 
                          ? cell.toLocaleString('en-US', { maximumFractionDigits: 2 })
                          : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
