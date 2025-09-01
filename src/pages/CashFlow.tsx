import React, { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, Calendar, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import CashFlowForecastForm from '../components/Forms/CashFlowForecastForm';

const mockCashFlowData = [
  {
    id: 1,
    date: '2025-01-15',
    description: 'Customer Payment - Acme Corp',
    category: 'Accounts Receivable',
    type: 'inflow',
    amount: 5250.00,
    actualAmount: 5250.00,
    status: 'actual',
    runningBalance: 125450.00
  },
  {
    id: 2,
    date: '2025-01-20',
    description: 'Rent Payment',
    category: 'Operating Expenses',
    type: 'outflow',
    amount: 2500.00,
    actualAmount: 0,
    status: 'projected',
    runningBalance: 122950.00
  },
  {
    id: 3,
    date: '2025-01-25',
    description: 'Payroll Processing',
    category: 'Payroll',
    type: 'outflow',
    amount: 87500.00,
    actualAmount: 0,
    status: 'projected',
    runningBalance: 35450.00
  },
  {
    id: 4,
    date: '2025-01-30',
    description: 'Customer Payment - TechStart Inc',
    category: 'Accounts Receivable',
    type: 'inflow',
    amount: 3800.00,
    actualAmount: 0,
    status: 'projected',
    runningBalance: 39250.00
  },
  {
    id: 5,
    date: '2025-02-05',
    description: 'Supplier Payment - Office Supplies',
    category: 'Accounts Payable',
    type: 'outflow',
    amount: 2750.00,
    actualAmount: 0,
    status: 'projected',
    runningBalance: 36500.00
  }
];

const mockCashFlowSummary = {
  currentBalance: 125450.00,
  projectedBalance30Days: 89250.00,
  projectedBalance60Days: 145600.00,
  projectedBalance90Days: 178900.00,
  totalInflows30Days: 45600.00,
  totalOutflows30Days: 81800.00,
  netCashFlow30Days: -36200.00
};

const mockCashFlowCategories = [
  { name: 'Accounts Receivable', inflow: 45600.00, outflow: 0, net: 45600.00 },
  { name: 'Accounts Payable', inflow: 0, outflow: 28500.00, net: -28500.00 },
  { name: 'Payroll', inflow: 0, outflow: 87500.00, net: -87500.00 },
  { name: 'Operating Expenses', inflow: 0, outflow: 15800.00, net: -15800.00 },
  { name: 'Loan Payments', inflow: 0, outflow: 5000.00, net: -5000.00 }
];

export default function CashFlow() {
  const [activeTab, setActiveTab] = useState('forecast');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [cashFlowData, setCashFlowData] = useState(mockCashFlowData);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const filteredCashFlow = cashFlowData.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    return type === 'inflow' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actual': return 'bg-green-100 text-green-800';
      case 'projected': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddCashFlowEntry = () => {
    setEditingEntry(null);
    setShowModal(true);
  };

  const handleEditCashFlowEntry = (entry: any) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const handleSubmitCashFlowEntry = (entryData: any) => {
    if (editingEntry) {
      setCashFlowData(prev => prev.map(entry => entry.id === editingEntry.id ? { ...entry, ...entryData } : entry));
    } else {
      const newEntry = { ...entryData, id: Date.now() };
      setCashFlowData(prev => [...prev, newEntry]);
    }
    setShowModal(false);
    setEditingEntry(null);
  };

  const handleDeleteCashFlowEntry = (entryId: number) => {
    if (confirm('Are you sure you want to delete this cash flow entry?')) {
      setCashFlowData(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const handleRefreshForecast = () => {
    console.log('Refreshing cash flow forecast...');
    // Implementation for refreshing forecast data
  };

  const handleExportCashFlow = () => {
    console.log('Exporting cash flow data...');
    // Implementation for exporting cash flow data
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cash Flow Management</h1>
          <p className="text-gray-600">Monitor and forecast your cash flow to ensure healthy liquidity</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleRefreshForecast}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Forecast
          </Button>
          <Button variant="secondary" onClick={handleExportCashFlow}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleAddCashFlowEntry}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${mockCashFlowSummary.currentBalance.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">30-Day Projection</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${mockCashFlowSummary.projectedBalance30Days.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Inflows</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${mockCashFlowSummary.totalInflows30Days.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Outflows</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${mockCashFlowSummary.totalOutflows30Days.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Flow Alerts */}
      {mockCashFlowSummary.netCashFlow30Days < 0 && (
        <Card>
          <div className="flex items-center p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-yellow-800">Cash Flow Warning</p>
              <p className="text-sm text-yellow-700">
                Projected negative cash flow of ${Math.abs(mockCashFlowSummary.netCashFlow30Days).toLocaleString()} in the next 30 days. 
                Consider accelerating receivables or deferring non-critical expenses.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'forecast' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cash Flow Forecast
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Category Analysis
          </button>
          <button
            onClick={() => setActiveTab('projections')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projections' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Long-term Projections
          </button>
        </nav>
      </div>

      {/* Cash Flow Forecast Tab */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cash flow entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="30">Next 30 Days</option>
                  <option value="60">Next 60 Days</option>
                  <option value="90">Next 90 Days</option>
                  <option value="365">Next 12 Months</option>
                </select>
              </div>
            </div>
          </Card>

          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Running Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCashFlow.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{entry.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{entry.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{entry.category}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`font-semibold ${getTypeColor(entry.type)}`}>
                          {entry.type === 'inflow' ? '+' : '-'}${entry.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">${entry.runningBalance.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                          {entry.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditCashFlowEntry(entry)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCashFlowEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
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

      {/* Category Analysis Tab */}
      {activeTab === 'analysis' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Cash Flow by Category</h2>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Inflows</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Outflows</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Cash Flow</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockCashFlowCategories.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{category.name}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-green-600">
                        {category.inflow > 0 ? `$${category.inflow.toLocaleString()}` : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-red-600">
                        {category.outflow > 0 ? `$${category.outflow.toLocaleString()}` : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`font-semibold ${getTypeColor(category.net >= 0 ? 'inflow' : 'outflow')}`}>
                        {category.net >= 0 ? '+' : ''}${category.net.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-gray-900">
                        {((Math.abs(category.net) / mockCashFlowSummary.totalInflows30Days) * 100).toFixed(1)}%
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Long-term Projections Tab */}
      {activeTab === 'projections' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Long-term Cash Flow Projections</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">30-Day Projection</p>
                <p className="text-2xl font-bold text-green-600">${mockCashFlowSummary.projectedBalance30Days.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">60-Day Projection</p>
                <p className="text-2xl font-bold text-blue-600">${mockCashFlowSummary.projectedBalance60Days.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">90-Day Projection</p>
                <p className="text-2xl font-bold text-purple-600">${mockCashFlowSummary.projectedBalance90Days.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4">Cash Flow Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Conservative</p>
                  <p className="text-lg font-bold text-gray-900">${(mockCashFlowSummary.projectedBalance90Days * 0.8).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">80% of projections</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Realistic</p>
                  <p className="text-lg font-bold text-blue-600">${mockCashFlowSummary.projectedBalance90Days.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Current projections</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Optimistic</p>
                  <p className="text-lg font-bold text-green-600">${(mockCashFlowSummary.projectedBalance90Days * 1.2).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">120% of projections</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEntry ? 'Edit Cash Flow Entry' : 'Add Cash Flow Entry'}
        size="lg"
      >
        <CashFlowForecastForm
          entry={editingEntry}
          onSubmit={handleSubmitCashFlowEntry}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}