import React, { useState } from 'react';
import { Plus, Search, Truck, Package, CheckCircle, Clock, Eye, Edit } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import { SalesOrderForm } from '../components/SO';
import { useGlobalState } from '../contexts/GlobalStateContext';
import { salesOrderService } from '../services/sales-order.service';

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
  const { showNotification } = useGlobalState();
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [salesOrders, setSalesOrders] = useState(mockSalesOrders);
  const [deliveryNotes, setDeliveryNotes] = useState(mockDeliveryNotes);
  const [showDeliverySchedule, setShowDeliverySchedule] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const filteredOrders = salesOrders.filter(order => {
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

  const handleViewDetails = (order: any) => {
    setViewingOrder(order);
    setShowViewModal(true);
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowOrderModal(true);
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setShowOrderModal(true);
  };

  const handleSubmitOrder = async (orderData: any) => {
    try {
      if (editingOrder) {
        await salesOrderService.updateOrder(editingOrder.id, orderData);
        setSalesOrders(prev => prev.map(order => 
          order.id === editingOrder.id 
            ? { ...order, ...orderData }
            : order
        ));
        showNotification(`Sales Order ${orderData.order_number} has been updated successfully!`, 'success');
      } else {
        const newOrder = await salesOrderService.createOrder({
          tenant_id: '00000000-0000-0000-0000-000000000001', // Should come from context
          order_number: orderData.order_number,
          customer_id: orderData.customer_id,
          order_date: orderData.order_date,
          delivery_date: orderData.delivery_date,
          status: orderData.status,
          payment_status: orderData.payment_status,
          fulfillment_status: orderData.fulfillment_status,
          currency: orderData.currency,
          subtotal: orderData.subtotal,
          discount_amount: orderData.discount_amount,
          tax_amount: orderData.tax_amount,
          total: orderData.total,
          notes: orderData.notes,
          internal_notes: orderData.internal_notes
        });

        // Add the order lines
        for (const line of orderData.lines) {
          // Note: In a real implementation, you'd create order lines here
          // For now, we'll just add to local state
        }

        setSalesOrders(prev => [...prev, {
          ...newOrder,
          customer: { name: 'Customer Name' }, // This should be fetched
          items: orderData.lines
        }]);
        showNotification(`Sales Order ${newOrder.order_number} has been created successfully!`, 'success');
      }
    } catch (error) {
      console.error('Error saving sales order:', error);
      showNotification('Failed to save sales order. Please try again.', 'error');
    }
    setShowOrderModal(false);
    setEditingOrder(null);
  };

  const handleApproveOrder = (orderId: number) => {
    setSalesOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'confirmed' }
        : order
    ));
    showNotification(`Sales Order ${orderId} has been approved and confirmed!`, 'success');
  };

  const handleShipOrder = (orderId: number) => {
    setSalesOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'shipped' }
        : order
    ));
    showNotification(`Sales Order ${orderId} has been marked as shipped!`, 'success');
  };

  const handleCreateDeliveryNote = (order: any) => {
    const newDeliveryNote = {
      id: deliveryNotes.length + 1,
      deliveryNumber: `DN-${String(deliveryNotes.length + 1).padStart(3, '0')}`,
      salesOrder: order.orderNumber,
      customer: order.customer,
      deliveryDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      items: order.items.map((item: any) => ({
        product: item.product,
        quantity: item.quantity,
        delivered: 0
      })),
      driver: 'TBD',
      vehicle: 'TBD'
    };
    setDeliveryNotes(prev => [...prev, newDeliveryNote]);
    showNotification(`Delivery note created for order: ${order.orderNumber}`, 'success');
  };

  const handleViewDeliveryNote = (delivery: any) => {
    showNotification(`Viewing delivery note: ${delivery.deliveryNumber}, Sales Order: ${delivery.salesOrder}, Customer: ${delivery.customer}, Status: ${delivery.status}`, 'info');
  };

  const handleEditDeliveryNote = (delivery: any) => {
    showNotification(`Editing delivery note: ${delivery.deliveryNumber}`, 'info');
  };

  const handleDeliverySchedule = () => {
    setActiveTab('deliveries');
    setShowDeliverySchedule(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Distribution</h1>
          <p className="text-gray-600">Manage sales orders, deliveries, and customer fulfillment</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleDeliverySchedule}>
            <Truck className="w-4 h-4 mr-2" />
            Delivery Schedule
          </Button>
          <Button onClick={handleAddOrder}>
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
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleViewDetails(order)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleEditOrder(order)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Order
                    </Button>
                    {order.status === 'pending_approval' && (
                      <Button size="sm" className="flex-1" onClick={() => handleApproveOrder(order.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button size="sm" className="flex-1" onClick={() => handleShipOrder(order.id)}>
                        <Truck className="w-4 h-4 mr-2" />
                        Ship Order
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button variant="secondary" size="sm" className="flex-1" onClick={() => handleCreateDeliveryNote(order)}>
                        <Package className="w-4 h-4 mr-2" />
                        Create DN
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Notes Tab */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          {showDeliverySchedule ? (
            /* Delivery Schedule View */
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Delivery Schedule</h2>
                <Button variant="secondary" onClick={() => setShowDeliverySchedule(false)}>
                  Back to Delivery Notes
                </Button>
              </div>

              <div className="space-y-4">
                {/* Today's Deliveries */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Today's Deliveries</h3>
                  <div className="space-y-2">
                    {deliveryNotes
                      .filter(delivery => delivery.deliveryDate === new Date().toISOString().split('T')[0])
                      .map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{delivery.deliveryNumber}</p>
                            <p className="text-sm text-gray-600">Order: {delivery.salesOrder} • Customer: {delivery.customer}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{delivery.driver}</p>
                            <p className="text-sm text-gray-600">{delivery.vehicle}</p>
                          </div>
                        </div>
                      ))}
                    {deliveryNotes.filter(delivery => delivery.deliveryDate === new Date().toISOString().split('T')[0]).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No deliveries scheduled for today</p>
                    )}
                  </div>
                </div>

                {/* Upcoming Deliveries */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Upcoming Deliveries</h3>
                  <div className="space-y-2">
                    {deliveryNotes
                      .filter(delivery => delivery.deliveryDate > new Date().toISOString().split('T')[0])
                      .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate))
                      .map((delivery) => (
                        <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{delivery.deliveryNumber}</p>
                            <p className="text-sm text-gray-600">Order: {delivery.salesOrder} • Customer: {delivery.customer}</p>
                            <p className="text-sm text-gray-500">Scheduled: {new Date(delivery.deliveryDate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{delivery.driver}</p>
                            <p className="text-sm text-gray-600">{delivery.vehicle}</p>
                          </div>
                        </div>
                      ))}
                    {deliveryNotes.filter(delivery => delivery.deliveryDate > new Date().toISOString().split('T')[0]).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No upcoming deliveries scheduled</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            /* Delivery Notes List View */
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
                {deliveryNotes.map((delivery) => (
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
                        <button className="p-1 text-gray-500 hover:text-blue-600" onClick={() => handleViewDeliveryNote(delivery)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-blue-600" onClick={() => handleEditDeliveryNote(delivery)}>
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
      )}

      {/* Sales Order Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={editingOrder ? 'Edit Sales Order' : 'Create New Sales Order'}
      >
        <SalesOrderForm
          initialData={editingOrder}
          onSubmit={handleSubmitOrder}
          onCancel={() => setShowOrderModal(false)}
        />
      </Modal>

      {/* Sales Order View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Sales Order Details"
      >
        {viewingOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Number</label>
                    <p className="text-sm text-gray-900">{viewingOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Customer</label>
                    <p className="text-sm text-gray-900">{viewingOrder.customer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Date</label>
                    <p className="text-sm text-gray-900">{viewingOrder.orderDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Delivery Date</label>
                    <p className="text-sm text-gray-900">{viewingOrder.deliveryDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(viewingOrder.status)}`}>
                      {viewingOrder.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(viewingOrder.priority)}`}>
                      {viewingOrder.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Subtotal</label>
                    <p className="text-lg font-semibold text-gray-900">${viewingOrder.subtotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tax Amount</label>
                    <p className="text-sm text-gray-900">${viewingOrder.taxAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total</label>
                    <p className="text-xl font-bold text-green-600">${viewingOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {viewingOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.product}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                      </div>
                      <p className="font-semibold text-gray-900">${item.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900">{viewingOrder.shippingAddress}</p>
                  <p className="text-sm text-gray-600 mt-2">Sales Rep: {viewingOrder.salesRep}</p>
                </div>
              </div>

              {viewingOrder.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{viewingOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}