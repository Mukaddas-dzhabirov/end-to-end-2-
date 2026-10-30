import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Search, 
  ArrowDown, 
  ArrowUp, 
  Info,
  Sliders,
  DollarSign
} from 'lucide-react';
import { SuperstoreDataPayload } from '../types';

interface ProductRegionalDeepDiveProps {
  data: SuperstoreDataPayload;
}

export const ProductRegionalDeepDive: React.FC<ProductRegionalDeepDiveProps> = ({ data }) => {
  const [subCategorySort, setSubCategorySort] = useState<'profit' | 'sales' | 'margin'>('profit');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [stateSearch, setStateSearch] = useState<string>('');
  const [selectedStateRegion, setSelectedStateRegion] = useState<string>('All');

  // Sorted sub-categories
  const sortedSubCategories = [...data.subCategoryBreakdown].sort((a, b) => {
    let diff = 0;
    if (subCategorySort === 'profit') diff = a.profit - b.profit;
    if (subCategorySort === 'sales') diff = a.sales - b.sales;
    if (subCategorySort === 'margin') diff = a.profit_margin_pct - b.profit_margin_pct;
    return sortAsc ? diff : -diff;
  });

  // Filtered states
  const filteredStates = data.statePerformance.filter(s => {
    const matchesSearch = s.state.toLowerCase().includes(stateSearch.toLowerCase());
    const matchesRegion = selectedStateRegion === 'All' || s.region === selectedStateRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Product Portfolio, Discount Elasticity &amp; Regional Leakage
          </h2>
          <p className="text-xs text-slate-500">
            Diagnoses structural loss sectors across 17 sub-categories, 49 states, and product SKUs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            3 Loss-Making Sub-Categories Detected
          </span>
        </div>
      </div>

      {/* The 20% Discount Profit Cliff Visual Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>The Commercial "Discount Profit Cliff" Analysis</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates operating profit margin across 5 promotional discount brackets (0% to &gt;30%)
            </p>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Total Transactions: 9,994
          </span>
        </div>

        {/* 5 Discount Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {data.discountAnalysis.map((tier) => {
            const isNegative = tier.profit < 0;
            return (
              <div 
                key={tier.discount_bracket}
                className={`p-4 rounded-xl border transition-all ${
                  isNegative 
                    ? 'bg-red-50/70 border-red-200' 
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <span className="text-xs font-bold text-slate-700 block">
                  {tier.discount_bracket}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {tier.transactions.toLocaleString()} transactions
                </span>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-500 block uppercase">Net Profit</span>
                  <span className={`text-base font-bold ${isNegative ? 'text-red-700' : 'text-emerald-700'}`}>
                    ${tier.profit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Margin:</span>
                  <span className={`font-bold ${isNegative ? 'text-red-600' : 'text-emerald-700'}`}>
                    {tier.margin_pct}%
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Profitable Tx:</span>
                  <span className="font-semibold text-slate-700">{tier.profitable_rate_pct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insight Callout */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Key Empirical Finding:</span>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              Transactions discounted between 0% and 20% generate over <strong>+$447,000 in operating profit</strong> at a 10%-30% margin. Once discounts cross 20%, transactions enter a structural <strong>Profit Cliff</strong>: transactions with &gt;30% discount produced an aggregate loss of <strong>-$146,797 (0% profitable rate)</strong>!
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Category Performance Matrix */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Sub-Category Financial Matrix (17 Sectors)
            </h3>
            <p className="text-xs text-slate-500">
              Identify profitable sectors versus loss-making product categories
            </p>
          </div>

          {/* Sorting controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <button
              onClick={() => {
                if (subCategorySort === 'profit') setSortAsc(!sortAsc);
                else { setSubCategorySort('profit'); setSortAsc(true); }
              }}
              className={`px-2.5 py-1 rounded-md border font-medium cursor-pointer flex items-center gap-1 ${
                subCategorySort === 'profit' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>Profit</span>
              {subCategorySort === 'profit' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
            </button>
            <button
              onClick={() => {
                if (subCategorySort === 'sales') setSortAsc(!sortAsc);
                else { setSubCategorySort('sales'); setSortAsc(false); }
              }}
              className={`px-2.5 py-1 rounded-md border font-medium cursor-pointer flex items-center gap-1 ${
                subCategorySort === 'sales' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>Sales</span>
              {subCategorySort === 'sales' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
            </button>
            <button
              onClick={() => {
                if (subCategorySort === 'margin') setSortAsc(!sortAsc);
                else { setSubCategorySort('margin'); setSortAsc(true); }
              }}
              className={`px-2.5 py-1 rounded-md border font-medium cursor-pointer flex items-center gap-1 ${
                subCategorySort === 'margin' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span>Margin %</span>
              {subCategorySort === 'margin' && (sortAsc ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Sub-Category</th>
                <th className="py-2.5 px-4">Division</th>
                <th className="py-2.5 px-4 text-right">Gross Sales</th>
                <th className="py-2.5 px-4 text-right">Net Profit</th>
                <th className="py-2.5 px-4 text-right">Margin %</th>
                <th className="py-2.5 px-4 text-right">Avg Discount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSubCategories.map((sub) => {
                const isLoss = sub.profit < 0;
                return (
                  <tr key={sub.sub_category} className={`hover:bg-slate-50 transition-colors ${isLoss ? 'bg-red-50/40' : ''}`}>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {sub.sub_category}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {sub.category}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${sub.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      <span className={isLoss ? 'text-red-700' : 'text-emerald-700'}>
                        ${sub.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-sm font-semibold text-xs ${
                        isLoss 
                          ? 'bg-red-100 text-red-800' 
                          : sub.profit_margin_pct >= 20 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-800'
                      }`}>
                        {sub.profit_margin_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      <span className={sub.avg_discount_pct > 20 ? 'text-red-600 font-bold' : ''}>
                        {sub.avg_discount_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLoss ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                          Loss Leader
                        </span>
                      ) : sub.profit_margin_pct >= 25 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          High Margin Star
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          Standard
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

      {/* Top 10 High-Loss Products / Profit Drainers Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-red-600" />
              <span>Top 10 High-Loss Products ("Profit Drainer" SKUs)</span>
            </h3>
            <p className="text-xs text-slate-500">
              High-revenue products generating catastrophic negative margins due to unchecked discounts
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-100 text-red-800">
            Immediate Action Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Product Name</th>
                <th className="py-2.5 px-4">Sub-Category</th>
                <th className="py-2.5 px-4 text-right">Total Sales</th>
                <th className="py-2.5 px-4 text-right">Net Operating Loss</th>
                <th className="py-2.5 px-4 text-right">Margin %</th>
                <th className="py-2.5 px-4 text-right">Avg Discount</th>
                <th className="py-2.5 px-4 text-center">Remediation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.unprofitableProducts.map((p) => (
                <tr key={p.product_id} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 max-w-xs truncate" title={p.product_name}>
                    {p.product_name}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">
                    {p.sub_category}
                  </td>
                  <td className="py-2.5 px-4 text-right font-medium">
                    ${p.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-red-700">
                    ${p.total_profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded-sm bg-red-100 text-red-800 font-bold text-[11px]">
                      {p.profit_margin_pct}%
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-mono text-red-700 font-bold">
                    {p.avg_discount_pct}%
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                      Remove Discount Eligibility
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* State-Level Performance */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              State-Level Commercial Performance (49 States)
            </h3>
            <p className="text-xs text-slate-500">
              Comparison of most profitable states vs chronic loss states
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search state..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
              />
            </div>
            <select
              value={selectedStateRegion}
              onChange={(e) => setSelectedStateRegion(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Regions</option>
              <option value="West">West</option>
              <option value="East">East</option>
              <option value="Central">Central</option>
              <option value="South">South</option>
            </select>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto border border-slate-100 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-4">State</th>
                <th className="py-2.5 px-4">Region</th>
                <th className="py-2.5 px-4 text-right">Gross Sales</th>
                <th className="py-2.5 px-4 text-right">Net Profit</th>
                <th className="py-2.5 px-4 text-right">Margin %</th>
                <th className="py-2.5 px-4 text-right">Avg Discount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStates.map((s) => {
                const isLoss = s.profit < 0;
                return (
                  <tr key={s.state} className={`hover:bg-slate-50 ${isLoss ? 'bg-red-50/30' : ''}`}>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {s.state}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {s.region}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium">
                      ${s.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-2.5 px-4 text-right font-bold ${isLoss ? 'text-red-700' : 'text-emerald-700'}`}>
                      ${s.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-sm font-semibold text-[11px] ${
                        isLoss ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {s.margin_pct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {s.avg_discount_pct}%
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
