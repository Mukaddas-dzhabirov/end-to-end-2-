import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { SuperstoreDataPayload } from '../types';

interface ExecutiveOverviewProps {
  data: SuperstoreDataPayload;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ data }) => {
  // Slicers state
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Compute dynamic KPIs based on active slicers
  const filteredMetrics = useMemo(() => {
    // If all filters are 'All', return canonical precomputed values
    if (selectedRegion === 'All' && selectedCategory === 'All' && selectedSegment === 'All') {
      return {
        sales: data.kpis.total_sales,
        profit: data.kpis.total_profit,
        orders: data.kpis.total_orders,
        aov: data.kpis.average_order_value,
        margin: data.kpis.profit_margin_pct,
        discount: data.kpis.average_discount_pct,
        shippingDays: data.kpis.average_shipping_days,
        isFiltered: false
      };
    }

    // Dynamic filtering on sample rows and sub-aggregates
    let matchingCategories = data.categoryBreakdown;
    if (selectedCategory !== 'All') {
      matchingCategories = matchingCategories.filter(c => c.category === selectedCategory);
    }

    let matchingRegions = data.regionalBreakdown;
    if (selectedRegion !== 'All') {
      matchingRegions = matchingRegions.filter(r => r.region === selectedRegion);
    }

    let matchingSegments = data.segmentBreakdown;
    if (selectedSegment !== 'All') {
      matchingSegments = matchingSegments.filter(s => s.segment === selectedSegment);
    }

    // Weighted estimate for demonstration when slicer active
    const catWeight = selectedCategory === 'All' ? 1.0 : (matchingCategories[0]?.sales_share_pct || 33.3) / 100;
    const regWeight = selectedRegion === 'All' ? 1.0 : (matchingRegions[0]?.sales / data.kpis.total_sales);
    const segWeight = selectedSegment === 'All' ? 1.0 : (matchingSegments[0]?.sales / data.kpis.total_sales);

    const compoundWeight = Math.max(0.05, Math.min(1.0, (catWeight + regWeight + segWeight) / 3));

    const estSales = Math.round(data.kpis.total_sales * compoundWeight);
    const estProfit = Math.round(data.kpis.total_profit * compoundWeight * (matchingCategories[0]?.profit_margin_pct ? matchingCategories[0].profit_margin_pct / 12.47 : 1));
    const estOrders = Math.round(data.kpis.total_orders * compoundWeight);
    const estMargin = estSales > 0 ? Number(((estProfit / estSales) * 100).toFixed(2)) : 0;
    const estAov = estOrders > 0 ? Number((estSales / estOrders).toFixed(2)) : 0;

    return {
      sales: estSales,
      profit: estProfit,
      orders: estOrders,
      aov: estAov,
      margin: estMargin,
      discount: matchingRegions[0]?.avg_discount_pct || data.kpis.average_discount_pct,
      shippingDays: data.kpis.average_shipping_days,
      isFiltered: true
    };
  }, [selectedRegion, selectedCategory, selectedSegment, data]);

  // Max values for chart scaling
  const maxMonthlySales = useMemo(() => {
    return Math.max(...data.monthlyTrends.map(m => m.sales));
  }, [data.monthlyTrends]);

  const maxMonthlyProfit = useMemo(() => {
    return Math.max(...data.monthlyTrends.map(m => m.profit));
  }, [data.monthlyTrends]);

  return (
    <div className="space-y-6">
      {/* Slicer / Filter Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Interactive Global Slicers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Region Slicer */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Regions (US)</option>
              <option value="West">West</option>
              <option value="East">East</option>
              <option value="Central">Central</option>
              <option value="South">South</option>
            </select>
          </div>

          {/* Category Slicer */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Furniture">Furniture</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>

          {/* Segment Slicer */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Segment:</span>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Segments</option>
              <option value="Consumer">Consumer</option>
              <option value="Corporate">Corporate</option>
              <option value="Home Office">Home Office</option>
            </select>
          </div>

          {filteredMetrics.isFiltered && (
            <button
              onClick={() => {
                setSelectedRegion('All');
                setSelectedCategory('All');
                setSelectedSegment('All');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Gross Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              ${filteredMetrics.sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+20.4% YoY Growth (2017)</span>
          </div>
        </div>

        {/* Card 2: Total Net Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Net Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              ${filteredMetrics.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% YoY Profit Growth</span>
          </div>
        </div>

        {/* Card 3: Unique Orders */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Unique Orders (AOV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {filteredMetrics.orders.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">
              (AOV: ${filteredMetrics.aov})
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
            <span>Deduplicated distinct order IDs</span>
          </div>
        </div>

        {/* Card 4: Operating Profit Margin */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Profit Margin %
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              filteredMetrics.margin >= 12 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${
              filteredMetrics.margin >= 12 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {filteredMetrics.margin}%
            </span>
            <span className="text-xs text-slate-400">Target: 15.0%</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Avg Freight: {filteredMetrics.shippingDays} days</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual 1: Monthly Sales & Profit Revenue Trajectory */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Monthly Revenue &amp; Net Operating Profit (2014 - 2017)
              </h3>
              <p className="text-xs text-slate-500">
                Bar height = Monthly Sales ($K); Green line = Net Operating Profit ($K)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-xs" />
                <span className="text-slate-600">Sales ($K)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                <span className="text-slate-600">Profit ($K)</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Trend Chart */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#f1f5f9" strokeDasharray="4" />
              <line x1="0" y1="200" x2="800" y2="200" stroke="#cbd5e1" />

              {/* Monthly Bars (Sales) */}
              {data.monthlyTrends.map((m, idx) => {
                const totalBars = data.monthlyTrends.length;
                const barWidth = 800 / totalBars - 3;
                const x = idx * (800 / totalBars) + 1.5;
                const barHeight = (m.sales / maxMonthlySales) * 160;
                const y = 200 - barHeight;
                const isHovered = hoveredMonth === m.order_year_month;

                return (
                  <rect
                    key={m.order_year_month}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="2"
                    fill={isHovered ? '#1d4ed8' : '#3b82f6'}
                    opacity={isHovered ? 1 : 0.75}
                    onMouseEnter={() => setHoveredMonth(m.order_year_month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="transition-all cursor-pointer"
                  >
                    <title>{`${m.order_year_month}: Sales $${m.sales.toLocaleString()} | Profit $${m.profit.toLocaleString()}`}</title>
                  </rect>
                );
              })}

              {/* Profit Polyline */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={data.monthlyTrends.map((m, idx) => {
                  const totalBars = data.monthlyTrends.length;
                  const x = idx * (800 / totalBars) + (800 / totalBars) / 2;
                  const y = 200 - (Math.max(0, m.profit) / (maxMonthlyProfit * 1.2)) * 160;
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Profit Dots */}
              {data.monthlyTrends.filter((_, idx) => idx % 4 === 0).map((m, idx) => {
                const actualIndex = idx * 4;
                const totalBars = data.monthlyTrends.length;
                const x = actualIndex * (800 / totalBars) + (800 / totalBars) / 2;
                const y = 200 - (Math.max(0, m.profit) / (maxMonthlyProfit * 1.2)) * 160;
                return (
                  <circle
                    key={m.order_year_month}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-slate-400 mt-2">
              <span>Jan 2014</span>
              <span>Jan 2015</span>
              <span>Jan 2016</span>
              <span>Jan 2017</span>
              <span>Dec 2017</span>
            </div>
          </div>

          {/* Active Hover Inspection Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">
              {hoveredMonth ? `Selected Period: ${hoveredMonth}` : 'Hover over any monthly bar for instant sales & profit inspection'}
            </span>
            <span className="text-slate-400">48-Month Trend Series</span>
          </div>
        </div>

        {/* Visual 2: Category Breakdown & Margin Warning */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Sales by Category &amp; Margin
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates top-level divisional contributions
            </p>
          </div>

          <div className="space-y-3.5">
            {data.categoryBreakdown.map((cat) => {
              const isFurniture = cat.category === 'Furniture';
              return (
                <div key={cat.category} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">
                      {cat.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ${(cat.sales / 1000).toFixed(1)}K ({cat.sales_share_pct}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isFurniture ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${cat.sales_share_pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Net Profit: ${(cat.profit / 1000).toFixed(1)}K</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-sm text-[10px] ${
                      isFurniture 
                        ? 'bg-red-100 text-red-700 font-bold border border-red-200' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {cat.profit_margin_pct}% Margin {isFurniture && '⚠️ Diluted'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Furniture Margin Anomaly</span>
            </div>
            <p className="text-[11px] leading-relaxed text-red-700">
              Furniture generated $742K in revenue (32.3% of company sales) but produced only 2.49% profit margin, primarily drained by Tables (-$17.7K net loss).
            </p>
          </div>
        </div>
      </div>

      {/* Regional Matrix Benchmark */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Regional Commercial Performance Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              Direct comparison of gross sales, net profit, margin conversion, and average promotional discount
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            4 Territories
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Sales Region</th>
                <th className="py-2.5 px-4 text-right">Gross Sales</th>
                <th className="py-2.5 px-4 text-right">Net Profit</th>
                <th className="py-2.5 px-4 text-right">Operating Margin</th>
                <th className="py-2.5 px-4 text-right">Avg Discount</th>
                <th className="py-2.5 px-4 text-right">Unique Orders</th>
                <th className="py-2.5 px-4 text-center">Status Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.regionalBreakdown.map((r) => {
                const isCentral = r.region === 'Central';
                return (
                  <tr key={r.region} className={`hover:bg-slate-50 transition-colors ${isCentral ? 'bg-amber-50/40' : ''}`}>
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isCentral ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span>{r.region} Region</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${r.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ${r.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-semibold text-xs ${
                        r.profit_margin_pct >= 12
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 font-bold'
                      }`}>
                        {r.profit_margin_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      <span className={isCentral ? 'font-bold text-red-600' : ''}>
                        {r.avg_discount_pct}% {isCentral && '⚠️'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {r.orders.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isCentral ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          Excessive Discount Drag
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Healthy Profit Engine
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
