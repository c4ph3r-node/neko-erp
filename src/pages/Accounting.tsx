import React, { useState } from 'react';
import { Plus, Search, BookOpen, TrendingUp, Edit, Trash2, Eye, FileText, Calculator, Download, CheckCircle, X, ArrowUpDown } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import AccountForm from '../components/Forms/AccountForm';
import JournalEntryForm from '../components/Forms/JournalEntryForm';
import { useData } from '../contexts/DataContext';

export default function Accounting() {
  const { 
    accounts, 
    journalEntries, 
    addAccount, 
    updateAccount, 
    deleteAccount, 
    addJournalEntry, 
    updateJournalEntry, 
    deleteJournalEntry,
    postJournalEntry,
    reverseJournalEntry,
    generateReport,
    exportData
  } = useData();

  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [editingJournal, setEditingJournal] = useState<any>(null);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.code.includes(searchTerm) ||
                         account.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = accountTypeFilter === 'all' || account.type === accountTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredJournalEntries = journalEntries.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBalanceColor = (balance: number, type: string) => {
    if (type === 'Asset' || type === 'Expense') {
      return balance >= 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return balance >= 0 ? 'text-blue-600' : 'text-green-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'reversed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Account CRUD Operations
  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowAccountModal(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setShowAccountModal(true);
  };

  const handleViewAccount = (accountId: number) => {
    const account = accounts.find(a => a.id === accountId);
    if (account) {
      setEditingAccount(account);
      setShowAccountModal(true);
    }
  };

  const handleSubmitAccount = (accountData: any) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, accountData);
    } else {
      addAccount(accountData);
    }
    setShowAccountModal(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId: number) => {
    const account = accounts.find(a => a.id === accountId);
    if (account?.balance !== 0) {
      alert('Cannot delete account with non-zero balance');
      return;
    }
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      deleteAccount(accountId);
    }
  };

  // Journal Entry CRUD Operations
  const handleAddJournalEntry = () => {
    setEditingJournal(null);
    setShowJournalModal(true);
  };

  const handleEditJournalEntry = (entry: any) => {
    if (entry.status === 'posted') {
      alert('Cannot edit posted journal entries. Please reverse and create a new entry.');
      return;
    }
    setEditingJournal(entry);
    setShowJournalModal(true);
  };

  const handleViewJournalEntry = (entryId: number) => {
    const entry = journalEntries.find(je => je.id === entryId);
    if (entry) {
      setEditingJournal(entry);
      setShowJournalModal(true);
    }
  };

  const handleSubmitJournalEntry = (entryData: any) => {
    if (editingJournal) {
      updateJournalEntry(editingJournal.id, entryData);
    } else {
      addJournalEntry(entryData);
    }
    setShowJournalModal(false);
    setEditingJournal(null);
  };

  const handleDeleteJournalEntry = (entryId: number) => {
    const entry = journalEntries.find(je => je.id === entryId);
    if (entry?.status === 'posted') {
      alert('Cannot delete posted journal entries. Please reverse the entry instead.');
      return;
    }
    if (confirm('Are you sure you want to delete this journal entry?')) {
      deleteJournalEntry(entryId);
    }
  };

  const handlePostJournalEntry = (entryId: number) => {
    if (confirm('Are you sure you want to post this journal entry? Posted entries cannot be edited.')) {
      postJournalEntry(entryId);
    }
  };

  const handleReverseJournalEntry = (entryId: number) => {
    if (confirm('Are you sure you want to reverse this journal entry? This will create a reversing entry.')) {
      reverseJournalEntry(entryId);
    }
  };

  const handleGenerateTrialBalance = () => {
    const trialBalance = generateReport('trial_balance', {});
    alert(`Trial Balance Generated!\n\nTotal Accounts: ${trialBalance.length}\nTotal Debits: KES ${trialBalance.reduce((sum: number, acc: any) => sum + acc.debit, 0).toLocaleString()}\nTotal Credits: KES ${trialBalance.reduce((sum: number, acc: any) => sum + acc.credit, 0).toLocaleString()}`);
  };

  const handleExportAccounts = (format: string) => {
    exportData('accounts', format);
  };

  const handleExportJournalEntries = (format: string) => {
    exportData('journal_entries', format);
  };

  const handleExportTrialBalance = (format: string) => {
    exportData('trial_balance', format);
  };

  // Calculate summary statistics
  const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + Math.max(0, a.balance), 0);
  const totalLiabilities = Math.abs(accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0));
  const totalEquity = accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const totalRevenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + Math.abs(a.balance), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Ledger & Accounting</h1>
          <p className="text-gray-600">Manage chart of accounts, journal entries, and financial records</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleGenerateTrialBalance}>
            <Calculator className="w-4 h-4 mr-2" />
            Trial Balance
          </Button>
          <Button variant="secondary" onClick={() => handleExportTrialBalance('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export TB
          </Button>
          <Button onClick={handleAddJournalEntry}>
            <Plus className="w-4 h-4 mr-2" />
            Journal Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-green-600 mt-1">KES {totalAssets.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
              <p className="text-2xl font-bold text-red-600 mt-1">KES {totalLiabilities.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600 transform rotate-180" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Equity</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">KES {totalEquity.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">KES {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
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
          <button
            onClick={() => setActiveTab('trial_balance')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trial_balance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trial Balance
          </button>
        </nav>
      </div>

      {/* Chart of Accounts Tab */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
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
              <div className="flex items-center space-x-4">
                <select 
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Asset">Assets</option>
                  <option value="Liability">Liabilities</option>
                  <option value="Equity">Equity</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expenses</option>
                </select>
                <Button variant="secondary" onClick={() => handleExportAccounts('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleAddAccount}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </div>
          </Card>

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sub Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance (KES)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
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
                        <div>
                          <p className="text-gray-900">{account.name}</p>
                          {account.description && (
                            <p className="text-sm text-gray-500">{account.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          {account.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{account.subType}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`font-semibold ${getBalanceColor(account.balance, account.type)}`}>
                          {Math.abs(account.balance).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewAccount(account.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="View Account"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditAccount(account)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="Edit Account"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAccount(account.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Journal Entries Tab */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => handleExportJournalEntries('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleAddJournalEntry}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Journal Entry
                </Button>
              </div>
            </div>
          </Card>

          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total (KES)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJournalEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{entry.date.toISOString().split('T')[0]}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{entry.reference}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{entry.description}</p>
                          <p className="text-xs text-gray-500">By: {entry.createdBy}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.totalDebit.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                          {entry.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewJournalEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="View Entry"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {entry.status === 'draft' && (
                            <>
                              <button 
                                onClick={() => handleEditJournalEntry(entry)}
                                className="p-1 text-gray-500 hover:text-blue-600"
                                title="Edit Entry"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handlePostJournalEntry(entry.id)}
                                className="p-1 text-gray-500 hover:text-green-600"
                                title="Post Entry"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteJournalEntry(entry.id)}
                                className="p-1 text-gray-500 hover:text-red-600"
                                title="Delete Entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {entry.status === 'posted' && (
                            <button 
                              onClick={() => handleReverseJournalEntry(entry.id)}
                              className="p-1 text-gray-500 hover:text-orange-600"
                              title="Reverse Entry"
                            >
                              <ArrowUpDown className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Trial Balance Tab */}
      {activeTab === 'trial_balance' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Trial Balance</h2>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => handleExportTrialBalance('excel')}>
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="secondary" onClick={() => handleExportTrialBalance('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={handleGenerateTrialBalance}>
                <Calculator className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

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
                    Debit (KES)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit (KES)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => (
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
                      <p className="text-sm text-gray-900">
                        {account.balance > 0 ? account.balance.toLocaleString() : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-gray-900">
                        {account.balance < 0 ? Math.abs(account.balance).toLocaleString() : '-'}
                      </p>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan={3} className="px-6 py-4 text-right">
                    <p className="font-bold text-gray-900">TOTALS:</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-gray-900">
                      {accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-gray-900">
                      {accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0).toLocaleString()}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title={editingAccount ? 'Edit Account' : 'Add New Account'}
        size="lg"
      >
        <AccountForm
          account={editingAccount}
          onSubmit={handleSubmitAccount}
          onCancel={() => setShowAccountModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        title={editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
        size="xl"
      >
        <JournalEntryForm
          journalEntry={editingJournal}
          accounts={accounts}
          onSubmit={handleSubmitJournalEntry}
          onCancel={() => setShowJournalModal(false)}
        />
      </Modal>
    </div>
  );
}