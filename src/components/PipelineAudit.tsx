import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Search,
  Layers
} from 'lucide-react';

interface ColumnDef {
  name: string;
  sourceType: string;
  targetType: string;
  validationRule: string;
  description: string;
}

const DATA_DICTIONARY: ColumnDef[] = [
  { name: 'row_id', sourceType: 'Integer', targetType: 'INTEGER PRIMARY KEY', validationRule: 'Strictly unique, non-null', description: 'Surrogate primary key index' },
  { name: 'order_id', sourceType: 'String', targetType: 'VARCHAR(25)', validationRule: 'Standard regex (e.g. CA-2016-152156)', description: 'Order tracking identifier' },
  { name: 'order_date', sourceType: 'String', targetType: 'DATE (ISO 8601)', validationRule: 'order_date <= ship_date', description: 'Order placement date' },
  { name: 'ship_date', sourceType: 'String', targetType: 'DATE (ISO 8601)', validationRule: 'ship_date >= order_date', description: 'Order dispatch date' },
  { name: 'ship_mode', sourceType: 'String', targetType: 'VARCHAR(20)', validationRule: 'Standard, Second, First, Same Day', description: 'Shipping delivery tier' },
  { name: 'customer_id', sourceType: 'String', targetType: 'VARCHAR(20)', validationRule: 'Foreign key to DimCustomer', description: 'Unique customer identifier' },
  { name: 'sales', sourceType: 'Float', targetType: 'NUMERIC(10,2)', validationRule: 'sales > 0, rounded to 2 decimals', description: 'Gross transaction value in USD' },
  { name: 'quantity', sourceType: 'Integer', targetType: 'INTEGER', validationRule: 'quantity >= 1', description: 'Physical units sold' },
  { name: 'discount', sourceType: 'Float', targetType: 'NUMERIC(5,4)', validationRule: '0.0000 <= discount <= 1.0000', description: 'Promotional discount rate' },
  { name: 'profit', sourceType: 'Float', targetType: 'NUMERIC(10,2)', validationRule: 'Signed float (loss allowed)', description: 'Net operating profit in USD' },
  { name: 'shipping_days', sourceType: 'Derived', targetType: 'INTEGER', validationRule: 'ship_date - order_date >= 0', description: 'Engineered delivery duration' },
  { name: 'profit_margin', sourceType: 'Derived', targetType: 'NUMERIC(7,4)', validationRule: 'profit / sales with safe zero division', description: 'Engineered profit margin ratio' }
];

export const PipelineAudit: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCols = DATA_DICTIONARY.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <span>Automated Data Pipeline &amp; Quality Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500">
            Automated Python ETL validation (`python/01_data_cleaning.py`) ensuring reproducible data integrity
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Quality Status: PASSED (100%)
          </span>
        </div>
      </div>

      {/* Visual ETL Pipeline Flowchart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          5-Stage End-to-End Processing Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <Database className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              Raw Ingestion
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Acquires raw 9,994 transactions with encoding fallbacks (UTF-8, Latin1, CP1252).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              Standardization
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Converts headers to snake_case and standardizes postal codes with 5-digit zero padding.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              Domain Auditing
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Verifies chronological order (ship &gt;= order) and discount bounds [0, 1]. Preserves commercial losses.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              Feature Engineering
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Derives shipping_days, profit_margin %, calendar hierarchies, and profitability boolean flags.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                5
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs">
              Star Schema Export
            </h4>
            <p className="text-[11px] text-slate-600 leading-normal">
              Exports clean CSVs, builds local SQLite analytical database, and generates JSON audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Checklist Metrics */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Automated Quality Control Verification Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Duplicate Rows</span>
              <span className="text-xs text-slate-500">0 found (100% Unique)</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Date Consistency</span>
              <span className="text-xs text-slate-500">0 inverted shipping dates</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Numeric Boundaries</span>
              <span className="text-xs text-slate-500">Discounts 0-1, Qty &gt;= 1</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Key Identifiers</span>
              <span className="text-xs text-slate-500">0 null Order/Product/Customer IDs</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
          <span>
            <strong>Note on Negative Profits:</strong> The pipeline audited <strong>1,871 negative profit records</strong>. As mandated by Senior Analytics principles, these were verified as legitimate commercial sales losses (e.g., discounted tables &amp; printers) and preserved rather than deleted.
          </span>
          <span className="font-mono font-bold text-blue-800 shrink-0 ml-4">
            Audited &amp; Retained
          </span>
        </div>
      </div>

      {/* Interactive Data Dictionary Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Standardized Schema &amp; Data Dictionary
            </h3>
            <p className="text-xs text-slate-500">
              Field definitions, validation constraints, and target SQL types
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search column..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Column Name</th>
                <th className="py-2.5 px-4">Target Type</th>
                <th className="py-2.5 px-4">Validation Rule</th>
                <th className="py-2.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCols.map((col) => (
                <tr key={col.name} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700">
                    {col.name}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">
                    {col.targetType}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                    {col.validationRule}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">
                    {col.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
