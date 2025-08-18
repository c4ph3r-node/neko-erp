import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Card from '../components/UI/Card';

const metrics = [
  {
    title: 'Total Revenue',
    value: '$127,350',
    change: '+12.5%',
    trending: 'up',
    icon: DollarSign,
    color: 'text-green-600'
  },
  {
    title: 'Outstanding Invoices',
    value: '$23,840',
    change: '-8.2%',
    trending: 'down',
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    title: 'Active Customers',
    value: '248',
    change: '+5.1%',
    trending: 'up',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    title: 'Monthly Expenses',
    value: '$18,590',
    change: '+2.4%',
    trending: 'up',
    icon: CreditCard,
    color: 'text-orange-600'
  }
];

const recentTransactions = [
  { id: 1, description: 'Invoice #1001 - Acme Corp', amount: '+$5,250', date: '2025-01-15', type: 'income' },
  { id: 2, description: 'Office Supplies', amount: '-$342', date: '2025-01-14', type: 'expense' },
  { id: 3, description: 'Invoice #1002 - TechStart Inc', amount: '+$3,800', date: '2025-01-14', type: 'income' },
  { id: 4, description: 'Marketing Campaign', amount: '-$1,200', date: '2025-01-13', type: 'expense' },
  { id: 5, description: 'Consulting Services', amount: '+$2,100', date: '2025-01-12', type: 'income' }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

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
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button 
                onClick={() => window.location.href = '/banking'}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
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

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/invoices'}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Create Invoice</span>
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
              </button>
              <button 
                onClick={() => window.location.href = '/customers'}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Add Customer</span>
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
              </button>
              <button 
                onClick={() => window.location.href = '/banking'}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Record Payment</span>
                  <DollarSign className="w-4 h-4 text-gray-500" />
                </div>
              </button>
            </div>
          </Card>

          {/* Cash Flow Summary */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Money In</span>
                </div>
                <span className="font-semibold text-green-600">$45,200</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Money Out</span>
                </div>
                <span className="font-semibold text-red-600">$28,400</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Net Cash Flow</span>
                  <span className="font-bold text-green-600">+$16,800</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}