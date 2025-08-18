import React, { useState } from 'react';
import { Plus, Search, FileText, Clock, CheckCircle, AlertTriangle, Eye, Edit, Send, Download } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import PurchaseOrderForm from '../components/Forms/PurchaseOrderForm';

const mockPurchaseOrders = [
  {
    id: 1,
    poNumber: 'PO-001',
    vendor: 'Office Supplies Co.',
    orderDate: '2025-01-10',
    deliveryDate: '2025-01-25',
    status: 'approved',
    priority: 'high',
    subtotal: 2500.00,
    taxAmount: 250.00,
    total: 2750.00,
    items: [
      { product: 'Office Chairs', quantity: 10, unitPrice: 150.00, amount: 1500.00 },
      { product: 'Desk Supplies', quantity: 20, unitPrice: 50.00, amount: 1000.00 }
    ],
    approvedBy: 'John Smith',
    requestedBy: 'Jane Doe',
    department: 'Administration'
  },
  {
    id: 2,
    poNumber: 'PO-002',
    vendor: 'Tech Equipment Ltd',
    orderDate: '2025-01-12',
    deliveryDate: '2025-01-28',
    status: 'pending_approval',
    priority: 'medium',
    subtotal: 5200.00,
    taxAmount: 520.00,
    total: 5720.00,
    items: [
      { product: 'Laptops', quantity: 4, unitPrice: 1200.00, amount: 4800.00 },
      { product: 'Monitors', quantity: 4, unitPrice: 100.00, amount: 400.00 }
    ],
    approvedBy: null,
    requestedBy: 'Bob Johnson',
    department: 'IT'
  },
  {
    id: 3,
    poNumber: 'PO-003',
    vendor: 'Manufacturing Supplies Inc',
    orderDate: '2025-01-08',
    deliveryDate: '2025-01-20',
    status: 'received',
    priority: 'low',
    subtotal: 1800.00,
    taxAmount: 180.00,
    total: 1980.00,
    items: [
      { product: 'Raw Materials', quantity: 100, unitPrice: 18.00, amount: 1800.00 }
    ],
    approvedBy: 'Alice Brown',
    requestedBy: 'Mike Wilson',
    department: 'Production'
  }
];

const mockRequisitions = [
  {
    id: 1,
    reqNumber: 'REQ-001',
    requestedBy: 'Sarah Davis',
    department: 'Marketing',
    requestDate: '2025-01-14',
    status: 'approved',
    priority: 'medium',
    totalEstimate: 1200.00,
    items: [
      { description: 'Marketing Materials', quantity: 500, estimatedCost: 1200.00 }
    ]
  },
  {
    id: 2,
    reqNumber: 'REQ-002',
    requestedBy: 'Tom Anderson',
    department: 'Engineering',
    requestDate: '2025-01-15',
    status: 'pending',
    priority: 'high',
    totalEstimate: 3500.00,
    items: [
      { description: 'Engineering Tools', quantity: 5, estimatedCost: 3500.00 }
    ]
  }
];

export default function PurchaseOrders() {
  const [activeTab, setActiveTab] = useState('purchase_orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPO, setEditingPO] = useState<any>(null);

  const filteredPOs = mockPurchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-blue-100 text-blue-800';
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

  const totalPOs = filteredPOs.length;
  const totalValue = filteredPOs.reduce((sum, po) => sum + po.total, 0);
  const pendingApproval = filteredPOs.filter(po => po.status === 'pending_approval').length;
  const approvedPOs = filteredPOs.filter(po => po.status === 'approved').length;

  const handleAddPO = () => {
    setEditingPO(null);
    setShowModal(true);
  };

  const handleEditPO = (po: any) => {
    setEditingPO(po);
    setShowModal(true);
  };

  const handleSubmitPO = (poData: any) => {
    console.log('Submitting PO:', poData);
    setShowModal(false);
    setEditingPO(null);
  };

  const handleApprovePO = (poId: number) => {
    console.log('Approving PO:', poId);
  };

  const handleSendPO = (poId: number) => {
    console.log('Sending PO:', poId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement & Purchase Orders</h1>
          <p className="text-gray-600">Manage purchase requisitions, orders, and supplier relationships</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <FileText className="w-4 h-4 mr-2" />
            Purchase Reports
          </Button>
          <Button onClick={handleAddPO}>
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Purchase Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalPOs}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
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
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingApproval}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Orders</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{approvedPOs}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('purchase_orders')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'purchase_orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Purchase Orders
          </button>
          <button
            onClick={() => setActiveTab('requisitions')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requisitions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Purchase Requisitions
          </button>
        </nav>
      </div>

      {/* Purchase Orders Tab */}
      {activeTab === 'purchase_orders' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search purchase orders..."
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
                  <option value="approved">Approved</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Purchase Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPOs.map((po) => (
              <Card key={po.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{po.poNumber}</h3>
                      <p className="text-sm text-gray-600">{po.vendor}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(po.status)}`}>
                          {po.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(po.priority)}`}>
                          {po.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold text-gray-900">{po.orderDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="font-semibold text-gray-900">{po.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Requested By</p>
                      <p className="font-semibold text-gray-900">{po.requestedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-green-600">${po.total.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {po.items.map((item, index) => (
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
                    {po.status === 'pending_approval' && (
                      <Button size="sm" className="flex-1" onClick={() => handleApprovePO(po.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {po.status === 'approved' && (
                      <Button size="sm" className="flex-1" onClick={() => handleSendPO(po.id)}>
                        <Send className="w-4 h-4 mr-2" />
                        Send to Vendor
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Purchase Requisitions Tab */}
      {activeTab === 'requisitions' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Purchase Requisitions</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Requisition
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requisition #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimated Cost
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
                {mockRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{req.reqNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{req.requestedBy}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{req.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{req.requestDate}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-gray-900">${req.totalEstimate.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(req.status)}`}>
                        {req.status.toUpperCase()}
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

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPO ? 'Edit Purchase Order' : 'Create New Purchase Order'}
        size="xl"
      >
        <PurchaseOrderForm
          purchaseOrder={editingPO}
          onSubmit={handleSubmitPO}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}