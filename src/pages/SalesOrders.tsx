import React, { useState } from 'react';
import { Plus, Search, Truck, Package, CheckCircle, Clock, Eye, Edit } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const mockSalesOrders = [
  {
    id: 1,
    orderNumber: 'SO-001',
    customer: 'Acme Corporation',
    orderDate: '2025-01-10',
    deliveryDate: '2025-01-25',
    status: 'confirmed',
    priority: 'high',
    subtotal: 5250.00,
    taxAmount: 525.00,
    total: 5775.00,
    items: [
      { product: 'Premium Widget A', quantity: 10, unitPrice: 450.00, amount: 4500.00 },
      { product: 'Standard Widget B', quantity: 5, unitPrice: 150.00, amount: 750.00 }
    ],
    shippingAddress: '123 Business Ave, New York, NY 10001',
    salesRep: 'John Smith'
  },
  {
    id: 2,
    orderNumber: 'SO-002',
    customer: 'TechStart Inc',
    orderDate: '2025-01-12',
    deliveryDate: '2025-01-28',
    status: 'pending_approval',
    priority: 'medium',
    subtotal: 3800.00,
    taxAmount: 380.00,
    total: 4180.00,
    items: [
      { product: 'Deluxe Widget C', quantity: 8, unitPrice: 475.00, amount: 3800.00 }
    ],
    shippingAddress: '456 Innovation Dr, San Francisco, CA 94105',
    salesRep: 'Jane Doe'
  },
  {
    id: 3,
    orderNumber: 'SO-003',
    customer: 'Global Dynamics',
    orderDate: '2025-01-08',
    deliveryDate: '2025-01-20',
    status: 'shipped',
    priority: 'low',
    subtotal: 2100.00,
    taxAmount: 210.00,
    total: 2310.00,
    items: [
      { product: 'Standard Widget B', quantity: 14, unitPrice: 150.00, amount: 2100.00 }
    ],
    shippingAddress: '789 Corporate Blvd, Chicago, IL 60601',
    salesRep: 'Bob Johnson'
  }
];

const mockDeliveryNotes = [
  {
    id: 1,
    deliveryNumber: 'DN-001',
    salesOrder: 'SO-003',
    customer: 'Global Dynamics',
    deliveryDate: '2025-01-18',
    status: 'delivered',
    items: [
      { product: 'Standard Widget B', quantity: 14, delivered: 14 }
    ],
    driver: 'Mike Wilson',
    vehicle: 'Truck-001'
  },
  {
    id: 2,
    deliveryNumber: 'DN-002',
    salesOrder: 'SO-001',
    customer: 'Acme Corporation',
    deliveryDate: '2025-01-20',
    status: 'in_transit',
    items: [
      { product: 'Premium Widget A', quantity: 10, delivered: 10 },
      { product: 'Standard Widget B', quantity: 5, delivered: 5 }
    ],
    driver: 'Sarah Davis',
    vehicle: 'Truck-002'
  }
];

export default function SalesOrders() {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = mockSalesOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalOrders = filteredOrders.length;
  const totalValue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending_approval').length;
  const shippedOrders = filteredOrders.filter(order => order.status === 'shipped').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Distribution</h1>
          <p className="text-gray-600">Manage sales orders, deliveries, and customer fulfillment</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Truck className="w-4 h-4 mr-2" />
            Delivery Schedule
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Sales Order
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${totalValue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shipped Orders</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{shippedOrders}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sales Orders
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'deliveries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Delivery Notes
          </button>
        </nav>
      </div>

      {/* Sales Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sales orders..."
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
                  <option value="pending_approval">Pending Approval</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Sales Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                          {order.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">{order.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="font-semibold text-gray-900">{order.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sales Rep</p>
                      <p className="font-semibold text-gray-900">{order.salesRep}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-green-600">${order.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.product} (x{item.quantity})</span>
                          <span className="font-medium text-gray-900">${item.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Order
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Notes Tab */}
      {activeTab === 'deliveries' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Notes</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Delivery Note
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Note
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockDeliveryNotes.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{delivery.deliveryNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{delivery.salesOrder}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{delivery.customer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{delivery.deliveryDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{delivery.driver}</p>
                        <p className="text-xs text-gray-500">{delivery.vehicle}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                        {delivery.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
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
    </div>
  );
}