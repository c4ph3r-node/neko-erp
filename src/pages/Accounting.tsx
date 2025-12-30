import React, { useState } from 'react';
import { Plus, Search, BookOpen, TrendingUp, Edit, Trash2, Eye, FileText, Calculator, Download, CheckCircle, X, ArrowUpDown, Building2, DollarSign, BarChart3, AlertTriangle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import AccountForm from '../components/Forms/AccountForm';
import JournalEntryForm from '../components/Forms/JournalEntryForm';
import { useGlobalState } from '../contexts/GlobalStateContext';
import { getCountryTaxConfig } from '../lib/eastAfricanTaxConfigs';

export default function Accounting() {
  const { 
    state,
    addAccount, 
    updateAccount, 
    deleteAccount, 
    addJournalEntry, 
    updateJournalEntry, 
    postJournalEntry,
    reverseJournalEntry,
    generateReport,
    exportData,
    submitToTaxAuthority,
    showNotification,
    formatCurrency,
    t
  } = useGlobalState();

  const currentTaxConfig = getCountryTaxConfig(state.taxSettings.countryCode);

  const [activeTab, setActiveTab] = useState('accounts');
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showJournalViewModal, setShowJournalViewModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [editingJournal, setEditingJournal] = useState<any>(null);
  const [viewingJournal, setViewingJournal] = useState<any>(null);

  const filteredAccounts = state.accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.code.includes(searchTerm) ||
                         account.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = accountTypeFilter === 'all' || account.type === accountTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredJournalEntries = state.journalEntries.filter(entry =>
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

  const handleViewAccount = (accountId: string) => {
    const account = state.accounts.find(a => a.id === accountId);
    if (account) {
      // Show account details with transaction history
      const relatedEntries = state.journalEntries.filter(je => 
        je.lines.some(line => line.accountId === accountId)
      );
      
      alert(`Account Details:\n\nCode: ${account.code}\nName: ${account.name}\nType: ${account.type}\nBalance: KES ${account.balance.toLocaleString()}\nKRA Category: ${account.kraReportingCategory}\n\nRelated Transactions: ${relatedEntries.length}`);
    }
  };

  const handleSubmitAccount = (accountData: any) => {
    if (editingAccount) {
      updateAccount(editingAccount.id, accountData);
      showNotification(t('accountUpdatedSuccessfully'), 'success', 'system');
    } else {
      addAccount(accountData);
      showNotification(t('accountCreatedSuccessfully'), 'success', 'system');
    }
    setShowAccountModal(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId: string) => {
    const account = state.accounts.find(a => a.id === accountId);
    if (account?.balance !== 0) {
      alert(t('cannotDeleteAccountWithBalance') + formatCurrency(account.balance));
      return;
    }
    if (confirm(t('confirmDeleteAccount'))) {
      deleteAccount(accountId);
      showNotification(t('accountDeletedSuccessfully'), 'success', 'system');
    }
  };

  // Journal Entry CRUD Operations
  const handleAddJournalEntry = () => {
    setEditingJournal(null);
    setShowJournalModal(true);
  };

  const handleEditJournalEntry = (entry: any) => {
    if (entry.status === 'posted') {
      alert(t('cannotEditPostedEntries'));
      return;
    }
    setEditingJournal(entry);
    setShowJournalModal(true);
  };

  const handleViewJournalEntry = (entryId: string) => {
    const entry = state.journalEntries.find(je => je.id === entryId);
    if (entry) {
      setViewingJournal(entry);
      setShowJournalViewModal(true);
    }
  };

  const handleSubmitJournalEntry = (entryData: any) => {
    if (editingJournal) {
      updateJournalEntry(editingJournal.id, entryData);
      showNotification(t('journalEntryUpdatedSuccessfully'), 'success', 'system');
    } else {
      addJournalEntry(entryData);
      showNotification(t('journalEntryCreatedSuccessfully'), 'success', 'system');
    }
    setShowJournalModal(false);
    setEditingJournal(null);
  };

  const handleDeleteJournalEntry = (entryId: string) => {
    const entry = state.journalEntries.find(je => je.id === entryId);
    if (entry?.status === 'posted') {
      alert(t('cannotDeletePostedEntries'));
      return;
    }
    if (confirm(t('confirmDeleteJournalEntry'))) {
      // Implementation for deleting journal entry
      console.log('Deleting journal entry:', entryId);
    }
  };

  const handlePostJournalEntry = (entryId: string) => {
    if (confirm('Are you sure you want to post this journal entry? Posted entries cannot be edited.')) {
      postJournalEntry(entryId);
      showNotification(t('journalEntryPostedSuccessfully'), 'success', 'system');
    }
  };

  const handleReverseJournalEntry = (entryId: string) => {
    if (confirm('Are you sure you want to reverse this journal entry? This will create a reversing entry.')) {
      reverseJournalEntry(entryId);
    }
  };

  const handleSubmitToTaxAuthority = async (entryId: string) => {
    const success = await submitToTaxAuthority('journal_entry', entryId);
    if (success) {
      showNotification(t('journalEntrySubmittedToKra'), 'success');
    } else {
      showNotification(t('failedToSubmitToKra'), 'error');
    }
  };

  const handleBulkSubmitToTaxAuthority = async () => {
    const unsubmittedEntries = state.journalEntries.filter(je => !je.kraSubmitted && je.status === 'posted');
    if (unsubmittedEntries.length === 0) {
      showNotification(t('unsubmittedJournalEntries'), 'info');
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const entry of unsubmittedEntries) {
      const success = await submitToTaxAuthority('journal_entry', entry.id);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
    }

    if (successCount > 0) {
      showNotification(t('journalEntriesSubmittedToKra', { count: successCount }), 'success');
    }
    if (failureCount > 0) {
      showNotification(`${failureCount} journal entries failed to submit to KRA`, 'error');
    }
  };

  const handleGenerateTrialBalance = () => {
    const trialBalance = generateReport('trial_balance', {});
    const totalDebits = trialBalance.reduce((sum: number, acc: any) => sum + acc.debit, 0);
    const totalCredits = trialBalance.reduce((sum: number, acc: any) => sum + acc.credit, 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
    
    alert(`Trial Balance Generated!\n\nTotal Accounts: ${trialBalance.length}\nTotal Debits: KES ${totalDebits.toLocaleString()}\nTotal Credits: KES ${totalCredits.toLocaleString()}\nStatus: ${isBalanced ? 'BALANCED' : 'OUT OF BALANCE'}`);
  };

  const handleExportAccounts = (format: string) => {
    exportData('accounts', format as 'csv' | 'excel' | 'pdf');
  };

  const handleExportJournalEntries = (format: string) => {
    exportData('journal_entries', format as 'csv' | 'excel' | 'pdf');
  };

  const handleExportTrialBalance = (format: string) => {
    exportData('trial_balance', format as 'csv' | 'excel' | 'pdf');
  };

  // Calculate summary statistics
  const totalAssets = state.accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + Math.max(0, a.balance), 0);
  const totalLiabilities = Math.abs(state.accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0));
  const totalEquity = Math.abs(state.accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0));
  const totalRevenue = Math.abs(state.accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0));
  const unpostedEntries = state.journalEntries.filter(je => je.status === 'draft').length;
  const kraUnsubmitted = state.journalEntries.filter(je => !je.kraSubmitted && je.status === 'posted').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('generalLedgerAccounting')}</h1>
          <p className="text-gray-600">{t('comprehensiveAccountingSystem')}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleGenerateTrialBalance}>
            <Calculator className="w-4 h-4 mr-2" />
            {t('trialBalance')}
          </Button>
          <Button variant="secondary" onClick={() => handleExportTrialBalance('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            {t('exportTB')}
          </Button>
          <Button onClick={handleAddJournalEntry}>
            <Plus className="w-4 h-4 mr-2" />
            {t('journalEntry')}
          </Button>
        </div>
      </div>

      {/* KRA Compliance Alerts */}
      {kraUnsubmitted > 0 && (
        <Card>
          <div className="flex items-center p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">{t('kraSubmissionRequired')}</p>
              <p className="text-sm text-yellow-700">
                {t('postedJournalEntriesNeedSubmission', { count: kraUnsubmitted })}
              </p>
            </div>
            <Button size="sm" className="ml-auto" onClick={handleBulkSubmitToTaxAuthority}>
              {t('submitToKra')}
            </Button>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalAssets')}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalAssets)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalLiabilities')}</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalLiabilities)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600 transform rotate-180" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalEquity')}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(totalEquity)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalRevenue')}</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('unpostedEntries')}</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{unpostedEntries}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
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
            {t('chartOfAccounts', { count: state.accounts.length })}
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'journal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('journalEntries', { count: state.journalEntries.length })}
          </button>
          <button
            onClick={() => setActiveTab('trial_balance')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trial_balance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('trialBalanceTab')}
          </button>
          <button
            onClick={() => setActiveTab('kra_compliance')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'kra_compliance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('kraCompliance')}
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
                  placeholder={t('searchAccounts')}
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
                  <option value="all">{t('allTypes')}</option>
                  <option value="Asset">{t('assets')}</option>
                  <option value="Liability">{t('liabilities')}</option>
                  <option value="Equity">{t('equity')}</option>
                  <option value="Revenue">{t('revenue')}</option>
                  <option value="Expense">{t('expenses')}</option>
                </select>
                <Button variant="secondary" onClick={() => handleExportAccounts('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('exportCsv')}
                </Button>
                <Button variant="secondary" onClick={() => handleExportAccounts('excel')}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t('exportExcel')}
                </Button>
                <Button onClick={handleAddAccount}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addAccount')}
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
                      {t('accountCode')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('accountName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('type')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('kraCategory')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('balanceKes')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
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
                        <p className="text-sm text-gray-900">{account.kraReportingCategory}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`font-semibold ${getBalanceColor(account.balance, account.type)}`}>
                          {formatCurrency(Math.abs(account.balance))}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewAccount(account.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title={t('viewAccountDetails')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditAccount(account)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title={t('editAccount')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAccount(account.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title={t('deleteAccount')}
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
                  placeholder={t('searchJournalEntries')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => handleExportJournalEntries('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('exportCsv')}
                </Button>
                <Button variant="secondary" onClick={() => handleExportJournalEntries('excel')}>
                  <FileText className="w-4 h-4 mr-2" />
                  {t('exportExcel')}
                </Button>
                <Button onClick={handleAddJournalEntry}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('newJournalEntry')}
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
                      {t('date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('reference')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('description')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('totalKes')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('kraStatus')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
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
                          <p className="text-xs text-gray-500">By: {entry.createdBy} | Source: {entry.sourceModule}</p>
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
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          entry.kraSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.kraSubmitted ? 'SUBMITTED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewJournalEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title={t('viewEntryDetails')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {entry.status === 'draft' && (
                            <>
                              <button 
                                onClick={() => handleEditJournalEntry(entry)}
                                className="p-1 text-gray-500 hover:text-blue-600"
                                title={t('editEntry')}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handlePostJournalEntry(entry.id)}
                                className="p-1 text-gray-500 hover:text-green-600"
                                title={t('postEntry')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteJournalEntry(entry.id)}
                                className="p-1 text-gray-500 hover:text-red-600"
                                title={t('deleteEntry')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {entry.status === 'posted' && (
                            <>
                              <button 
                                onClick={() => handleReverseJournalEntry(entry.id)}
                                className="p-1 text-gray-500 hover:text-orange-600"
                                title={t('reverseEntry')}
                              >
                                <ArrowUpDown className="w-4 h-4" />
                              </button>
                              {!entry.kraSubmitted && (
                                <button 
                                  onClick={() => handleSubmitToTaxAuthority(entry.id)}
                                  className="p-1 text-gray-500 hover:text-purple-600"
                                  title={t('submitToKraAction')}
                                >
                                  <Building2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
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
            <h2 className="text-lg font-semibold text-gray-900">{t('trialBalanceTab')} - {new Date().toLocaleDateString()}</h2>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => handleExportTrialBalance('csv')}>
                <Download className="w-4 h-4 mr-2" />
                {t('exportCsv')}
              </Button>
              <Button variant="secondary" onClick={() => handleExportTrialBalance('excel')}>
                <FileText className="w-4 h-4 mr-2" />
                {t('exportExcel')}
              </Button>
              <Button variant="secondary" onClick={() => handleExportTrialBalance('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                {t('exportPdf')}
              </Button>
              <Button onClick={handleGenerateTrialBalance}>
                <Calculator className="w-4 h-4 mr-2" />
                {t('refresh')}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('accountCode')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('accountName')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('type')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('debitKes')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('creditKes')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.accounts.map((account) => (
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
                      {state.accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-gray-900">
                      {state.accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0).toLocaleString()}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* KRA Compliance Tab */}
      {activeTab === 'kra_compliance' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('kraComplianceDashboard')}</h2>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={handleBulkSubmitToTaxAuthority}>
                  <Building2 className="w-4 h-4 mr-2" />
                  {t('bulkSubmitToKra')}
                </Button>
                <Button onClick={() => navigate('/tax-compliance')}>
                  <Calculator className="w-4 h-4 mr-2" />
                  {t('kraSettings')}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-600">{t('kraPin')}</p>
                <p className="text-lg font-bold text-blue-900">{state.taxSettings.taxRegistrationNumber}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-600">{t('vatRegistration')}</p>
                <p className="text-lg font-bold text-green-900">{state.taxSettings.vatRegistrationNumber}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-600">{t('pendingSubmissions')}</p>
                <p className="text-lg font-bold text-yellow-900">{kraUnsubmitted}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-600">{t('vatRate')}</p>
                <p className="text-lg font-bold text-purple-900">{currentTaxConfig?.vatRate || 16}%</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (KES)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KRA Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {state.journalEntries.filter(je => je.status === 'posted').map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{entry.reference}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.sourceModule}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.date.toISOString().split('T')[0]}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-gray-900">{entry.totalDebit.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          entry.kraSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.kraSubmitted ? 'SUBMITTED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          {!entry.kraSubmitted && (
                            <button 
                              onClick={() => handleSubmitToTaxAuthority(entry.id)}
                              className="p-1 text-gray-500 hover:text-green-600"
                              title="Submit to KRA"
                            >
                              <Building2 className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleViewJournalEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
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

      {/* Modals */}
      <Modal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title={editingAccount ? t('editAccount') : t('addAccount')}
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
        title={editingJournal ? t('editEntry') : t('newJournalEntry')}
        size="xl"
      >
        <JournalEntryForm
          journalEntry={editingJournal}
          accounts={state.accounts}
          onSubmit={handleSubmitJournalEntry}
          onCancel={() => setShowJournalModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showJournalViewModal}
        onClose={() => setShowJournalViewModal(false)}
        title={t('journalEntryDetails')}
        size="lg"
      >
        {viewingJournal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('reference')}</label>
                <p className="mt-1 text-sm text-gray-900">{viewingJournal.reference}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('date')}</label>
                <p className="mt-1 text-sm text-gray-900">{new Date(viewingJournal.date).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
                <p className="mt-1 text-sm text-gray-900">{viewingJournal.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('status')}</label>
                <p className="mt-1 text-sm text-gray-900">{viewingJournal.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('kraSubmitted')}</label>
                <p className="mt-1 text-sm text-gray-900">{viewingJournal.kraSubmitted ? t('yes') : t('no')}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('lines')}</label>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('accountCode')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('accountName')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('debit')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('credit')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewingJournal.lines.map((line: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.accountCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.accountName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{formatCurrency(line.debit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{formatCurrency(line.credit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}