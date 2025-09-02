import React, { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, Target, BarChart3, Calendar, DollarSign, Percent, AlertTriangle, Edit, Eye, Copy, Trash2, Calculator } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import BudgetForm from '../components/Forms/BudgetForm';

const mockBudgets = [
  {
    id: 1,
    name: 'Annual Budget 2025',
    period: '2025',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    totalBudget: 500000.00,
    actualSpent: 125000.00,
    variance: -375000.00,
    variancePercent: -75.0,
    categories: [
      { name: 'Revenue', budgeted: 600000.00, actual: 150000.00, variance: -450000.00 },
      { name: 'Cost of Goods Sold', budgeted: 240000.00, actual: 60000.00, variance: -180000.00 },
      { name: 'Operating Expenses', budgeted: 180000.00, actual: 45000.00, variance: -135000.00 },
      { name: 'Marketing', budgeted: 50000.00, actual: 15000.00, variance: -35000.00 },
      { name: 'R&D', budgeted: 30000.00, actual: 5000.00, variance: -25000.00 }
    ]
  },
  {
    id: 2,
    name: 'Q1 2025 Budget',
    period: 'Q1 2025',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    status: 'active',
    totalBudget: 125000.00,
    actualSpent: 85000.00,
    variance: -40000.00,
    variancePercent: -32.0,
    categories: [
      { name: 'Revenue', budgeted: 150000.00, actual: 100000.00, variance: -50000.00 },
      { name: 'Operating Expenses', budgeted: 45000.00, actual: 35000.00, variance: -10000.00 },
      { name: 'Marketing', budgeted: 12500.00, actual: 8000.00, variance: -4500.00 }
    ]
  },
  {
    id: 3,
    name: 'Marketing Campaign Budget',
    period: 'January 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'completed',
    totalBudget: 15000.00,
    actualSpent: 14200.00,
    variance: -800.00,
    variancePercent: -5.3,
    categories: [
      { name: 'Digital Advertising', budgeted: 8000.00, actual: 7500.00, variance: -500.00 },
      { name: 'Content Creation', budgeted: 4000.00, actual: 3800.00, variance: -200.00 },
      { name: 'Events', budgeted: 3000.00, actual: 2900.00, variance: -100.00 }
    ]
  }
];

const mockBudgetAlerts = [
  {
    id: 1,
    budgetName: 'Annual Budget 2025',
    category: 'Marketing',
    alertType: 'overspend',
    threshold: 80,
    currentSpending: 85,
    message: 'Marketing budget is 85% spent with 10 months remaining',
    severity: 'warning'
  },
  {
    id: 2,
    budgetName: 'Q1 2025 Budget',
    category: 'Operating Expenses',
    alertType: 'approaching_limit',
    threshold: 90,
    currentSpending: 88,
    message: 'Operating expenses approaching 90% of budget',
    severity: 'info'
  }
];

const mockForecast = [
  { month: 'Feb 2025', projected: 45000, actual: 0, variance: 0 },
  { month: 'Mar 2025', projected: 48000, actual: 0, variance: 0 },
  { month: 'Apr 2025', projected: 52000, actual: 0, variance: 0 },
  { month: 'May 2025', projected: 55000, actual: 0, variance: 0 }
];

export default function Budgeting() {
  const [activeTab, setActiveTab] = useState('budgets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [budgets, setBudgets] = useState(mockBudgets);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < -1000) return 'text-red-600';
    return 'text-yellow-600';
  };

  const totalBudgeted = filteredBudgets.reduce((sum, budget) => sum + budget.totalBudget, 0);
  const totalActual = filteredBudgets.reduce((sum, budget) => sum + budget.actualSpent, 0);
  const totalVariance = totalBudgeted - totalActual;
  const activeBudgets = filteredBudgets.filter(b => b.status === 'active').length;

  const handleAddBudget = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const handleViewBudget = (budgetId: number) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (budget) {
      setEditingBudget(budget);
      setShowModal(true);
    }
  };

  const handleSubmitBudget = (budgetData: any) => {
    if (editingBudget) {
      setBudgets(prev => prev.map(budget => budget.id === editingBudget.id ? { ...budget, ...budgetData } : budget));
    } else {
      const newBudget = { ...budgetData, id: Date.now() };
      setBudgets(prev => [...prev, newBudget]);
    }
    setShowModal(false);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (budgetId: number) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
    }
  };

  const handleCopyBudget = (budget: any) => {
    const copiedBudget = {
      ...budget,
      id: Date.now(),
      name: `${budget.name} (Copy)`,
      status: 'draft',
      actualSpent: 0,
      variance: budget.totalBudget
    };
    setBudgets(prev => [...prev, copiedBudget]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Planning & Analysis</h1>
          <p className="text-gray-600">Create budgets, track spending, and analyze financial performance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => console.log('Opening budget templates')}>
            <Target className="w-4 h-4 mr-2" />
            Budget Templates
          </Button>
          <Button variant="secondary" onClick={() => console.log('Generating budget reports')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Budget Reports
          </Button>
          <Button onClick={handleAddBudget}>
            <Plus className="w-4 h-4 mr-2" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgeted</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalBudgeted.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actual Spent</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">${totalActual.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Variance</p>
              <p className={`text-2xl font-bold mt-1 ${getVarianceColor(totalVariance)}`}>
                ${Math.abs(totalVariance).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              {totalVariance >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Budgets</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{activeBudgets}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Budget Alerts */}
      {mockBudgetAlerts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Budget Alerts</h2>
            <Button variant="secondary" size="sm" onClick={() => console.log('Managing alert settings')}>
              Configure Alerts
            </Button>
          </div>
          <div className="space-y-3">
            {mockBudgetAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className={`w-5 h-5 mr-2 ${
                      alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{alert.budgetName} - {alert.category}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{alert.currentSpending}%</p>
                    <p className="text-xs text-gray-500">of budget used</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('budgets')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'budgets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Budgets
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Budget Analysis
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'forecast' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Forecasting
          </button>
        </nav>
      </div>

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search budgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBudgets.map((budget) => (
              <Card key={budget.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{budget.name}</h3>
                      <p className="text-sm text-gray-600">{budget.period}</p>
                      <p className="text-sm text-gray-500">{budget.startDate} - {budget.endDate}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(budget.status)}`}>
                        {budget.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${budget.totalBudget.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Total Budget</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Actual Spent</p>
                      <p className="font-semibold text-orange-600">${budget.actualSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p className={`font-semibold ${getVarianceColor(budget.variance)}`}>
                        ${Math.abs(budget.variance).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Budget Utilization</span>
                      <span className="text-sm font-medium text-gray-900">
                        {((budget.actualSpent / budget.totalBudget) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (budget.actualSpent / budget.totalBudget) > 0.9 ? 'bg-red-600' :
                          (budget.actualSpent / budget.totalBudget) > 0.7 ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${Math.min((budget.actualSpent / budget.totalBudget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Budget Categories</h4>
                    <div className="space-y-2">
                      {budget.categories.slice(0, 3).map((category, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{category.name}</span>
                          <div className="text-right">
                            <span className="font-medium text-gray-900">${category.actual.toLocaleString()}</span>
                            <span className="text-gray-500"> / ${category.budgeted.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                      {budget.categories.length > 3 && (
                        <p className="text-xs text-gray-500">+{budget.categories.length - 3} more categories</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleViewBudget(budget.id)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleEditBudget(budget)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleCopyBudget(budget)}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDeleteBudget(budget.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Budget Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Budget vs Actual Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Budgeted</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% Used</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockBudgets[0]?.categories.map((category, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{category.name}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">${category.budgeted.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">${category.actual.toLocaleString()}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className={`text-sm font-medium ${getVarianceColor(category.variance)}`}>
                          ${Math.abs(category.variance).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {((category.actual / category.budgeted) * 100).toFixed(1)}%
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

      {/* Forecasting Tab */}
      {activeTab === 'forecast' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Budget Forecasting</h2>
            <Button onClick={() => console.log('Updating forecast')}>
              <Calculator className="w-4 h-4 mr-2" />
              Update Forecast
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Projected</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockForecast.map((forecast, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{forecast.month}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm text-gray-900">${forecast.projected.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm text-gray-900">
                        {forecast.actual > 0 ? `$${forecast.actual.toLocaleString()}` : 'TBD'}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm text-gray-900">
                        {forecast.actual > 0 ? `$${Math.abs(forecast.variance).toLocaleString()}` : '-'}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm text-gray-900">
                        {forecast.actual > 0 ? `${(100 - Math.abs(forecast.variance / forecast.projected) * 100).toFixed(1)}%` : '-'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBudget ? 'Edit Budget' : 'Create New Budget'}
        size="xl"
      >
        <BudgetForm
          budget={editingBudget}
          onSubmit={handleSubmitBudget}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}