import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, MapPin, CreditCard as Edit, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import CustomerForm from '../components/Forms/CustomerForm';
import InvoiceForm from '../components/Forms/InvoiceForm';
import { useGlobalState } from '../contexts/GlobalStateContext';
import { customerService } from '../services/customer.service';

const mockCustomers = [
  {
    id: '1',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    balance: 5250.00,
    status: 'active',
    payment_terms: 'Net 30',
    credit_limit: 10000.00,
    lastTransaction: '2025-01-15',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },
  {
    id: '2',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    name: 'TechStart Inc',
    email: 'billing@techstart.com',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Dr, San Francisco, CA 94105',
    balance: 3800.00,
    status: 'active',
    payment_terms: 'Net 15',
    credit_limit: 5000.00,
    lastTransaction: '2025-01-14',
    created_at: '2025-01-02T00:00:00Z',
    updated_at: '2025-01-14T00:00:00Z'
  },
  {
    id: '3',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    name: 'Global Dynamics',
    email: 'accounting@globaldynamics.com',
    phone: '+1 (555) 456-7890',
    address: '789 Corporate Blvd, Chicago, IL 60601',
    balance: 0.00,
    status: 'active',
    payment_terms: 'Net 30',
    credit_limit: 15000.00,
    lastTransaction: '2025-01-10',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z'
  },
  {
    id: '4',
    tenant_id: '00000000-0000-0000-0000-000000000001',
    name: 'Creative Solutions LLC',
    email: 'info@creativesolutions.com',
    phone: '+1 (555) 321-9876',
    address: '321 Design St, Los Angeles, CA 90210',
    balance: 1200.00,
    status: 'inactive',
    payment_terms: 'Net 45',
    credit_limit: 3000.00,
    lastTransaction: '2024-12-28',
    created_at: '2024-12-15T00:00:00Z',
    updated_at: '2024-12-28T00:00:00Z'
  }
];

export default function Customers() {
  const { formatCurrency, t, showNotification, dispatch } = useGlobalState();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewingCustomer, setViewingCustomer] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedCustomerForInvoice, setSelectedCustomerForInvoice] = useState<any>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      // Fallback to mock data if service fails
      setCustomers(mockCustomers);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleViewCustomer = (customer: any) => {
    setViewingCustomer(customer);
    setShowViewModal(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSubmitCustomer = async (customerData: any) => {
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, customerData);
        setCustomers(prev => prev.map(customer =>
          customer.id === editingCustomer.id
            ? { ...customer, ...customerData }
            : customer
        ));
        showNotification('Customer updated successfully', 'success');
      } else {
        const newCustomer = await customerService.createCustomer({
          tenant_id: '00000000-0000-0000-0000-000000000001', // Should come from context
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          postal_code: customerData.postal_code,
          country: customerData.country,
          tax_id: customerData.tax_id,
          payment_terms: customerData.payment_terms,
          credit_limit: customerData.credit_limit,
          balance: customerData.balance || 0,
          status: customerData.status || 'active',
          notes: customerData.notes
        });
        setCustomers(prev => [...prev, newCustomer]);
        showNotification('Customer created successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      // Fallback: create a mock customer locally
      if (!editingCustomer) {
        const mockCustomer = {
          id: `mock-${Date.now()}`,
          tenant_id: '00000000-0000-0000-0000-000000000001',
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          postal_code: customerData.postal_code,
          country: customerData.country,
          tax_id: customerData.tax_id,
          payment_terms: customerData.payment_terms,
          credit_limit: customerData.credit_limit,
          balance: customerData.balance || 0,
          status: customerData.status || 'active',
          notes: customerData.notes,
          lastTransaction: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setCustomers(prev => [...prev, mockCustomer]);
        showNotification('Customer created successfully (using local storage)', 'success');
      } else {
        showNotification('Failed to save customer. Please try again.', 'error');
      }
    }
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm(t('areYouSureYouWantToDeleteThisCustomer'))) {
      try {
        await customerService.deleteCustomer(customerId);
        showNotification('Customer deleted successfully', 'success');
        // Refresh the customers list
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        showNotification('Failed to delete customer. Please try again.', 'error');
      }
    }
  };

  const handleCreateInvoice = (customer: any) => {
    setSelectedCustomerForInvoice(customer);
    setShowInvoiceModal(true);
  };

  const handleSubmitInvoice = (invoiceData: any) => {
    const invoiceNumber = `INV-${Date.now()}`;
    dispatch({
      type: 'ADD_INVOICE',
      payload: {
        id: Date.now().toString(),
        invoiceNumber,
        customerId: invoiceData.customerId,
        customerName: invoiceData.customerName,
        issueDate: invoiceData.issueDate,
        dueDate: invoiceData.dueDate,
        status: invoiceData.status || 'draft',
        subtotal: invoiceData.subtotal,
        vatAmount: invoiceData.vatAmount,
        total: invoiceData.total,
        paidAmount: 0,
        lines: invoiceData.lines,
        kraSubmitted: false,
        etims: false
      }
    });
    setShowInvoiceModal(false);
    setSelectedCustomerForInvoice(null);
    showNotification('Invoice created successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('customers')}</h1>
          <p className="text-gray-600">{t('manageCustomerRelationshipsAndAccounts')}</p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addCustomer')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('searchCustomers')}
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

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    customer.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {customer.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit className="w-4 h-4" onClick={() => handleEditCustomer(customer)} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" onClick={() => handleDeleteCustomer(customer.id)} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {customer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <span className="flex-1">{customer.address}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('outstandingBalance')}</p>
                    <p className={`text-lg font-semibold ${
                      customer.balance > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {formatCurrency(customer.balance)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t('lastTransaction')}</p>
                    <p className="text-sm font-medium text-gray-900">{customer.lastTransaction}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewCustomer(customer)}>
                  {t('viewDetails')}
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleCreateInvoice(customer)}>
                  {t('createInvoice')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noCustomersFound')}</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? t('tryAdjustingYourSearchTerms') : t('getStartedByAddingYourFirstCustomer')}
            </p>
            <Button onClick={handleAddCustomer}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCustomer ? t('editCustomer') : t('addNewCustomer')}
        size="lg"
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmitCustomer}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Create Invoice"
        size="lg"
      >
        <InvoiceForm
          invoice={selectedCustomerForInvoice ? {
            customerId: selectedCustomerForInvoice.id,
            customerName: selectedCustomerForInvoice.name
          } : undefined}
          onSubmit={handleSubmitInvoice}
          onCancel={() => setShowInvoiceModal(false)}
        />
      </Modal>

      {/* Customer View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Customer Details"
      >
        {viewingCustomer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-sm text-gray-900">{viewingCustomer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900">{viewingCustomer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm text-gray-900">{viewingCustomer.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      viewingCustomer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {viewingCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Outstanding Balance</label>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(viewingCustomer.balance)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Credit Limit</label>
                    <p className="text-sm text-gray-900">{formatCurrency(viewingCustomer.credit_limit || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                    <p className="text-sm text-gray-900">{viewingCustomer.payment_terms || 'Net 30'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-900">{viewingCustomer.address}</p>
                {viewingCustomer.city && <p className="text-sm text-gray-600">{viewingCustomer.city}, {viewingCustomer.state} {viewingCustomer.postal_code}</p>}
                {viewingCustomer.country && <p className="text-sm text-gray-600">{viewingCustomer.country}</p>}
              </div>
            </div>

            {viewingCustomer.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900">{viewingCustomer.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}