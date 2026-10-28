import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';

interface LinkedInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInModal: React.FC<LinkedInModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const linkedInText = `🚀 Portfolio Project: End-to-End Sales & Business Performance Analytics
Transforming Retail Sales Data into Actionable Business Insights Using SQL, Python, and Power BI

I developed a full-stack commercial data analytics project analyzing 9,994 retail transactions across the US.

Key Deliverables:
✅ Automated Python ETL Pipeline: Standardized snake_case schema, audited 0 duplicates, enforced ISO dates, and exported Star Schema dimensions.
✅ Enterprise Power BI Modeling: Star Schema with 20+ audited DAX measures (Total Sales, AOV, YoY Growth, YTD, Rank by Sales).
✅ Advanced Analytical SQL: Utilized CTEs, window functions (LAG, DENSE_RANK, NTILE), and multi-table relational joins.
✅ $85,000+ Margin Recovery Strategy: Uncovered a 20% discount "Profit Cliff" where deep discounts erased $160K+ in value; diagnosed that Furniture (32.3% of sales) produced only 2.49% margin due to Tables (-$17.7K net loss).
✅ Automated Pytest Quality Suite: 11/11 tests passing.

Tech Stack: SQL (PostgreSQL/SQLite), Python (Pandas, NumPy, Seaborn, Pytest), Power BI Desktop, DAX, Git.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkedInText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">LinkedIn Project Portfolio Summary</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Copy and paste this verified, professional project description directly into your LinkedIn <strong>Projects</strong>, <strong>Featured Section</strong>, or as a <strong>LinkedIn Post</strong>.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 max-h-64 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {linkedInText}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400 font-mono">
              ~1,100 characters • Formatted with bullet points
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy LinkedIn Summary'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
