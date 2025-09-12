import React, { useState } from 'react';
import { Plus, Search, Calculator, FileText, AlertTriangle, CheckCircle, Download, Calendar, DollarSign, Building2, Globe, Edit, Eye, X, Clock, Percent } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import TaxReturnForm from '../components/Forms/TaxReturnForm';
import TaxSettingsForm from '../components/Forms/TaxSettingsForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

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

const kenyanTaxTypes = [
  { code: 'VAT', name: 'Value Added Tax', rate: 16, description: 'Standard VAT rate in Kenya' },
  { code: 'VAT_ZERO', name: 'Zero-Rated VAT', rate: 0, description: 'Zero-rated supplies (exports, basic foods)' },
  { code: 'VAT_EXEMPT', name: 'VAT Exempt', rate: 0, description: 'Exempt supplies (financial services, education)' },
  { code: 'PAYE', name: 'Pay As You Earn', rate: 0, description: 'Income tax on employment' },
  { code: 'WHT_PROFESSIONAL', name: 'WHT - Professional Services', rate: 5, description: 'Withholding tax on professional services' },
  { code: 'WHT_RENT', name: 'WHT - Rent', rate: 10, description: 'Withholding tax on rent payments' },
  { code: 'WHT_INTEREST', name: 'WHT - Interest', rate: 15, description: 'Withholding tax on interest payments' },
  { code: 'WHT_DIVIDENDS', name: 'WHT - Dividends', rate: 5, description: 'Withholding tax on dividend payments' },
  { code: 'CORPORATION_TAX', name: 'Corporation Tax', rate: 30, description: 'Corporate income tax' },
  { code: 'TURNOVER_TAX', name: 'Turnover Tax', rate: 3, description: 'Tax for small businesses (turnover < KES 5M)' }
];

const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta', 'Garissa', 'Wajir', 'Mandera',
  'Marsabit', 'Isiolo', 'Meru', 'Tharaka Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri',
  'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet',
  'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma',
  'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira'
];

export default function TaxCompliance() {
  const { state, calculatePaye, calculateNhif, calculateNssf, calculateWithholdingTax, submitToKra } = useGlobalState();
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
      alert('Cannot edit filed tax returns. Please create an amendment if needed.');
      return;
    }
    setEditingReturn(taxReturn);
    setShowReturnModal(true);
  };

  const handleViewReturn = (returnId: number) => {
    const taxReturn = taxReturns.find(r => r.id === returnId);
    if (taxReturn) {
      let details = `Tax Return Details:\n\nType: ${taxReturn.returnType}\nPeriod: ${taxReturn.period}\nStatus: ${taxReturn.status}\nDue Date: ${taxReturn.dueDate}\n`;
      
      if (taxReturn.returnType === 'VAT Return') {
        details += `\nTotal Sales: KES ${taxReturn.totalSales?.toLocaleString()}\nVAT on Sales: KES ${taxReturn.vatOnSales?.toLocaleString()}\nTotal Purchases: KES ${taxReturn.totalPurchases?.toLocaleString()}\nVAT on Purchases: KES ${taxReturn.vatOnPurchases?.toLocaleString()}\nNet VAT Payable: KES ${taxReturn.netVat?.toLocaleString()}`;
      } else if (taxReturn.returnType === 'PAYE Return') {
        details += `\nTotal Payroll: KES ${taxReturn.totalPayroll?.toLocaleString()}\nTotal PAYE: KES ${taxReturn.totalPaye?.toLocaleString()}\nTotal NSSF: KES ${taxReturn.totalNssf?.toLocaleString()}\nTotal NHIF: KES ${taxReturn.totalNhif?.toLocaleString()}`;
      }
      
      alert(details);
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
      const success = await submitToKra('tax_return', returnId.toString());
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
      }
    }
  };

  const handleDeleteReturn = (returnId: number) => {
    const taxReturn = taxReturns.find(r => r.id === returnId);
    if (taxReturn?.status === 'filed') {
      alert('Cannot delete filed tax returns');
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
      alert(`${taxReturn.returnType} for ${taxReturn.period} downloaded as PDF`);
    }
  };

  const handleCalculateTax = (type: string) => {
    switch (type) {
      case 'paye':
        const grossSalary = 80000;
        const paye = calculatePaye(grossSalary);
        const nhif = calculateNhif(grossSalary);
        const nssf = calculateNssf(grossSalary);
        alert(`Tax Calculation for KES ${grossSalary.toLocaleString()} gross salary:\n\nPAYE: KES ${paye.toLocaleString()}\nNHIF: KES ${nhif.toLocaleString()}\nNSSF: KES ${nssf.toLocaleString()}\nNet Salary: KES ${(grossSalary - paye - nhif - nssf).toLocaleString()}`);
        break;
      case 'withholding':
        const amount = 100000;
        const wht = calculateWithholdingTax(amount, 'PROFESSIONAL_SERVICES');
        alert(`Withholding Tax Calculation:\n\nAmount: KES ${amount.toLocaleString()}\nWHT (5%): KES ${wht.toLocaleString()}\nNet Payment: KES ${(amount - wht).toLocaleString()}`);
        break;
      case 'vat':
        const saleAmount = 100000;
        const vatAmount = saleAmount * (state.kenyanTaxSettings.vatRate / 100);
        alert(`VAT Calculation:\n\nSale Amount: KES ${saleAmount.toLocaleString()}\nVAT (${state.kenyanTaxSettings.vatRate}%): KES ${vatAmount.toLocaleString()}\nTotal: KES ${(saleAmount + vatAmount).toLocaleString()}`);
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
          <p className="text-gray-600">Comprehensive Kenyan tax compliance system integrated with KRA eTIMS</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => console.log('Opening KRA portal')}>
            <Building2 className="w-4 h-4 mr-2" />
            KRA Portal
          </Button>
          <Button variant="secondary" onClick={() => console.log('Opening tax calendar')}>
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
            <p className="text-sm font-medium text-blue-600">KRA PIN</p>
            <p className="text-lg font-bold text-blue-900">{state.kenyanTaxSettings.kraPin}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">VAT Registration</p>
            <p className="text-lg font-bold text-green-900">{state.kenyanTaxSettings.vatRegistrationNumber}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Percent className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-600">Current VAT Rate</p>
            <p className="text-lg font-bold text-purple-900">{state.kenyanTaxSettings.vatRate}%</p>
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
            onClick={() => setActiveTab('kenyan_taxes')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'kenyan_taxes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kenyan Tax Types
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

      {/* Kenyan Tax Types Tab */}
      {activeTab === 'kenyan_taxes' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Kenyan Tax Configuration</h2>
              <Button onClick={() => console.log('Adding custom tax type')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Tax
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {kenyanTaxTypes.map((taxType) => (
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
                        <Button variant="secondary" size="sm" onClick={() => console.log('Configuring', taxType.code)}>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kenyan Tax Rates Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">PAYE Tax Brackets (Monthly)</h4>
                <div className="space-y-2">
                  {state.kenyanTaxSettings.payeRates.map((rate, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        KES {rate.minAmount.toLocaleString()} - {rate.maxAmount === Infinity ? '∞' : rate.maxAmount.toLocaleString()}
                      </span>
                      <span className="font-medium text-gray-900">{rate.rate}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Withholding Tax Rates</h4>
                <div className="space-y-2">
                  {state.kenyanTaxSettings.withholdingTaxRates.map((rate, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{rate.description}</span>
                      <span className="font-medium text-gray-900">{rate.rate}%</span>
                    </div>
                  ))}
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
            <Button onClick={() => console.log('Testing KRA connection')}>
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