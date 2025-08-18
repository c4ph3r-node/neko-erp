import React, { useState } from 'react';
import { Plus, Search, BookOpen, TrendingUp } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const chartOfAccounts = [
  { id: 1, code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 125450.00 },
  { id: 2, code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 23840.00 },
  { id: 3, code: '1500', name: 'Inventory', type: 'Asset', balance: 45600.00 },
  { id: 4, code: '2000', name: 'Accounts Payable', type: 'Liability', balance: -18500.00 },
  { id: 5, code: '2100', name: 'Short-term Loans', type: 'Liability', balance: -25000.00 },
  { id: 6, code: '3000', name: 'Owner\'s Equity', type: 'Equity', balance: 100000.00 },
  { id: 7, code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 180500.00 },
  { id: 8, code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: -75200.00 },
  { id: 9, code: '6000', name: 'Operating Expenses', type: 'Expense', balance: -28400.00 }
];

const recentJournalEntries = [
  {
    id: 1,
    date: '2025-01-15',
    reference: 'JE-001',
    description: 'Sales Invoice #1001 - Acme Corp',
    debit: 5250.00,
    credit: 0,
    account: 'Accounts Receivable'
  },
  {
    id: 2,
    date: '2025-01-15',
    reference: 'JE-001',
    description: 'Sales Invoice #1001 - Acme Corp',
    debit: 0,
    credit: 5250.00,
    account: 'Sales Revenue'
  },
  {
    id: 3,
    date: '2025-01-14',
    reference: 'JE-002',
    description: 'Office Supplies Purchase',
    debit: 342.00,
    credit: 0,
    account: 'Operating Expenses'
  },
  {
    id: 4,
    date: '2025-01-14',
    reference: 'JE-002',
    description: 'Office Supplies Purchase',
    debit: 0,
    credit: 342.00,
    account: 'Cash and Cash Equivalents'
  }
];

export default function Accounting() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = chartOfAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.includes(searchTerm) ||
    account.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalanceColor = (balance: number, type: string) => {
    if (type === 'Asset' || type === 'Expense') {
      return balance >= 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return balance >= 0 ? 'text-green-600' : 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
          <p className="text-gray-600">Manage your chart of accounts and journal entries</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <BookOpen className="w-4 h-4 mr-2" />
            Trial Balance
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Journal Entry
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accounts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Chart of Accounts
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'journal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Journal Entries
          </button>
        </nav>
      </div>

      {/* Chart of Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </div>
          </Card>

          {/* Accounts Table */}
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{account.code}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{account.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {account.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`font-semibold ${getBalanceColor(account.balance, account.type)}`}>
                          ${Math.abs(account.balance).toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Journal Entries Tab */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Journal Entries</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Journal Entry
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentJournalEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.date}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{entry.reference}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.account}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.description}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">
                          {entry.debit > 0 ? `$${entry.debit.toFixed(2)}` : '-'}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">
                          {entry.credit > 0 ? `$${entry.credit.toFixed(2)}` : '-'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}