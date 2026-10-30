import React, { useState } from 'react';
import { 
  GitBranch, 
  Search, 
  Copy, 
  Check, 
  BookOpen, 
  Key, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DaxMeasureItem {
  id: string;
  name: string;
  category: 'Core KPIs' | 'Time Intelligence' | 'Analytical & Ranking';
  format: string;
  description: string;
  dax: string;
}

const DAX_MEASURES: DaxMeasureItem[] = [
  {
    id: 'total_sales',
    name: 'Total Sales',
    category: 'Core KPIs',
    format: 'Currency ($#,##0.00)',
    description: 'Gross transaction revenue across all filtered sales lines.',
    dax: `Total Sales = 
SUM('fact_sales'[sales])`
  },
  {
    id: 'total_profit',
    name: 'Total Profit',
    category: 'Core KPIs',
    format: 'Currency ($#,##0.00)',
    description: 'Net financial profit, preserving legitimate commercial losses.',
    dax: `Total Profit = 
SUM('fact_sales'[profit])`
  },
  {
    id: 'total_orders',
    name: 'Total Orders',
    category: 'Core KPIs',
    format: 'Whole Number (#,##0)',
    description: 'Count of unique orders. Distinct count avoids row-level item inflation.',
    dax: `Total Orders = 
DISTINCTCOUNT('fact_sales'[order_id])`
  },
  {
    id: 'aov',
    name: 'Average Order Value (AOV)',
    category: 'Core KPIs',
    format: 'Currency ($#,##0.00)',
    description: 'Average revenue generated per distinct customer order.',
    dax: `Average Order Value = 
DIVIDE(
    [Total Sales],
    [Total Orders],
    0
)`
  },
  {
    id: 'profit_margin',
    name: 'Profit Margin %',
    category: 'Core KPIs',
    format: 'Percentage (0.0%)',
    description: 'Percentage of revenue converted to net operating profit.',
    dax: `Profit Margin % = 
DIVIDE(
    [Total Profit],
    [Total Sales],
    0
)`
  },
  {
    id: 'sales_yoy',
    name: 'Sales YoY Growth %',
    category: 'Time Intelligence',
    format: 'Percentage (+0.0%;-0.0%)',
    description: 'Year-over-Year revenue expansion compared to the identical period last year.',
    dax: `Sales YoY Growth % = 
VAR CurrentSales = [Total Sales]
VAR PriorSales = 
    CALCULATE(
        [Total Sales],
        SAMEPERIODLASTYEAR('dim_date'[date])
    )
RETURN
DIVIDE(
    CurrentSales - PriorSales,
    PriorSales,
    0
)`
  },
  {
    id: 'sales_ytd',
    name: 'Sales YTD',
    category: 'Time Intelligence',
    format: 'Currency ($#,##0.00)',
    description: 'Cumulative year-to-date sales starting Jan 1st of the active calendar year.',
    dax: `Sales YTD = 
TOTALYTD(
    [Total Sales],
    'dim_date'[date]
)`
  },
  {
    id: 'sales_mom',
    name: 'Sales MoM Growth %',
    category: 'Time Intelligence',
    format: 'Percentage (0.0%)',
    description: 'Month-over-Month percentage change using DATEADD.',
    dax: `Sales MoM Growth % = 
VAR CurrentSales = [Total Sales]
VAR PreviousMonthSales = 
    CALCULATE(
        [Total Sales],
        DATEADD('dim_date'[date], -1, MONTH)
    )
RETURN
DIVIDE(
    CurrentSales - PreviousMonthSales,
    PreviousMonthSales,
    0
)`
  },
  {
    id: 'sales_pct_total',
    name: 'Sales % of Total',
    category: 'Analytical & Ranking',
    format: 'Percentage (0.0%)',
    description: 'Contribution of filtered dimension to the company-wide total using ALLSELECTED.',
    dax: `Sales % of Total = 
DIVIDE(
    [Total Sales],
    CALCULATE(
        [Total Sales],
        ALLSELECTED('fact_sales')
    ),
    0
)`
  },
  {
    id: 'product_rank',
    name: 'Product Sales Rank',
    category: 'Analytical & Ranking',
    format: 'Integer (#,##0)',
    description: 'Dense ranking of products by gross sales revenue.',
    dax: `Product Sales Rank = 
IF(
    ISINSCOPE('dim_product'[product_name]),
    RANKX(
        ALLSELECTED('dim_product'[product_name]),
        [Total Sales],
        ,
        DESC,
        DENSE
    ),
    BLANK()
)`
  }
];

export const DataModelDax: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDax = DAX_MEASURES.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-600" />
            <span>Power BI Data Architecture &amp; DAX Measures Library</span>
          </h2>
          <p className="text-xs text-slate-500">
            Ralph Kimball Star Schema modeling, primary/foreign keys, and production DAX formulas
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
            Star Schema (1:* Single Direction)
          </span>
        </div>
      </div>

      {/* Visual Star Schema Architecture Diagram */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Analytical Star Schema Entity Relationship Diagram</span>
          </h3>
          <p className="text-xs text-slate-500">
            Optimized for Power BI VertiPaq compression and Analysis Services performance
          </p>
        </div>

        {/* Diagram Cards Container */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-white overflow-x-auto">
          <div className="min-w-[700px] flex flex-col items-center gap-6">
            {/* Top Dimension: DimDate */}
            <div className="w-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-md">
              <div className="flex items-center justify-between font-bold text-blue-300 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  dim_date (Calendar)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">1,464 Rows</span>
              </div>
              <ul className="mt-2 space-y-1 text-slate-300 font-mono text-[11px]">
                <li className="text-amber-400 font-semibold flex items-center gap-1">
                  <Key className="w-2.5 h-2.5" /> PK: date (Date)
                </li>
                <li>year, quarter, month</li>
                <li>month_name, day_of_week</li>
              </ul>
            </div>

            {/* Middle Row: DimCustomer, FactSales, DimProduct */}
            <div className="w-full flex items-center justify-between gap-4">
              {/* DimCustomer */}
              <div className="w-60 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-md">
                <div className="flex items-center justify-between font-bold text-blue-300 pb-1 border-b border-slate-800">
                  <span>dim_customer</span>
                  <span className="text-[10px] text-emerald-400 font-mono">793 Rows</span>
                </div>
                <ul className="mt-2 space-y-1 text-slate-300 font-mono text-[11px]">
                  <li className="text-amber-400 font-semibold flex items-center gap-1">
                    <Key className="w-2.5 h-2.5" /> PK: customer_id
                  </li>
                  <li>customer_name</li>
                  <li>segment</li>
                </ul>
              </div>

              {/* Relationship Arrow Left */}
              <div className="flex items-center text-xs font-mono text-slate-400">
                <span>1</span>
                <div className="w-8 h-px bg-slate-600" />
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>*</span>
              </div>

              {/* Central Fact Table */}
              <div className="w-72 bg-gradient-to-b from-blue-950 to-slate-900 border-2 border-blue-500 rounded-xl p-4 text-xs shadow-xl">
                <div className="flex items-center justify-between font-bold text-blue-200 pb-1 border-b border-blue-800">
                  <span className="text-sm">fact_sales (Central Fact)</span>
                  <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                    9,994 Rows
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-slate-200 font-mono text-[11px]">
                  <li className="text-amber-300 font-bold flex items-center gap-1">
                    <Key className="w-2.5 h-2.5" /> PK: row_id
                  </li>
                  <li className="text-cyan-400">FK: order_date --&gt; dim_date</li>
                  <li className="text-cyan-400">FK: customer_id --&gt; dim_customer</li>
                  <li className="text-cyan-400">FK: product_id --&gt; dim_product</li>
                  <li className="text-cyan-400">FK: geography_id --&gt; dim_geography</li>
                  <li className="pt-1 text-emerald-300 font-medium">Measures: sales, profit, discount, quantity</li>
                </ul>
              </div>

              {/* Relationship Arrow Right */}
              <div className="flex items-center text-xs font-mono text-slate-400">
                <span>*</span>
                <div className="w-8 h-px bg-slate-600" />
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span>1</span>
              </div>

              {/* DimProduct */}
              <div className="w-60 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-md">
                <div className="flex items-center justify-between font-bold text-blue-300 pb-1 border-b border-slate-800">
                  <span>dim_product</span>
                  <span className="text-[10px] text-emerald-400 font-mono">1,862 Rows</span>
                </div>
                <ul className="mt-2 space-y-1 text-slate-300 font-mono text-[11px]">
                  <li className="text-amber-400 font-semibold flex items-center gap-1">
                    <Key className="w-2.5 h-2.5" /> PK: product_id
                  </li>
                  <li>product_name</li>
                  <li>category, sub_category</li>
                </ul>
              </div>
            </div>

            {/* Bottom Dimension: DimGeography */}
            <div className="w-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-md">
              <div className="flex items-center justify-between font-bold text-blue-300 pb-1 border-b border-slate-800">
                <span>dim_geography</span>
                <span className="text-[10px] text-emerald-400 font-mono">632 Rows</span>
              </div>
              <ul className="mt-2 space-y-1 text-slate-300 font-mono text-[11px]">
                <li className="text-amber-400 font-semibold flex items-center gap-1">
                  <Key className="w-2.5 h-2.5" /> PK: geography_id
                </li>
                <li>postal_code, city, state</li>
                <li>region, country</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* DAX Measures Search & Library */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Tested DAX Measures Dictionary</span>
            </h3>
            <p className="text-xs text-slate-500">
              Formulas ready for copy-pasting into Power BI Desktop
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search DAX measures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Core KPIs">Core KPIs</option>
              <option value="Time Intelligence">Time Intelligence</option>
              <option value="Analytical &amp; Ranking">Analytical &amp; Ranking</option>
            </select>
          </div>
        </div>

        {/* DAX Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDax.map((measure) => (
            <div 
              key={measure.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {measure.name}
                  </h4>
                  <span className="text-[10px] text-blue-600 font-mono">
                    Format: {measure.format}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(measure.id, measure.dax)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedId === measure.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === measure.id ? 'Copied' : 'Copy DAX'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-normal">
                {measure.description}
              </p>

              {/* Code Snippet */}
              <div className="p-3 bg-slate-950 rounded-lg text-blue-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
                <pre>{measure.dax}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
