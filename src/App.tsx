/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import superstoreJson from './data/superstoreData.json';
import { SuperstoreDataPayload } from './types';
import { Navbar, NavTab } from './components/Navbar';
import { ExecutiveOverview } from './components/ExecutiveOverview';
import { ProductRegionalDeepDive } from './components/ProductRegionalDeepDive';
import { CustomerAnalytics } from './components/CustomerAnalytics';
import { SqlStudio } from './components/SqlStudio';
import { DataModelDax } from './components/DataModelDax';
import { PipelineAudit } from './components/PipelineAudit';
import { InsightsStrategy } from './components/InsightsStrategy';
import { LinkedInModal } from './components/LinkedInModal';

const data = superstoreJson as unknown as SuperstoreDataPayload;

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header & Tab Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <ExecutiveOverview data={data} />}
        {activeTab === 'products_regions' && <ProductRegionalDeepDive data={data} />}
        {activeTab === 'customers' && <CustomerAnalytics data={data} />}
        {activeTab === 'sql_studio' && <SqlStudio />}
        {activeTab === 'powerbi_model' && <DataModelDax />}
        {activeTab === 'data_pipeline' && <PipelineAudit />}
        {activeTab === 'insights' && <InsightsStrategy />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">End-to-End Sales &amp; Business Performance Analytics</span>
            <span>•</span>
            <span>Tableau / Kaggle Superstore Dataset (9,994 Rows)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLinkedInModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              LinkedIn Project Text
            </button>
            <span>•</span>
            <span className="text-slate-400">Production-Grade Data Portfolio</span>
          </div>
        </div>
      </footer>

      {/* LinkedIn Export Modal */}
      <LinkedInModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
      />
    </div>
  );
}
