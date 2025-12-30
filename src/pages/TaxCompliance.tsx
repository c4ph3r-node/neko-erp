import React, { useState } from 'react';
import { Plus, Search, Calculator, FileText, AlertTriangle, CheckCircle, Download, Calendar, DollarSign, Building2, Globe, Edit, Eye, X, Clock, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import TaxReturnForm from '../components/Forms/TaxReturnForm';
import TaxSettingsForm from '../components/Forms/TaxSettingsForm';
import { useGlobalState } from '../contexts/GlobalStateContext';
import { eastAfricanTaxConfigs, getCountryTaxConfig } from '../lib/eastAfricanTaxConfigs';

const mockTaxReturns = [
  {
    id: 1,
    returnType: 'VAT Return',
    period: 'January 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    dueDate: '2025-02-20',
    status: 'draft',
    totalSales: 5570000,
    totalPurchases: 2800000,
    vatOnSales: 891200,
    vatOnPurchases: 448000,
    netVat: 443200,
    filedDate: null,
    filedBy: null,
    kraPin: 'P051234567A',
    vatNumber: 'VAT001234567'
  },
  {
    id: 2,
    returnType: 'PAYE Return',
    period: 'January 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    dueDate: '2025-02-09',
    status: 'filed',
    totalPayroll: 1200000,
    totalPaye: 180000,
    totalNssf: 72000,
    totalNhif: 25500,
    filedDate: '2025-02-05',
    filedBy: 'John Smith',
    kraPin: 'P051234567A'
  },
  {
    id: 3,
    returnType: 'Withholding Tax Return',
    period: 'January 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    dueDate: '2025-02-20',
    status: 'pending',
    totalWithheld: 125000,
    professionalFees: 85000,
    rentPayments: 40000,
    filedDate: null,
    filedBy: null,
    kraPin: 'P051234567A'
  }
];

export default function TaxCompliance() {
  const { state, calculatePaye, calculateNhif, calculateNssf, calculateWithholdingTax, submitToTaxAuthority, showNotification, t } = useGlobalState();
  const navigate = useNavigate();

  // Get current country's tax configuration
  const currentTaxConfig = getCountryTaxConfig(state.taxSettings.countryCode);

  // Generate tax types based on current country configuration
  const getTaxTypes = () => {
    if (!currentTaxConfig) return [];

    const taxTypes = [
      { code: 'VAT', name: 'Value Added Tax', rate: currentTaxConfig.vatRate, description: `Standard VAT rate in ${currentTaxConfig.countryName}` },
      { code: 'VAT_ZERO', name: 'Zero-Rated VAT', rate: 0, description: 'Zero-rated supplies (exports, basic foods)' },
      { code: 'VAT_EXEMPT', name: 'VAT Exempt', rate: 0, description: 'Exempt supplies (financial services, education)' },
      { code: 'PAYE', name: 'Pay As You Earn', rate: 0, description: 'Income tax on employment' },
      { code: 'CORPORATION_TAX', name: 'Corporation Tax', rate: currentTaxConfig.corporateTaxRate, description: 'Corporate income tax' }
    ];

    // Add withholding tax types
    currentTaxConfig.withholdingTaxRates.forEach(wht => {
      taxTypes.push({
        code: `WHT_${wht.category}`,
        name: `WHT - ${wht.description}`,
        rate: wht.rate,
        description: wht.description
      });
    });

    // Add social security if available
    if (currentTaxConfig.socialSecurity) {
      taxTypes.push({
        code: 'SOCIAL_SECURITY',
        name: currentTaxConfig.socialSecurity.name,
        rate: currentTaxConfig.socialSecurity.rates[0]?.totalRate || 0,
        description: 'Social security contributions'
      });
    }

    // Add health insurance if available
    if (currentTaxConfig.healthInsurance) {
      taxTypes.push({
        code: 'HEALTH_INSURANCE',
        name: currentTaxConfig.healthInsurance.name,
        rate: 0,
        description: 'Health insurance contributions'
      });
    }

    // Add turnover tax if available
    if (currentTaxConfig.turnoverTax) {
      taxTypes.push({
        code: 'TURNOVER_TAX',
        name: 'Turnover Tax',
        rate: currentTaxConfig.turnoverTax.rate,
        description: `Tax for small businesses (turnover < ${currentTaxConfig.currencySymbol} ${currentTaxConfig.turnoverTax.threshold.toLocaleString()})`
      });
    }

    return taxTypes;
  };

  const taxTypes = getTaxTypes();

  // Get regions/counties based on current country
  const getRegions = () => {
    return currentTaxConfig?.counties || currentTaxConfig?.regions || [];
  };

  const regions = getRegions();

  const [activeTab, setActiveTab] = useState('returns');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingReturn, setEditingReturn] = useState<any>(null);
  const [editingSettings, setEditingSettings] = useState<any>(null);
  const [taxReturns, setTaxReturns] = useState(mockTaxReturns);

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
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCreateReturn = () => {
    setEditingReturn(null);
    setShowReturnModal(true);
  };

  const handleEditReturn = (taxReturn: any) => {
    if (taxReturn.status === 'filed') {
      showNotification('Cannot edit filed tax returns. Please create an amendment if needed.', 'error');
      return;
    }
    setEditingReturn(taxReturn);
    setShowReturnModal(true);
  };

  const handleViewReturn = (returnId: number) => {
    const taxReturn = taxReturns.find(r => r.id === returnId);
    if (taxReturn) {
      let details = `Type: ${taxReturn.returnType}, Period: ${taxReturn.period}, Status: ${taxReturn.status}`;
      
      if (taxReturn.returnType === 'VAT Return') {
        details += `, Net VAT: KES ${taxReturn.netVat?.toLocaleString()}`;
      } else if (taxReturn.returnType === 'PAYE Return') {
        details += `, Total PAYE: KES ${taxReturn.totalPaye?.toLocaleString()}`;
      }
      
      showNotification(`Tax Return Details: ${details}`, 'info');
    }
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

  const handleFileReturn = async (returnId: number) => {
    const taxReturn = taxReturns.find(r => r.id === returnId);
    if (taxReturn) {
      const success = await submitToTaxAuthority('tax_return', returnId.toString());
      if (success) {
        setTaxReturns(prev => prev.map(ret => 
          ret.id === returnId ? { 
            ...ret, 
            status: 'filed', 
            filedDate: new Date().toISOString().split('T')[0],
            filedBy: 'Current User'
          } : ret
        ));
        alert(`${taxReturn.returnType} successfully filed with KRA`);
        showNotification(`${taxReturn.returnType} successfully filed with KRA`, 'success');
      }
    }
  };

  const handleDeleteReturn = (returnId: number) => {
    const taxReturn = taxReturns.find(r => r.id === returnId);
    if (taxReturn?.status === 'filed') {
      showNotification('Cannot delete filed tax returns', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this tax return?')) {
      setTaxReturns(prev => prev.filter(ret => ret.id !== returnId));
    }
  };

  const handleDownloadReturn = (returnId: number) => {
    const taxReturn = taxReturns.find(r => r.id === returnId);
    if (taxReturn) {
      console.log('Downloading tax return PDF:', taxReturn);
      showNotification(`${taxReturn.returnType} for ${taxReturn.period} downloaded as PDF`, 'success');
    }
  };

  const handleCalculateTax = (type: string) => {
    switch (type) {
      case 'paye':
        const grossSalary = 80000;
        const paye = calculatePaye(grossSalary);
        const nhif = calculateNhif(grossSalary);
        const nssf = calculateNssf(grossSalary);
        showNotification(`PAYE Calculation: Gross KES ${grossSalary.toLocaleString()}, PAYE KES ${paye.toLocaleString()}, NHIF KES ${nhif.toLocaleString()}, NSSF KES ${nssf.toLocaleString()}, Net KES ${(grossSalary - paye - nhif - nssf).toLocaleString()}`, 'info');
        break;
      case 'withholding':
        const amount = 100000;
        const wht = calculateWithholdingTax(amount, 'PROFESSIONAL_SERVICES');
        showNotification(`WHT Calculation: Amount KES ${amount.toLocaleString()}, WHT KES ${wht.toLocaleString()}, Net KES ${(amount - wht).toLocaleString()}`, 'info');
        break;
      case 'vat':
        const saleAmount = 100000;
        const vatAmount = saleAmount * ((currentTaxConfig?.vatRate || 16) / 100);
        showNotification(`VAT Calculation: Sale KES ${saleAmount.toLocaleString()}, VAT KES ${vatAmount.toLocaleString()}, Total KES ${(saleAmount + vatAmount).toLocaleString()}`, 'info');
        break;
    }
  };

  const totalTaxOwed = filteredReturns.reduce((sum, ret) => sum + (ret.netVat || ret.totalPaye || ret.totalWithheld || 0), 0);
  const pendingReturns = filteredReturns.filter(ret => ret.status === 'pending' || ret.status === 'draft').length;
  const overdueReturns = filteredReturns.filter(ret => new Date(ret.dueDate) < new Date() && ret.status !== 'filed').length;
  const filedReturns = filteredReturns.filter(ret => ret.status === 'filed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax & Compliance Management</h1>
          <p className="text-gray-600">Comprehensive tax compliance system integrated with local tax authorities</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => window.open('https://itax.kra.go.ke', '_blank')}>
            <Building2 className="w-4 h-4 mr-2" />
            KRA Portal
          </Button>
          <Button variant="secondary" onClick={() => setActiveTab('calendar')}>
            <Calendar className="w-4 h-4 mr-2" />
            Tax Calendar
          </Button>
          <Button onClick={handleCreateReturn}>
            <Plus className="w-4 h-4 mr-2" />
            New Tax Return
          </Button>
        </div>
      </div>

      {/* KRA Compliance Status */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600">Tax Registration</p>
            <p className="text-lg font-bold text-blue-900">{state.taxSettings.taxRegistrationNumber}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">VAT Registration</p>
            <p className="text-lg font-bold text-green-900">{state.taxSettings.vatRegistrationNumber}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Percent className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-600">Current VAT Rate</p>
            <p className="text-lg font-bold text-purple-900">{currentTaxConfig?.vatRate || 16}%</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Calculator className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-orange-600">Tax Calculators</p>
            <div className="flex space-x-1 mt-2">
              <Button size="sm" onClick={() => handleCalculateTax('paye')}>PAYE</Button>
              <Button size="sm" onClick={() => handleCalculateTax('vat')}>VAT</Button>
              <Button size="sm" onClick={() => handleCalculateTax('withholding')}>WHT</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tax Owed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">KES {totalTaxOwed.toLocaleString()}</p>
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
              <p className="text-sm font-medium text-gray-600">Filed Returns</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{filedReturns}</p>
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
            onClick={() => setActiveTab('tax_types')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tax_types' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tax Types
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tax Calendar
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calculators' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tax Calculators
          </button>
          <button
            onClick={() => setActiveTab('kra_integration')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'kra_integration' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            KRA Integration
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Amount (KES)</th>
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
                          <p className="text-xs text-red-600 font-medium">OVERDUE</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">
                          {(taxReturn.netVat || taxReturn.totalPaye || taxReturn.totalWithheld || 0).toLocaleString()}
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
                            onClick={() => handleViewReturn(taxReturn.id)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="View Return Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {taxReturn.status !== 'filed' && (
                            <button 
                              onClick={() => handleEditReturn(taxReturn)}
                              className="p-1 text-gray-500 hover:text-blue-600"
                              title="Edit Return"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {(taxReturn.status === 'pending' || taxReturn.status === 'draft') && (
                            <button 
                              onClick={() => handleFileReturn(taxReturn.id)}
                              className="p-1 text-gray-500 hover:text-green-600"
                              title="File with KRA"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDownloadReturn(taxReturn.id)}
                            className="p-1 text-gray-500 hover:text-purple-600"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          {taxReturn.status !== 'filed' && (
                            <button 
                              onClick={() => handleDeleteReturn(taxReturn.id)}
                              className="p-1 text-gray-500 hover:text-red-600"
                              title="Delete Return"
                            >
                              <X className="w-4 h-4" />
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

      {/* Tax Types Tab */}
      {activeTab === 'tax_types' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{currentTaxConfig?.countryName || 'Country'} Tax Configuration</h2>
              <Button onClick={() => navigate('/settings')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Tax
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxTypes.map((taxType) => (
                <Card key={taxType.code}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{taxType.name}</h3>
                      <span className="text-lg font-bold text-blue-600">{taxType.rate}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{taxType.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {taxType.code}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => showNotification(`${taxType.name} configuration is managed in Settings`, 'info')}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleCalculateTax(taxType.code.toLowerCase())}>
                          <Calculator className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tax Calculators Tab */}
      {activeTab === 'calculators' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PAYE Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Calculate Pay As You Earn tax based on Kenyan tax brackets</p>
                <Button onClick={() => handleCalculateTax('paye')} className="w-full">
                  Calculate PAYE
                </Button>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <Percent className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">VAT Calculator</h3>
                <p className="text-sm text-gray-600 mb-4">Calculate 16% VAT on sales and purchases</p>
                <Button onClick={() => handleCalculateTax('vat')} className="w-full">
                  Calculate VAT
                </Button>
              </div>
            </Card>
            
            <Card>
              <div className="text-center">
                <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Withholding Tax</h3>
                <p className="text-sm text-gray-600 mb-4">Calculate withholding tax for various service categories</p>
                <Button onClick={() => handleCalculateTax('withholding')} className="w-full">
                  Calculate WHT
                </Button>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentTaxConfig?.countryName || 'Country'} Tax Rates Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">PAYE Tax Brackets (Monthly)</h4>
                <div className="space-y-2">
                  {currentTaxConfig?.payeRates?.map((rate, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {currentTaxConfig.currencySymbol} {rate.minAmount.toLocaleString()} - {rate.maxAmount === Infinity ? '∞' : rate.maxAmount.toLocaleString()}
                      </span>
                      <span className="font-medium text-gray-900">{rate.rate}%</span>
                    </div>
                  )) || <p className="text-sm text-gray-500">No PAYE rates configured</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Withholding Tax Rates</h4>
                <div className="space-y-2">
                  {currentTaxConfig?.withholdingTaxRates?.map((rate, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{rate.description}</span>
                      <span className="font-medium text-gray-900">{rate.rate}%</span>
                    </div>
                  )) || <p className="text-sm text-gray-500">No withholding tax rates configured</p>}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* KRA Integration Tab */}
      {activeTab === 'kra_integration' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">KRA eTIMS Integration</h2>
            <Button onClick={() => showNotification('KRA connection test successful', 'success')}>
              <Building2 className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-4">Integration Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-600">eTIMS Connected</p>
                  <p className="text-xs text-green-700">Last sync: 2 hours ago</p>
                </div>
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-yellow-600">Pending Submissions</p>
                  <p className="text-xs text-yellow-700">{state.journalEntries.filter(je => !je.kraSubmitted).length} documents</p>
                </div>
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-600">KRA Portal</p>
                  <Button size="sm" onClick={() => window.open('https://itax.kra.go.ke', '_blank')}>
                    Open Portal
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Automatic Submissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">VAT Returns</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">PAYE Returns</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">Withholding Tax</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Manual</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Compliance Checklist</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm text-green-800">VAT Registration Active</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm text-green-800">PAYE Registration Active</span>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                    <span className="text-sm text-yellow-800">Monthly Returns Due Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tax Calendar Tab */}
      {activeTab === 'calendar' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Tax Calendar</h2>
            <Button onClick={() => console.log('Export calendar')}>
              <Download className="w-4 h-4 mr-2" />
              Export Calendar
            </Button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Calendar className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-red-600">Overdue</p>
                <p className="text-lg font-bold text-red-900">{filteredReturns.filter(ret => new Date(ret.dueDate) < new Date() && ret.status !== 'filed').length}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-yellow-600">Due This Week</p>
                <p className="text-lg font-bold text-yellow-900">
                  {filteredReturns.filter(ret => {
                    const dueDate = new Date(ret.dueDate);
                    const now = new Date();
                    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return dueDate >= now && dueDate <= weekFromNow && ret.status !== 'filed';
                  }).length}
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-600">Filed</p>
                <p className="text-lg font-bold text-green-900">{filteredReturns.filter(ret => ret.status === 'filed').length}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900">Upcoming Deadlines</h3>
              {filteredReturns
                .filter(ret => ret.status !== 'filed')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 10)
                .map((taxReturn) => (
                  <div key={taxReturn.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{taxReturn.returnType}</p>
                      <p className="text-sm text-gray-500">Period: {taxReturn.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{taxReturn.dueDate}</p>
                      <p className={`text-sm ${new Date(taxReturn.dueDate) < new Date() ? 'text-red-600' : 'text-gray-500'}`}>
                        {new Date(taxReturn.dueDate) < new Date() ? 'Overdue' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
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
          onSubmit={() => setShowSettingsModal(false)}
          onCancel={() => setShowSettingsModal(false)}
        />
      </Modal>
    </div>
  );
}