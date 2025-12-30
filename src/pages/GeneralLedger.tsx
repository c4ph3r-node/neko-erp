import React, { useState } from 'react';
import { BookOpen, Layers, TrendingUp, BarChart3, Plus, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useGlobalState } from '../contexts/GlobalStateContext';

const tabs = [
  { id: 'accounts', label: 'Chart of Accounts', icon: BookOpen },
  { id: 'batches', label: 'GL Batches', icon: Layers },
  { id: 'transactions', label: 'GL Transactions', icon: TrendingUp },
  { id: 'trial-balance', label: 'Trial Balance', icon: BarChart3 },
];

const accountTypes = [
  { value: 'asset', label: 'Assets', color: 'bg-blue-100 text-blue-800' },
  { value: 'liability', label: 'Liabilities', color: 'bg-red-100 text-red-800' },
  { value: 'equity', label: 'Equity', color: 'bg-green-100 text-green-800' },
  { value: 'revenue', label: 'Revenue', color: 'bg-purple-100 text-purple-800' },
  { value: 'expense', label: 'Expenses', color: 'bg-orange-100 text-orange-800' }
];

const mockChartOfAccounts = [
  { id: 1, code: '1000', name: 'Cash and Cash Equivalents', type: 'asset', balance: 2500000, category: 'Current Assets' },
  { id: 2, code: '1100', name: 'Accounts Receivable', type: 'asset', balance: 1800000, category: 'Current Assets' },
  { id: 3, code: '1200', name: 'Inventory', type: 'asset', balance: 3200000, category: 'Current Assets' },
  { id: 4, code: '1300', name: 'Prepaid Expenses', type: 'asset', balance: 450000, category: 'Current Assets' },
  { id: 5, code: '1400', name: 'Fixed Assets', type: 'asset', balance: 8500000, category: 'Non-Current Assets' },
  { id: 6, code: '2000', name: 'Accounts Payable', type: 'liability', balance: -2100000, category: 'Current Liabilities' },
  { id: 7, code: '2100', name: 'Loans Payable', type: 'liability', balance: -5000000, category: 'Non-Current Liabilities' },
  { id: 8, code: '3000', name: 'Share Capital', type: 'equity', balance: -7500000, category: 'Equity' },
  { id: 9, code: '3100', name: 'Retained Earnings', type: 'equity', balance: -1250000, category: 'Equity' },
  { id: 10, code: '4000', name: 'Sales Revenue', type: 'revenue', balance: -8500000, category: 'Revenue' },
  { id: 11, code: '5000', name: 'Cost of Goods Sold', type: 'expense', balance: 4200000, category: 'Expenses' },
  { id: 12, code: '5100', name: 'Operating Expenses', type: 'expense', balance: 2800000, category: 'Expenses' },
  { id: 13, code: '5200', name: 'Administrative Expenses', type: 'expense', balance: 950000, category: 'Expenses' }
];

const mockGLTransactions = [
  { id: 1, date: '2025-01-15', reference: 'INV-001', description: 'Sale to Acme Corp', debit: 0, credit: 125000, account: '4000 - Sales Revenue' },
  { id: 2, date: '2025-01-15', reference: 'INV-001', description: 'Sale to Acme Corp', debit: 125000, credit: 0, account: '1100 - Accounts Receivable' },
  { id: 3, date: '2025-01-16', reference: 'PAY-001', description: 'Office Supplies Purchase', debit: 45000, credit: 0, account: '5100 - Operating Expenses' },
  { id: 4, date: '2025-01-16', reference: 'PAY-001', description: 'Office Supplies Purchase', debit: 0, credit: 45000, account: '2000 - Accounts Payable' },
  { id: 5, date: '2025-01-17', reference: 'DEP-001', description: 'Cash Deposit', debit: 200000, credit: 0, account: '1000 - Cash and Cash Equivalents' },
  { id: 6, date: '2025-01-17', reference: 'DEP-001', description: 'Cash Deposit', debit: 0, credit: 200000, account: '1100 - Accounts Receivable' }
];

export default function GeneralLedger() {
  const { state, formatCurrency } = useGlobalState();
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');

  const filteredAccounts = mockChartOfAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.code.includes(searchTerm);
    const matchesType = accountTypeFilter === 'all' || account.type === accountTypeFilter;
    return matchesSearch && matchesType;
  });

  const getAccountTypeColor = (type) => {
    const accountType = accountTypes.find(at => at.value === type);
    return accountType ? accountType.color : 'bg-gray-100 text-gray-800';
  };

  const getTotalAssets = () => mockChartOfAccounts.filter(acc => acc.type === 'asset').reduce((sum, acc) => sum + acc.balance, 0);
  const getTotalLiabilities = () => Math.abs(mockChartOfAccounts.filter(acc => acc.type === 'liability').reduce((sum, acc) => sum + acc.balance, 0));
  const getTotalEquity = () => Math.abs(mockChartOfAccounts.filter(acc => acc.type === 'equity').reduce((sum, acc) => sum + acc.balance, 0));
  const getNetIncome = () => Math.abs(mockChartOfAccounts.filter(acc => acc.type === 'revenue').reduce((sum, acc) => sum + acc.balance, 0)) -
                           mockChartOfAccounts.filter(acc => acc.type === 'expense').reduce((sum, acc) => sum + acc.balance, 0);

  const renderChartOfAccounts = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(getTotalAssets())}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(getTotalLiabilities())}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Equity</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalEquity())}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(getNetIncome())}</p>
            </div>
            <Layers className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={accountTypeFilter}
              onChange={(e) => setAccountTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {accountTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2">
              <Plus size={18} />
              Add Account
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Download size={18} />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Accounts Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{account.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{account.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{account.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAccountTypeColor(account.type)}`}>
                      {accountTypes.find(at => at.value === account.type)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(Math.abs(account.balance))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderGLTransactions = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">General Ledger Transactions</h3>
            <p className="text-sm text-gray-500">View all GL journal entries and transactions</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            New Journal Entry
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockGLTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.reference}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{transaction.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{transaction.account}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderTrialBalance = () => (
    <div className="space-y-6">
      <Card>
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Trial Balance Report</h3>
          <p className="mt-1 text-sm text-gray-500">
            Summary of all account balances as of the reporting period end
          </p>
          <div className="mt-6">
            <Button className="flex items-center gap-2">
              <Download size={18} />
              Generate Trial Balance
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderGLBatches = () => (
    <div className="space-y-6">
      <Card>
        <div className="text-center py-12">
          <Layers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">GL Batch Processing</h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage journal entry batches and automated postings
          </p>
          <div className="mt-6">
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Create Batch
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
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
        {activeTab === 'accounts' && renderChartOfAccounts()}
        {activeTab === 'batches' && renderGLBatches()}
        {activeTab === 'transactions' && renderGLTransactions()}
        {activeTab === 'trial-balance' && renderTrialBalance()}
      </div>
    </div>
  );
}
