import React, { useState } from 'react';
import { Plus, Search, Calculator, FileText, AlertTriangle, CheckCircle, Download, Calendar, DollarSign, Percent, Globe } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import TaxReturnForm from '../components/Forms/TaxReturnForm';
import TaxSettingsForm from '../components/Forms/TaxSettingsForm';

const mockTaxReturns = [
  {
    id: 1,
    returnType: 'VAT Return',
    period: 'Q4 2024',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    dueDate: '2025-01-31',
    status: 'filed',
    totalSales: 180500.00,
    totalPurchases: 103600.00,
    vatOnSales: 18050.00,
    vatOnPurchases: 10360.00,
    netVat: 7690.00,
    filedDate: '2025-01-25',
    filedBy: 'John Smith'
  },
  {
    id: 2,
    returnType: 'Income Tax',
    period: '2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    dueDate: '2025-03-15',
    status: 'draft',
    totalIncome: 250000.00,
    totalDeductions: 45000.00,
    taxableIncome: 205000.00,
    taxOwed: 51250.00,
    filedDate: null,
    filedBy: null
  },
  {
    id: 3,
    returnType: 'Payroll Tax',
    period: 'January 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    dueDate: '2025-02-15',
    status: 'pending',
    totalPayroll: 125000.00,
    federalTax: 18750.00,
    stateTax: 6250.00,
    socialSecurity: 7750.00,
    medicare: 1812.50,
    totalTax: 34562.50,
    filedDate: null,
    filedBy: null
  }
];

const mockTaxSettings = [
  {
    id: 1,
    country: 'United States',
    taxType: 'Federal Income Tax',
    rate: 21.0,
    isActive: true,
    effectiveDate: '2024-01-01',
    description: 'Federal corporate income tax rate'
  },
  {
    id: 2,
    country: 'United States',
    taxType: 'State Income Tax',
    rate: 8.5,
    isActive: true,
    effectiveDate: '2024-01-01',
    description: 'State corporate income tax rate'
  },
  {
    id: 3,
    country: 'United States',
    taxType: 'Sales Tax',
    rate: 10.0,
    isActive: true,
    effectiveDate: '2024-01-01',
    description: 'Standard sales tax rate'
  },
  {
    id: 4,
    country: 'United Kingdom',
    taxType: 'VAT',
    rate: 20.0,
    isActive: false,
    effectiveDate: '2024-01-01',
    description: 'Value Added Tax rate'
  }
];

const mockTaxAudits = [
  {
    id: 1,
    auditType: 'VAT Audit',
    period: '2023-2024',
    status: 'completed',
    startDate: '2024-11-01',
    endDate: '2024-12-15',
    auditor: 'Tax Authority',
    findings: 'No significant issues found',
    adjustments: 0.00,
    penalties: 0.00
  },
  {
    id: 2,
    auditType: 'Income Tax Review',
    period: '2023',
    status: 'in_progress',
    startDate: '2025-01-10',
    endDate: null,
    auditor: 'IRS',
    findings: 'Under review',
    adjustments: 0.00,
    penalties: 0.00
  }
];

const mockWithholdingTax = [
  {
    id: 1,
    vendor: 'Consulting Services LLC',
    invoiceNumber: 'INV-001',
    invoiceAmount: 5000.00,
    withholdingRate: 10.0,
    withholdingAmount: 500.00,
    netPayment: 4500.00,
    paymentDate: '2025-01-15',
    status: 'paid',
    certificateIssued: true
  },
  {
    id: 2,
    vendor: 'Legal Services Inc',
    invoiceNumber: 'INV-002',
    invoiceAmount: 3000.00,
    withholdingRate: 15.0,
    withholdingAmount: 450.00,
    netPayment: 2550.00,
    paymentDate: '2025-01-20',
    status: 'pending',
    certificateIssued: false
  }
];

export default function TaxCompliance() {
  const [activeTab, setActiveTab] = useState('returns');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingReturn, setEditingReturn] = useState<any>(null);
  const [editingSettings, setEditingSettings] = useState<any>(null);
  const [taxReturns, setTaxReturns] = useState(mockTaxReturns);
  const [taxSettings, setTaxSettings] = useState(mockTaxSettings);

  const filteredReturns = taxReturns.filter(taxReturn => {
    const matchesSearch = taxReturn.returnType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         taxReturn.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || taxReturn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCreateReturn = () => {
    setEditingReturn(null);
    setShowReturnModal(true);
  };

  const handleEditReturn = (taxReturn: any) => {
    setEditingReturn(taxReturn);
    setShowReturnModal(true);
  };

  const handleSubmitReturn = (returnData: any) => {
    if (editingReturn) {
      setTaxReturns(prev => prev.map(ret => ret.id === editingReturn.id ? { ...ret, ...returnData } : ret));
    } else {
      const newReturn = { ...returnData, id: Date.now() };
      setTaxReturns(prev => [...prev, newReturn]);
    }
    setShowReturnModal(false);
    setEditingReturn(null);
  };

  const handleFileReturn = (returnId: number) => {
    setTaxReturns(prev => prev.map(ret => 
      ret.id === returnId ? { ...ret, status: 'filed', filedDate: new Date().toISOString().split('T')[0] } : ret
    ));
  };

  const handleCreateTaxSetting = () => {
    setEditingSettings(null);
    setShowSettingsModal(true);
  };

  const handleEditTaxSetting = (setting: any) => {
    setEditingSettings(setting);
    setShowSettingsModal(true);
  };

  const handleSubmitTaxSetting = (settingData: any) => {
    if (editingSettings) {
      setTaxSettings(prev => prev.map(setting => setting.id === editingSettings.id ? { ...setting, ...settingData } : setting));
    } else {
      const newSetting = { ...settingData, id: Date.now() };
      setTaxSettings(prev => [...prev, newSetting]);
    }
    setShowSettingsModal(false);
    setEditingSettings(null);
  };

  const totalTaxOwed = filteredReturns.reduce((sum, ret) => sum + (ret.netVat || ret.taxOwed || ret.totalTax || 0), 0);
  const pendingReturns = filteredReturns.filter(ret => ret.status === 'pending' || ret.status === 'draft').length;
  const overdueReturns = filteredReturns.filter(ret => new Date(ret.dueDate) < new Date() && ret.status !== 'filed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax & Compliance Management</h1>
          <p className="text-gray-600">Manage tax returns, compliance requirements, and regulatory reporting</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => console.log('Opening tax calendar')}>
            <Calendar className="w-4 h-4 mr-2" />
            Tax Calendar
          </Button>
          <Button variant="secondary" onClick={() => console.log('Generating tax reports')}>
            <FileText className="w-4 h-4 mr-2" />
            Tax Reports
          </Button>
          <Button onClick={handleCreateReturn}>
            <Plus className="w-4 h-4 mr-2" />
            New Tax Return
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tax Owed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">${totalTaxOwed.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Returns</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingReturns}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Returns</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{overdueReturns}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Score</p>
              <p className="text-2xl font-bold text-green-600 mt-1">98.5%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('returns')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'returns' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tax Returns
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tax Settings
          </button>
          <button
            onClick={() => setActiveTab('withholding')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'withholding' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Withholding Tax
          </button>
          <button
            onClick={() => setActiveTab('audits')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audits' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tax Audits
          </button>
        </nav>
      </div>

      {/* Tax Returns Tab */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tax returns..."
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
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="filed">Filed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </Card>

          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReturns.map((taxReturn) => (
                    <tr key={taxReturn.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{taxReturn.returnType}</p>
                          <p className="text-sm text-gray-500">{taxReturn.startDate} - {taxReturn.endDate}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{taxReturn.period}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{taxReturn.dueDate}</p>
                        {new Date(taxReturn.dueDate) < new Date() && taxReturn.status !== 'filed' && (
                          <p className="text-xs text-red-600 font-medium">Overdue</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">
                          ${(taxReturn.netVat || taxReturn.taxOwed || taxReturn.totalTax || 0).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(taxReturn.status)}`}>
                          {taxReturn.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => console.log('Viewing tax return:', taxReturn.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditReturn(taxReturn)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {taxReturn.status !== 'filed' && (
                            <button 
                              onClick={() => handleFileReturn(taxReturn.id)}
                              className="p-1 text-gray-500 hover:text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => console.log('Downloading tax return:', taxReturn.id)}
                            className="p-1 text-gray-500 hover:text-purple-600"
                          >
                            <Download className="w-4 h-4" />
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

      {/* Tax Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Tax Configuration</h2>
              <Button onClick={handleCreateTaxSetting}>
                <Plus className="w-4 h-4 mr-2" />
                Add Tax Setting
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Type</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxSettings.map((setting) => (
                    <tr key={setting.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          <p className="text-sm text-gray-900">{setting.country}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{setting.taxType}</p>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">{setting.rate}%</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{setting.effectiveDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          setting.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {setting.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditTaxSetting(setting)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => console.log('Toggling tax setting:', setting.id)}
                            className="p-1 text-gray-500 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
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

      {/* Withholding Tax Tab */}
      {activeTab === 'withholding' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Withholding Tax Management</h2>
              <Button onClick={() => console.log('Creating withholding tax entry')}>
                <Plus className="w-4 h-4 mr-2" />
                New Withholding Entry
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Withholding %</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Withholding Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockWithholdingTax.map((withholding) => (
                    <tr key={withholding.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{withholding.vendor}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{withholding.invoiceNumber}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm text-gray-900">${withholding.invoiceAmount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm text-gray-900">{withholding.withholdingRate}%</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-red-600">${withholding.withholdingAmount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-green-600">${withholding.netPayment.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(withholding.status)}`}>
                          {withholding.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          {!withholding.certificateIssued && (
                            <button 
                              onClick={() => console.log('Issuing certificate:', withholding.id)}
                              className="p-1 text-gray-500 hover:text-green-600"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => console.log('Downloading certificate:', withholding.id)}
                            className="p-1 text-gray-500 hover:text-purple-600"
                          >
                            <Download className="w-4 h-4" />
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

      {/* Tax Audits Tab */}
      {activeTab === 'audits' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Tax Audits & Reviews</h2>
            <Button onClick={() => console.log('Creating audit record')}>
              <Plus className="w-4 h-4 mr-2" />
              New Audit Record
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTaxAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{audit.auditType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{audit.period}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{audit.auditor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{audit.startDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(audit.status)}`}>
                        {audit.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900">${audit.adjustments.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-green-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title={editingReturn ? 'Edit Tax Return' : 'Create New Tax Return'}
        size="xl"
      >
        <TaxReturnForm
          taxReturn={editingReturn}
          onSubmit={handleSubmitReturn}
          onCancel={() => setShowReturnModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title={editingSettings ? 'Edit Tax Setting' : 'Add New Tax Setting'}
        size="lg"
      >
        <TaxSettingsForm
          setting={editingSettings}
          onSubmit={handleSubmitTaxSetting}
          onCancel={() => setShowSettingsModal(false)}
        />
      </Modal>
    </div>
  );
}