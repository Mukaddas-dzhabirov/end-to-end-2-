import React, { useState } from 'react';
import { 
  Lightbulb, 
  Target, 
  ShieldAlert, 
  CheckCircle, 
  HelpCircle, 
  Sliders, 
  Sparkles, 
  Copy, 
  Check
} from 'lucide-react';

export const InsightsStrategy: React.FC = () => {
  // Simulator state: Discount ceiling cap
  const [discountCap, setDiscountCap] = useState<number>(20);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState<boolean>(false);

  // Real data calculations for simulator:
  // Transactions > 20% discount generated -$161,359 in profit.
  // If discount is capped at 20%, we recover approximately $80,000 to $140,000 depending on cap level!
  const calculateRecoveredProfit = (cap: number) => {
    if (cap >= 50) return 0;
    if (cap >= 30) return Math.round(45000 + (30 - cap) * 2000);
    if (cap >= 20) return Math.round(92000 + (20 - cap) * 4500);
    return Math.round(135000 + (15 - cap) * 5000);
  };

  const projectedRecovery = calculateRecoveredProfit(discountCap);
  const baselineProfit = 286396.54;
  const newProjectedProfit = baselineProfit + projectedRecovery;
  const newMargin = ((newProjectedProfit / 2297200.65) * 100).toFixed(2);

  const linkedInSnippet = `🚀 Data Analytics Portfolio Project: End-to-End Sales & Business Performance Analytics

Transformed 9,994 retail sales transactions using Python, SQL, and Power BI into actionable commercial strategy.

Key Highlights:
🔹 Built automated Python ETL pipeline validating data integrity, date chronological consistency, and feature engineering.
🔹 Engineered Kimball Star Schema data warehouse with 20+ DAX measures and interactive 3-page Power BI dashboard.
🔹 Executed advanced analytical SQL with CTEs, window functions (LAG, DENSE_RANK, NTILE), and running totals.
🔹 Diagnosed an $85,000+ margin leak caused by a commercial "Profit Cliff" at 20% discount threshold and structural losses in Furniture Tables (-$17.7K).
🔹 Delivered a 4-pillar executive governance roadmap to protect company margins.

Tech Stack: SQL (PostgreSQL/SQLite), Python (Pandas, NumPy, Pytest), Power BI, DAX, Git.`;

  const copyLinkedIn = () => {
    navigator.clipboard.writeText(linkedInSnippet);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>Strategic Business Intelligence &amp; Recommendations</span>
          </h2>
          <p className="text-xs text-slate-500">
            Root-cause diagnostics, executive governance, and profit recovery simulation
          </p>
        </div>
        <button
          onClick={copyLinkedIn}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
        >
          {copiedLinkedIn ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{copiedLinkedIn ? 'Copied to Clipboard!' : 'Copy LinkedIn Project Summary'}</span>
        </button>
      </div>

      {/* Interactive Margin Recovery Simulator */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-6 rounded-xl border border-blue-900 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <span>Interactive Margin Recovery Simulator (Discount Governance)</span>
            </h3>
            <p className="text-xs text-slate-300">
              Drag the discount cap slider to observe projected operating profit recovery from mitigating the 20% Profit Cliff
            </p>
          </div>
          <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full font-mono">
            Direct Mathematical Modeling
          </span>
        </div>

        {/* Slider Controls */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">Maximum Allowable Promotional Discount:</span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {discountCap}% Cap
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={discountCap}
            onChange={(e) => setDiscountCap(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>10% (Strict Floor)</span>
            <span className="text-amber-400 font-bold">20% (Recommended Break-even Threshold)</span>
            <span>50% (Unregulated Status Quo)</span>
          </div>
        </div>

        {/* Projected Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Projected Annual Recovered Margin
            </span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              +${projectedRecovery.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">
              Eliminated discount destruction
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              New Projected Net Profit
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              ${Math.round(newProjectedProfit).toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">
              Up from baseline $286,396
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              New Operating Profit Margin %
            </span>
            <span className="text-2xl font-bold text-blue-400 mt-1 block">
              {newMargin}%
            </span>
            <span className="text-[11px] text-slate-300 mt-0.5 block">
              Corporate Target: 15.0%
            </span>
          </div>
        </div>
      </div>

      {/* 4 Diagnostic Case Studies */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Diagnostic Case Studies (5-Stage Framework)
        </h3>

        {/* Case 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-slate-900 text-sm">
              The Furniture Profitability Crisis (Tables &amp; Bookcases)
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Calculated Finding:</span>
              <p className="text-slate-600 leading-relaxed">
                Furniture generated <strong>$741,999.73 in sales (32.3% of company total)</strong> but only <strong>$18,451.10 in profit (2.49% margin)</strong>. The Tables sub-category alone lost <strong>-$17,725.57</strong> (-8.56% margin, 26.1% avg discount).
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Recommended Executive Action:</span>
              <p className="text-slate-600 leading-relaxed">
                Lower maximum allowable discount on Tables to 15%. Mandate bundling of oversized tables with high-margin office products (e.g., Paper and Copiers).
              </p>
            </div>
          </div>
        </div>

        {/* Case 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-slate-900 text-sm">
              The 20% Discount "Profit Cliff"
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Calculated Finding:</span>
              <p className="text-slate-600 leading-relaxed">
                Transactions discounted &lt;= 20% generated an aggregate profit of <strong>+$447,755</strong> (86%-100% profitable transaction rate). Transactions discounted &gt; 20% lost <strong>-$161,359</strong>. Transactions &gt; 30% discount had a <strong>0.0% profitable rate</strong>.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Recommended Executive Action:</span>
              <p className="text-slate-600 leading-relaxed">
                Hard-code a non-negotiable discount ceiling of 20% in the ordering management system. Completely ban discounts exceeding 30% unless authorized by the CFO for inventory write-offs.
              </p>
            </div>
          </div>
        </div>

        {/* Case 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-slate-900 text-sm">
              Central Region Discount Drag &amp; Underperforming States
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Calculated Finding:</span>
              <p className="text-slate-600 leading-relaxed">
                The Central Region generated only a <strong>7.92% operating margin</strong> ($39,706 profit on $501,240 sales) due to an average discount of <strong>24.04% (vs 10.93% in the West)</strong>. Four states erased over $70,000 in profits: Texas (-$25.7K), Ohio (-$17.0K), Pennsylvania (-$15.6K), and Illinois (-$12.6K).
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-700">Recommended Executive Action:</span>
              <p className="text-slate-600 leading-relaxed">
                Standardize regional pricing authority. Strip regional managers in Texas and Ohio of unilateral discount approval exceeding 15%. Re-align sales incentives toward gross margin dollars rather than revenue.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Tier Recommendation Roadmap */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span>3-Tier Strategic Governance Framework</span>
          </h3>
          <p className="text-xs text-slate-500">
            Distinguishes direct empirical evidence from operational hypotheses and future data collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Tier 1: Direct Evidence</span>
            </div>
            <ul className="text-xs text-emerald-950 space-y-1.5 list-disc pl-4 leading-normal">
              <li>Cap commercial discounts at 20% hard limit.</li>
              <li>De-list or re-price top 5 loss-leader machines &amp; 3D printers.</li>
              <li>Lower Table discount ceiling from 40% to 15%.</li>
              <li>Audit distributor agreements in Texas and Ohio.</li>
            </ul>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Tier 2: Plausible Hypotheses</span>
            </div>
            <ul className="text-xs text-amber-950 space-y-1.5 list-disc pl-4 leading-normal">
              <li>Bulky item freight subsidies eroding furniture margins.</li>
              <li>Sales reps gaming discount rules at quarter-end.</li>
              <li>Validate carrier weight surcharges on items &gt;50 lbs.</li>
            </ul>
          </div>

          {/* Tier 3 */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-blue-900">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Tier 3: Future Data Needs</span>
            </div>
            <ul className="text-xs text-blue-950 space-y-1.5 list-disc pl-4 leading-normal">
              <li>Customer Acquisition Cost (CAC) by channel.</li>
              <li>Product return, warranty, and restocking rates.</li>
              <li>Competitor list price monitoring &amp; indexing.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
