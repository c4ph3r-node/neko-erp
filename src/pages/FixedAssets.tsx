import React, { useState } from 'react';
import { Plus, Search, Package, TrendingDown, Calendar, Wrench, Eye, Edit, Trash2, CheckCircle, AlertTriangle, Download, Settings, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import AssetForm from '../components/Forms/AssetForm';
import MaintenanceForm from '../components/Forms/MaintenanceForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

const mockAssets = [
  {
    id: 1,
    assetNumber: 'AST-001',
    name: 'Dell Laptop - Engineering',
    category: 'Computer Equipment',
    purchaseDate: '2023-01-15',
    purchasePrice: 1200.00,
    currentValue: 800.00,
    depreciationMethod: 'straight_line',
    usefulLife: 3,
    salvageValue: 100.00,
    location: 'Engineering Office',
    condition: 'good',
    status: 'active',
    serialNumber: 'DL123456789',
    warrantyExpiry: '2026-01-15',
    lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-06-01'
  },
  {
    id: 2,
    assetNumber: 'AST-002',
    name: 'Office Printer - HP LaserJet',
    category: 'Office Equipment',
    purchaseDate: '2022-08-20',
    purchasePrice: 800.00,
    currentValue: 400.00,
    depreciationMethod: 'straight_line',
    usefulLife: 5,
    salvageValue: 50.00,
    location: 'Main Office',
    condition: 'excellent',
    status: 'active',
    serialNumber: 'HP987654321',
    warrantyExpiry: '2025-08-20',
    lastMaintenance: '2024-11-15',
    nextMaintenance: '2025-05-15'
  },
  {
    id: 3,
    assetNumber: 'AST-003',
    name: 'Company Vehicle - Toyota Camry',
    category: 'Vehicles',
    purchaseDate: '2021-03-10',
    purchasePrice: 25000.00,
    currentValue: 15000.00,
    depreciationMethod: 'declining_balance',
    usefulLife: 8,
    salvageValue: 2000.00,
    location: 'Parking Lot A',
    condition: 'good',
    status: 'active',
    serialNumber: 'TC2021001',
    warrantyExpiry: '2024-03-10',
    lastMaintenance: '2024-12-20',
    nextMaintenance: '2025-03-20'
  },
  {
    id: 4,
    assetNumber: 'AST-004',
    name: 'Manufacturing Equipment - CNC Machine',
    category: 'Manufacturing Equipment',
    purchaseDate: '2020-06-01',
    purchasePrice: 50000.00,
    currentValue: 30000.00,
    depreciationMethod: 'units_of_production',
    usefulLife: 10,
    salvageValue: 5000.00,
    location: 'Factory Floor B',
    condition: 'fair',
    status: 'active',
    serialNumber: 'CNC2020001',
    warrantyExpiry: '2023-06-01',
    lastMaintenance: '2025-01-10',
    nextMaintenance: '2025-04-10'
  }
];

const initialMaintenanceRecords = [
  { id: 1, assetName: 'Dell Laptop - Engineering', date: '2024-12-01', type: 'Preventive', cost: 150.00, description: 'Software updates and cleaning', status: 'completed' },
  { id: 2, assetName: 'Office Printer - HP LaserJet', date: '2024-11-15', type: 'Repair', cost: 85.00, description: 'Replace toner cartridge', status: 'completed' },
  { id: 3, assetName: 'Company Vehicle - Toyota Camry', date: '2024-12-20', type: 'Preventive', cost: 320.00, description: 'Oil change and tire rotation', status: 'completed' },
  { id: 4, assetName: 'Manufacturing Equipment - CNC Machine', date: '2025-01-10', type: 'Preventive', cost: 1200.00, description: 'Calibration and parts replacement', status: 'completed' }
];

export default function FixedAssets() {
  const { formatCurrency, t } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assets, setAssets] = useState(mockAssets);
  const [maintenanceRecords, setMaintenanceRecords] = useState(initialMaintenanceRecords);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showDepreciationReportModal, setShowDepreciationReportModal] = useState(false);
  const [showViewMaintenanceModal, setShowViewMaintenanceModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<any>(null);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalAssets = filteredAssets.length;
  const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDepreciation = filteredAssets.reduce((sum, asset) => sum + (asset.purchasePrice - asset.currentValue), 0);
  const maintenanceDue = filteredAssets.filter(asset => new Date(asset.nextMaintenance) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length;

  // Asset CRUD Operations
  const handleAddAsset = () => {
    setEditingAsset(null);
    setShowAssetModal(true);
  };

  const handleEditAsset = (asset: any) => {
    setEditingAsset(asset);
    setShowAssetModal(true);
  };

  const handleViewAsset = (assetId: number) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setEditingAsset(asset);
      setShowAssetModal(true);
    }
  };

  const handleSubmitAsset = (assetData: any) => {
    if (editingAsset) {
      setAssets(prev => prev.map(asset => asset.id === editingAsset.id ? { ...asset, ...assetData } : asset));
    } else {
      const newAsset = { ...assetData, id: Date.now() };
      setAssets(prev => [...prev, newAsset]);
    }
    setShowAssetModal(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (assetId: number) => {
    if (confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      setAssets(prev => prev.filter(asset => asset.id !== assetId));
    }
  };

  const handleDisposeAsset = (assetId: number) => {
    if (confirm('Are you sure you want to dispose of this asset?')) {
      setAssets(prev => prev.map(asset => 
        asset.id === assetId ? { ...asset, status: 'disposed' } : asset
      ));
    }
  };

  // Maintenance CRUD Operations
  const handleAddMaintenance = () => {
    setEditingMaintenance(null);
    setShowMaintenanceModal(true);
  };

  const handleEditMaintenance = (maintenance: any) => {
    setEditingMaintenance(maintenance);
    setShowMaintenanceModal(true);
  };

  const handleSubmitMaintenance = (maintenanceData: any) => {
    if (editingMaintenance) {
      setMaintenanceRecords(prev => prev.map(record => record.id === editingMaintenance.id ? { ...record, ...maintenanceData } : record));
    } else {
      const newMaintenance = { ...maintenanceData, id: Date.now() };
      setMaintenanceRecords(prev => [...prev, newMaintenance]);
    }
    setShowMaintenanceModal(false);
    setEditingMaintenance(null);
  };

  const handleDeleteMaintenance = (maintenanceId: number) => {
    if (confirm('Are you sure you want to delete this maintenance record?')) {
      setMaintenanceRecords(prev => prev.filter(record => record.id !== maintenanceId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('fixedAssets')}</h1>
          <p className="text-gray-600">{t('manageAssetRegister')}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => setShowDepreciationReportModal(true)}>
            <TrendingDown className="w-4 h-4 mr-2" />
            {t('depreciationReport')}
          </Button>
          <Button onClick={handleAddAsset}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addAsset')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalAssets')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalAssets}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('currentValue')}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-green-600 transform rotate-180" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalDepreciation')}</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totalDepreciation)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('maintenanceDue')}</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{maintenanceDue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Wrench className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('assets')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('assetRegister')}
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'maintenance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('maintenance')}
          </button>
          <button
            onClick={() => setActiveTab('depreciation')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'depreciation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('depreciation')}
          </button>
        </nav>
      </div>

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('searchAssets')}
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
                  <option value="all">{t('allStatus')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="disposed">{t('disposed')}</option>
                  <option value="sold">{t('sold')}</option>
                  <option value="retired">{t('retired')}</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Assets Table */}
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('asset')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('category')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('location')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('purchasePrice')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('currentValue')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('condition')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-500">{asset.assetNumber}</p>
                          <p className="text-sm text-gray-500">S/N: {asset.serialNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{asset.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{asset.location}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm text-gray-900">{formatCurrency(asset.purchasePrice)}</p>
                        <p className="text-xs text-gray-500">{asset.purchaseDate}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(asset.currentValue)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(asset.condition)}`}>
                          {asset.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600"
                            onClick={() => handleViewAsset(asset.id)}
                            title="View Asset"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditAsset(asset)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="Edit Asset"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDisposeAsset(asset.id)}
                            className="p-1 text-gray-500 hover:text-yellow-600"
                            title="Dispose Asset"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Asset"
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

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('maintenanceRecords')}</h2>
            <Button onClick={handleAddMaintenance}>
              <Plus className="w-4 h-4 mr-2" />
              {t('scheduleMaintenance')}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('asset')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{record.assetName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{record.date}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        record.type === 'Preventive' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{record.description}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-medium text-gray-900">${record.cost.toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => { setEditingMaintenance(record); setShowViewMaintenanceModal(true); }}
                          className="p-1 text-gray-500 hover:text-blue-600"
                          title="View Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditMaintenance(record)}
                          className="p-1 text-gray-500 hover:text-blue-600"
                          title="Edit Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMaintenance(record.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                          title="Delete Record"
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
      )}

      {/* Depreciation Tab */}
      {activeTab === 'depreciation' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('depreciationSchedules')}</h2>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => alert('Depreciation calculation completed')}>
                <Calculator className="w-4 h-4 mr-2" />
                {t('calculateDepreciation')}
              </Button>
              <Button onClick={() => navigate('/reports')}>
                <Download className="w-4 h-4 mr-2" />
                {t('generateReport')}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('asset')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('purchasePrice')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('currentValue')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Depreciation</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Life</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => {
                  const annualDepreciation = (asset.purchasePrice - asset.salvageValue) / asset.usefulLife;
                  const totalDepreciation = asset.purchasePrice - asset.currentValue;
                  const remainingLife = asset.usefulLife - (totalDepreciation / annualDepreciation);
                  
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-500">{asset.assetNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 capitalize">{asset.depreciationMethod.replace('_', ' ')}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">{formatCurrency(asset.purchasePrice)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(asset.currentValue)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-orange-600">{formatCurrency(annualDepreciation)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">{remainingLife.toFixed(1)} years</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal
        isOpen={showAssetModal}
        onClose={() => setShowAssetModal(false)}
        title={editingAsset ? 'Edit Asset' : 'Add New Asset'}
        size="xl"
      >
        <AssetForm
          asset={editingAsset}
          onSubmit={handleSubmitAsset}
          onCancel={() => setShowAssetModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        title={editingMaintenance ? 'Edit Maintenance Record' : 'Schedule Maintenance'}
        size="lg"
      >
        <MaintenanceForm
          maintenance={editingMaintenance}
          assets={assets}
          onSubmit={handleSubmitMaintenance}
          onCancel={() => setShowMaintenanceModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showDepreciationReportModal}
        onClose={() => setShowDepreciationReportModal(false)}
        title={t('depreciationReport')}
        size="xl"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('depreciationSchedules')}</h3>
            <Button onClick={() => alert('Depreciation report exported')}>
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('asset')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('purchasePrice')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('currentValue')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Depreciation</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Life</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => {
                  const annualDepreciation = (asset.purchasePrice - asset.salvageValue) / asset.usefulLife;
                  const totalDepreciation = asset.purchasePrice - asset.currentValue;
                  const remainingLife = asset.usefulLife - (totalDepreciation / annualDepreciation);
                  
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-500">{asset.assetNumber}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 capitalize">{asset.depreciationMethod.replace('_', ' ')}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">{formatCurrency(asset.purchasePrice)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(asset.currentValue)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-orange-600">{formatCurrency(annualDepreciation)}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm text-gray-900">{remainingLife.toFixed(1)} years</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}