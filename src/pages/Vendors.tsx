import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, MapPin, CreditCard as Edit, Trash2, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
// import VendorForm from '../components/Forms/VendorForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

const mockVendors = [
  {
    id: 1,
    name: 'Office Supplies Co.',
    email: 'billing@officesupplies.com',
    phone: '+1 (555) 234-5678',
    address: '456 Supply St, Business City, BC 12345',
    balance: -2500.00,
    status: 'active',
    paymentTerms: 30,
    lastTransaction: '2025-01-14'
  },
  {
    id: 2,
    name: 'Tech Equipment Ltd',
    email: 'accounts@techequipment.com',
    phone: '+1 (555) 345-6789',
    address: '789 Tech Ave, Innovation City, IC 67890',
    balance: -5200.00,
    status: 'active',
    paymentTerms: 45,
    lastTransaction: '2025-01-12'
  },
  {
    id: 3,
    name: 'Marketing Agency Pro',
    email: 'finance@marketingpro.com',
    phone: '+1 (555) 456-7890',
    address: '321 Creative Blvd, Design City, DC 54321',
    balance: 0.00,
    status: 'active',
    paymentTerms: 15,
    lastTransaction: '2025-01-08'
  },
  {
    id: 4,
    name: 'Legal Services Inc',
    email: 'billing@legalservices.com',
    phone: '+1 (555) 567-8901',
    address: '654 Law St, Justice City, JC 98765',
    balance: -1800.00,
    status: 'inactive',
    paymentTerms: 30,
    lastTransaction: '2024-12-20'
  }
];

export default function Vendors() {
  const { showNotification, formatCurrency, t } = useGlobalState();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [vendors] = useState(mockVendors);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = () => {
    setEditingVendor(null);
    setShowModal(true);
  };

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor);
    setShowModal(true);
  };

  const handleSubmitVendor = (vendorData: any) => {
    showNotification('Vendor saved successfully', 'success');
    // Here you would typically make an API call to save the vendor
    setShowModal(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = (vendorId: number) => {
    if (confirm(t('areYouSureYouWantToDeleteThisVendor'))) {
      showNotification('Vendor deleted successfully', 'success');
      // Here you would typically make an API call to delete the vendor
    }
  };

  const handleViewVendorDetails = (vendorId: number) => {
    showNotification('Vendor details view would open here', 'info');
  };

  const handleCreateBill = (vendorId: number) => {
    showNotification('Bill creation form would open here', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('vendors')}</h1>
          <p className="text-gray-600">{t('manageVendorRelationshipsAndAccounts')}</p>
        </div>
        <Button onClick={handleAddVendor}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addVendor')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Vendors</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{filteredVendors.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Outstanding Payables</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              ${formatCurrency(Math.abs(filteredVendors.reduce((sum, v) => sum + v.balance, 0)))}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Active Vendors</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {filteredVendors.filter(v => v.status === 'active').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('searchVendors')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>{t('allStatus')}</option>
              <option>{t('active')}</option>
              <option>{t('inactive')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    vendor.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {vendor.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit className="w-4 h-4" onClick={() => handleEditVendor(vendor)} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" onClick={() => handleDeleteVendor(vendor.id)} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {vendor.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {vendor.phone}
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <span className="flex-1">{vendor.address}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('outstandingBalance')}</p>
                    <p className={`text-lg font-semibold ${
                      vendor.balance < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {formatCurrency(Math.abs(vendor.balance))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t('paymentTerms')}</p>
                    <p className="text-sm font-medium text-gray-900">{vendor.paymentTerms} days</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewVendorDetails(vendor.id)}>
                  {t('viewDetails')}
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleCreateBill(vendor.id)}>
                  {t('createPurchaseOrder')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noVendorsFound')}</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? t('tryAdjustingYourSearchTerms') : t('getStartedByAddingYourFirstVendor')}
            </p>
            <Button onClick={handleAddVendor}>
              <Plus className="w-4 h-4 mr-2" />
              {t('addVendor')}
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingVendor ? t('editVendor') : t('addNewVendor')}
        size="lg"
      >
        {/* <VendorForm
          vendor={editingVendor}
          onSubmit={handleSubmitVendor}
          onCancel={() => setShowModal(false)}
        /> */}
      </Modal>
    </div>
  );
}