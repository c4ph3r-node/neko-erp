import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, MapPin, CreditCard as Edit, Trash2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import CustomerForm from '../components/Forms/CustomerForm';

const mockCustomers = [
  {
    id: 1,
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    balance: 5250.00,
    status: 'active',
    lastTransaction: '2025-01-15'
  },
  {
    id: 2,
    name: 'TechStart Inc',
    email: 'billing@techstart.com',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Dr, San Francisco, CA 94105',
    balance: 3800.00,
    status: 'active',
    lastTransaction: '2025-01-14'
  },
  {
    id: 3,
    name: 'Global Dynamics',
    email: 'accounting@globaldynamics.com',
    phone: '+1 (555) 456-7890',
    address: '789 Corporate Blvd, Chicago, IL 60601',
    balance: 0.00,
    status: 'active',
    lastTransaction: '2025-01-10'
  },
  {
    id: 4,
    name: 'Creative Solutions LLC',
    email: 'info@creativesolutions.com',
    phone: '+1 (555) 321-9876',
    address: '321 Design St, Los Angeles, CA 90210',
    balance: 1200.00,
    status: 'inactive',
    lastTransaction: '2024-12-28'
  }
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers] = useState(mockCustomers);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleSubmitCustomer = (customerData: any) => {
    console.log('Submitting customer:', customerData);
    // Here you would typically make an API call to save the customer
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      console.log('Deleting customer:', customerId);
      // Here you would typically make an API call to delete the customer
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships and accounts</p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
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
                    <p className="text-sm text-gray-600">Outstanding Balance</p>
                    <p className={`text-lg font-semibold ${
                      customer.balance > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      ${customer.balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last Transaction</p>
                    <p className="text-sm font-medium text-gray-900">{customer.lastTransaction}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Create Invoice
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first customer'}
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
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        size="lg"
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmitCustomer}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}