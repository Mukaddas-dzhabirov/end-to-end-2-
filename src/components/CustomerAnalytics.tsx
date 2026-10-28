import React from 'react';
import { 
  Users, 
  UserCheck, 
  Award, 
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { SuperstoreDataPayload } from '../types';

interface CustomerAnalyticsProps {
  data: SuperstoreDataPayload;
}

export const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Customer Segmentation, Repeat Behavior &amp; Account Health
          </h2>
          <p className="text-xs text-slate-500">
            Evaluates 793 enterprise &amp; retail accounts across Consumer, Corporate, and Home Office cohorts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            98.1% Repeat Customer Retention Rate
          </span>
        </div>
      </div>

      {/* Customer Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.segmentBreakdown.map((seg) => {
          const isHomeOffice = seg.segment === 'Home Office';
          return (
            <div 
              key={seg.segment}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {seg.segment} Segment
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isHomeOffice ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {seg.profit_margin_pct}% Margin {isHomeOffice && '🏆 Highest'}
                </span>
              </div>

              <div className="pt-1">
                <span className="text-2xl font-bold text-slate-900">
                  ${seg.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  Gross Revenue ({((seg.sales / data.kpis.total_sales) * 100).toFixed(1)}% share)
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Net Profit</span>
                  <span className="font-bold text-slate-800">
                    ${seg.profit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Unique Accounts</span>
                  <span className="font-bold text-slate-800">
                    {seg.customers.toLocaleString()} clients
                  </span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Avg Spend/Client:</span>
                <span className="font-mono font-medium text-slate-700">
                  ${(seg.sales / seg.customers).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Purchase Frequency / Loyalty Distribution */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Customer Purchase Frequency Tiers (Loyalty Spectrum)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Categorization based on total distinct orders placed over the multi-year history
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
            <span className="text-xs font-bold text-slate-700 block">1 Order (One-Time)</span>
            <span className="text-2xl font-bold text-slate-900 block">15 Accounts</span>
            <p className="text-xs text-slate-500">Only 1.9% of customer base</p>
            <div className="text-[11px] font-medium text-slate-600 pt-1 border-t border-slate-200/60">
              Negligible one-and-done churn
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
            <span className="text-xs font-bold text-slate-700 block">2 - 4 Orders (Developing)</span>
            <span className="text-2xl font-bold text-slate-900 block">198 Accounts</span>
            <p className="text-xs text-slate-500">25.0% of customer base</p>
            <div className="text-[11px] font-medium text-slate-600 pt-1 border-t border-slate-200/60">
              Transitioning accounts
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
            <span className="text-xs font-bold text-blue-900 block">5 - 9 Orders (Loyal Core)</span>
            <span className="text-2xl font-bold text-blue-900 block">463 Accounts</span>
            <p className="text-xs text-blue-600">58.4% of customer base</p>
            <div className="text-[11px] font-medium text-blue-800 pt-1 border-t border-blue-200/60">
              Primary company profit engine
            </div>
          </div>

          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1">
            <span className="text-xs font-bold text-indigo-900 block">10+ Orders (Power Buyers)</span>
            <span className="text-2xl font-bold text-indigo-900 block">117 Accounts</span>
            <p className="text-xs text-indigo-600">14.8% of customer base</p>
            <div className="text-[11px] font-medium text-indigo-800 pt-1 border-t border-indigo-200/60">
              High volume repeat purchasers
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 High-Value Accounts Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Top 10 High-Value Accounts (Revenue vs Profitability)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Assesses individual client profitability and highlights accounts requiring pricing intervention
            </p>
          </div>
          <span className="text-xs text-slate-500">
            DENSE_RANK() by Total Sales
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Rank</th>
                <th className="py-2.5 px-4">Customer Name</th>
                <th className="py-2.5 px-4">Segment</th>
                <th className="py-2.5 px-4 text-right">Orders</th>
                <th className="py-2.5 px-4 text-right">Gross Spend</th>
                <th className="py-2.5 px-4 text-right">Net Profit</th>
                <th className="py-2.5 px-4 text-right">Margin %</th>
                <th className="py-2.5 px-4 text-center">Account Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.topCustomers.map((c, idx) => {
                const isLoss = c.profit < 0;
                const margin = ((c.profit / c.sales) * 100).toFixed(1);
                return (
                  <tr key={c.customer_id} className={`hover:bg-slate-50 ${isLoss ? 'bg-red-50/40' : ''}`}>
                    <td className="py-3 px-4 font-mono text-slate-400 font-semibold">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {c.customer_name}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {c.segment}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {c.order_id} orders
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      ${c.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${isLoss ? 'text-red-700' : 'text-emerald-700'}`}>
                      ${c.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-sm font-semibold text-[11px] ${
                        isLoss ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {margin}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLoss ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                          <AlertCircle className="w-3 h-3" />
                          Loss Leader Account (Remediate)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          Star Client
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Callout on Sean Miller */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Critical Case Study: Sean Miller Account</span>
            <p className="text-red-700 leading-relaxed text-[11px]">
              Customer Sean Miller generated the single highest revenue volume ($25,043.05 across 5 orders) but resulted in a net loss of <strong>-$1,980.74 (-7.9% margin)</strong> due to unchecked 50%+ discounts on expensive machines. This proves why revenue-based quotas without margin controls destroy shareholder value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
