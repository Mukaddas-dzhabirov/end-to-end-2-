import React from 'react';
import { 
  BarChart3, 
  Database, 
  GitBranch, 
  Lightbulb, 
  Layers, 
  FileCheck2, 
  Users, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export type NavTab = 
  | 'overview' 
  | 'products_regions' 
  | 'customers' 
  | 'sql_studio' 
  | 'powerbi_model' 
  | 'data_pipeline' 
  | 'insights';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenLinkedInModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenLinkedInModal
}) => {
  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
    { id: 'products_regions', label: 'Product & Regional', icon: Layers },
    { id: 'customers', label: 'Customer Analytics', icon: Users },
    { id: 'sql_studio', label: 'SQL Studio', icon: Database },
    { id: 'powerbi_model', label: 'Data Model & DAX', icon: GitBranch },
    { id: 'data_pipeline', label: 'ETL & Quality Audit', icon: FileCheck2 },
    { id: 'insights', label: 'Insights & Strategy', icon: Lightbulb },
  ] as const;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portfolio Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">
                  Superstore Analytics
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  9,994 Rows Audited
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                SQL • Python • Power BI • Star Schema • Business Strategy
              </p>
            </div>
          </div>

          {/* Quick Actions & Portfolio Metadata */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLinkedInModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/80 rounded-lg transition-colors cursor-pointer"
              title="View LinkedIn Portfolio Summary"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn Ready</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as NavTab)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
