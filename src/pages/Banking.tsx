import React, { useState } from 'react';
import { Plus, Search, CreditCard, TrendingUp, TrendingDown, RefreshCw, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import BankAccountForm from '../components/Forms/BankAccountForm';
import TransactionForm from '../components/Forms/TransactionForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

export default function Banking() {
  const { syncWithBanks, showNotification, state, formatCurrency, t } = useGlobalState();
  const navigate = useNavigate();
  
  const mockBankAccounts = [
    {
      id: 1,
      name: 'Business Checking',
      accountNumber: '****1234',
      bankName: 'First National Bank',
      accountType: 'checking',
      balance: 45250.75,
      currency: state.settings.currency,
      isDefault: true,
      lastSync: '2025-01-15 09:30 AM'
    },
    {
      id: 2,
      name: 'Business Savings',
      accountNumber: '****5678',
      bankName: 'First National Bank',
      accountType: 'savings',
      balance: 125000.00,
      currency: state.settings.currency,
      isDefault: false,
      lastSync: '2025-01-15 09:30 AM'
    },
    {
      id: 3,
      name: 'Petty Cash',
      accountNumber: 'CASH-001',
      bankName: 'Cash Account',
      accountType: 'cash',
      balance: 500.00,
      currency: state.settings.currency,
      isDefault: false,
      lastSync: '2025-01-15 10:00 AM'
    }
  ];

  const mockTransactions = [
    {
      id: 1,
      date: '2025-01-15',
      description: 'Customer Payment - INV-001',
      reference: 'DEP-001',
      debit: 0,
      credit: 5250.00,
      balance: 45250.75,
      status: 'cleared',
      category: 'Income'
    },
    {
      id: 2,
      date: '2025-01-14',
      description: 'Office Supplies Purchase',
      reference: 'CHK-1234',
      debit: 342.00,
      credit: 0,
      balance: 40000.75,
      status: 'cleared',
      category: 'Expenses'
    },
    {
      id: 3,
      date: '2025-01-14',
      description: 'Monthly Rent Payment',
      reference: 'ACH-5678',
      debit: 2500.00,
      credit: 0,
      balance: 40342.75,
      status: 'pending',
      category: 'Expenses'
    },
    {
      id: 4,
      date: '2025-01-13',
      description: 'Customer Payment - INV-002',
      reference: 'DEP-002',
      debit: 0,
      credit: 3800.00,
      balance: 42842.75,
      status: 'cleared',
      category: 'Income'
    }
  ];

  const [selectedAccount, setSelectedAccount] = useState(mockBankAccounts[0]);
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  const filteredTransactions = mockTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = mockBankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = filteredTransactions.filter(t => t.credit > 0).reduce((sum, t) => sum + t.credit, 0);
  const monthlyExpenses = filteredTransactions.filter(t => t.debit > 0).reduce((sum, t) => sum + t.debit, 0);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowAccountModal(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setShowAccountModal(true);
  };

  const handleSubmitAccount = (accountData: any) => {
    showNotification('Bank account saved successfully', 'success');
    setShowAccountModal(false);
    setEditingAccount(null);
  };

  const handleAddTransaction = () => {
    setShowTransactionModal(true);
  };

  const handleSubmitTransaction = (transactionData: any) => {
    showNotification('Transaction saved successfully', 'success');
    setShowTransactionModal(false);
  };

  const handleSyncBanks = async () => {
    try {
      await syncWithBanks();
      showNotification(t('bankAccountsSynchronizedSuccessfully'), 'success');
    } catch (error) {
      showNotification(t('failedToSyncBankAccounts'), 'error');
    }
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('banking')}</h1>
          <p className="text-gray-600">{t('manageBankAccountsAndTransactions')}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleSyncBanks}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('syncBanks')}
          </Button>
          <Button onClick={handleAddAccount}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addAccount')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalBalance')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBalance)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('monthlyIncome')}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(monthlyIncome)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('monthlyExpenses')}</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(monthlyExpenses)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('netCashFlow')}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(monthlyIncome - monthlyExpenses)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Bank Accounts Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{t('bankAccounts')}</h2>
              <Button size="sm" onClick={handleAddAccount}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {mockBankAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedAccount.id === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{account.name}</p>
                    {account.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {t('default')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{account.bankName}</p>
                  <p className="text-sm text-gray-600">{account.accountNumber}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('lastSync')}: {account.lastSync}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('transactions')}
              </button>
              <button
                onClick={() => setActiveTab('reconciliation')}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reconciliation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('reconciliation')}
              </button>
            </nav>
          </div>

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Search and Actions */}
              <Card>
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder={t('searchTransactions')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      {t('export')}
                    </Button>
                    <Button size="sm" onClick={handleAddTransaction}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('addTransaction')}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Transactions Table */}
              <Card padding={false}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('date')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('description')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('reference')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('debit')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('credit')}
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('balance')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{transaction.date}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.category}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{transaction.reference}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm text-red-600">
                              {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm text-green-600">
                              {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(transaction.balance)}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.status === 'cleared' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Reconciliation Tab */}
          {activeTab === 'reconciliation' && (
            <Card>
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bank Reconciliation</h3>
                <p className="text-gray-600 mb-4">Reconcile your bank statements with your records</p>
                <Button>Start Reconciliation</Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        title={editingAccount ? t('editBankAccount') : t('addNewBankAccount')}
        size="lg"
      >
        <BankAccountForm
          account={editingAccount}
          onSubmit={handleSubmitAccount}
          onCancel={() => setShowAccountModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title={t('addBankTransaction')}
        size="lg"
      >
        <TransactionForm
          onSubmit={handleSubmitTransaction}
          onCancel={() => setShowTransactionModal(false)}
        />
      </Modal>
    </div>
  );
}