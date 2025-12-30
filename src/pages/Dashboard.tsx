import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  AlertTriangle,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import { useGlobalState } from '../contexts/GlobalStateContext';
import { useTenant } from '../contexts/TenantContext';
import { getCountryTaxConfig } from '../lib/eastAfricanTaxConfigs';

export default function Dashboard() {
  const { state, formatCurrency, t } = useGlobalState();
  const { tenant, checkTrialStatus } = useTenant();
  const navigate = useNavigate();

  const trialStatus = checkTrialStatus();
  const currentTaxConfig = getCountryTaxConfig(state.taxSettings.countryCode);

  // Calculate real metrics from actual data
  const totalRevenue = Math.abs(state.accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0));
  const totalExpenses = state.accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
  const netIncome = totalRevenue - totalExpenses;
  const outstandingInvoices = state.invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.total - i.paidAmount), 0);
  const activeCustomers = state.customers.filter(c => c.isActive).length;
  const cashBalance = state.accounts.filter(a => a.code.startsWith('10')).reduce((sum, a) => sum + a.balance, 0);

  const metrics = [
    {
      title: t('totalRevenue'),
      value: formatCurrency(totalRevenue),
      change: '+12.5%',
      trending: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: t('outstandingInvoices'),
      value: formatCurrency(outstandingInvoices),
      change: '-8.2%',
      trending: 'down',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: t('activeCustomers'),
      value: activeCustomers.toString(),
      change: '+5.1%',
      trending: 'up',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: t('cashBalance'),
      value: formatCurrency(cashBalance),
      change: '+2.4%',
      trending: 'up',
      icon: CreditCard,
      color: 'text-orange-600'
    }
  ];

  const recentTransactions = [
    { id: 1, description: 'Invoice INV-001 - Safaricom PLC', amount: `+${formatCurrency(state.invoices[0]?.total || 0)}`, date: '2025-01-15', type: 'income' },
    { id: 2, description: 'KPLC Electricity Bill', amount: `-${formatCurrency(58000)}`, date: '2025-01-14', type: 'expense' },
    { id: 3, description: 'Customer Payment - Equity Bank', amount: `+${formatCurrency(103820)}`, date: '2025-01-14', type: 'income' },
    { id: 4, description: 'Marketing Campaign', amount: `-${formatCurrency(125000)}`, date: '2025-01-13', type: 'expense' },
    { id: 5, description: 'Consulting Services', amount: `+${formatCurrency(245000)}`, date: '2025-01-12', type: 'income' }
  ];

  // KRA Compliance Status
  const kraCompliance = {
    vatSubmissions: state.journalEntries.filter(je => je.kraSubmitted).length,
    pendingSubmissions: state.journalEntries.filter(je => !je.kraSubmitted && je.status === 'posted').length,
    complianceScore: 85
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600">{t('welcome')} {tenant?.name}! {t('businessOverview')}.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {t('lastUpdated')}: {new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
          </div>
          {tenant?.status === 'trial' && (
            <div className={`text-sm font-medium ${trialStatus.daysRemaining <= 7 ? 'text-red-600' : 'text-blue-600'}`}>
              {t('trial')}: {trialStatus.daysRemaining} {t('daysRemaining')}
            </div>
          )}
        </div>
      </div>

      {/* Trial Status Alert */}
      {tenant?.status === 'trial' && trialStatus.daysRemaining <= 7 && (
        <Card>
          <div className="flex items-center p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">{t('trialEndingSoon')}</p>
              <p className="text-sm text-yellow-700">
                {t('trialExpires').replace('{days}', trialStatus.daysRemaining.toString())}
              </p>
            </div>
            <button 
              onClick={() => navigate('/settings')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {t('upgradeNow')}
            </button>
          </div>
        </Card>
      )}

      {/* KRA Compliance Alert */}
      {kraCompliance.pendingSubmissions > 0 && (
        <Card>
          <div className="flex items-center p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">{t('kraComplianceAlert')}</p>
              <p className="text-sm text-yellow-700">
                {t('transactionsPending').replace('{count}', kraCompliance.pendingSubmissions.toString())}
              </p>
            </div>
            <button 
              onClick={() => navigate('/tax-compliance')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {t('reviewNow')}
            </button>
          </div>
        </Card>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className="flex items-center mt-2">
                  {metric.trending === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    metric.trending === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('recentTransactions')}</h2>
              <button 
                onClick={() => navigate('/banking')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('viewAll')}
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions & KRA Status */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/estimates')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Create Invoice</span>
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
              </button>
              <button 
                onClick={() => navigate('/customers')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Add Customer</span>
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
              </button>
              <button 
                onClick={() => navigate('/banking')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Record Payment</span>
                  <DollarSign className="w-4 h-4 text-gray-500" />
                </div>
              </button>
              <button 
                onClick={() => navigate('/accounting')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Journal Entry</span>
                  <BookOpen className="w-4 h-4 text-gray-500" />
                </div>
              </button>
            </div>
          </Card>

          {/* KRA Compliance Status */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">KRA Compliance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Tax Registration</span>
                </div>
                <span className="font-semibold text-gray-900">{state.taxSettings.taxRegistrationNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">VAT Registration</span>
                </div>
                <span className="font-semibold text-gray-900">{state.taxSettings.vatRegistrationNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Compliance Score</span>
                </div>
                <span className="font-semibold text-green-600">{kraCompliance.complianceScore}%</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('pendingKrasubmissions')}</span>
                  <span className={`font-bold ${kraCompliance.pendingSubmissions > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {kraCompliance.pendingSubmissions}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Cash Flow Summary */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('cashFlow')} ({state.settings.currency})</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">{t('moneyIn')}</span>
                </div>
                <span className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">{t('moneyOut')}</span>
                </div>
                <span className="font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{t('netCashFlow')}</span>
                  <span className={`font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netIncome >= 0 ? '+' : ''}{formatCurrency(Math.abs(netIncome))}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}