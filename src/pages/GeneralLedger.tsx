import React, { useState } from 'react';
import { BookOpen, Layers, TrendingUp, BarChart3 } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';

const tabs = [
  { id: 'accounts', label: 'Chart of Accounts', icon: BookOpen },
  { id: 'batches', label: 'GL Batches', icon: Layers },
  { id: 'transactions', label: 'GL Transactions', icon: TrendingUp },
  { id: 'trial-balance', label: 'Trial Balance', icon: BarChart3 },
];

export default function GeneralLedger() {
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen size={32} className="text-blue-600" />
              General Ledger
            </h1>
            <p className="text-gray-600 mt-1">Manage chart of accounts, transactions, and GL reporting</p>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Card className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {activeTab === 'accounts' && 'Chart of Accounts management coming soon'}
              {activeTab === 'batches' && 'GL Batch management coming soon'}
              {activeTab === 'transactions' && 'GL Transactions coming soon'}
              {activeTab === 'trial-balance' && 'Trial Balance Report coming soon'}
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
