import React, { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingDown, BarChart3, Edit, Eye } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import InventoryForm from '../components/Forms/InventoryForm';

const mockInventoryItems = [
  {
    id: 1,
    sku: 'LAPTOP-001',
    name: 'Business Laptop Pro',
    category: 'Electronics',
    unitOfMeasure: 'Each',
    quantityOnHand: 25,
    reorderLevel: 10,
    reorderQuantity: 50,
    costPrice: 899.00,
    sellingPrice: 1299.00,
    totalValue: 22475.00,
    status: 'in_stock',
    lastUpdated: '2025-01-15'
  },
  {
    id: 2,
    sku: 'DESK-002',
    name: 'Executive Office Desk',
    category: 'Furniture',
    unitOfMeasure: 'Each',
    quantityOnHand: 8,
    reorderLevel: 5,
    reorderQuantity: 20,
    costPrice: 450.00,
    sellingPrice: 699.00,
    totalValue: 3600.00,
    status: 'low_stock',
    lastUpdated: '2025-01-14'
  },
  {
    id: 3,
    sku: 'PAPER-003',
    name: 'Premium Copy Paper',
    category: 'Office Supplies',
    unitOfMeasure: 'Ream',
    quantityOnHand: 150,
    reorderLevel: 50,
    reorderQuantity: 200,
    costPrice: 8.50,
    sellingPrice: 12.99,
    totalValue: 1275.00,
    status: 'in_stock',
    lastUpdated: '2025-01-13'
  },
  {
    id: 4,
    sku: 'CHAIR-004',
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    unitOfMeasure: 'Each',
    quantityOnHand: 2,
    reorderLevel: 5,
    reorderQuantity: 15,
    costPrice: 280.00,
    sellingPrice: 449.00,
    totalValue: 560.00,
    status: 'critical',
    lastUpdated: '2025-01-12'
  }
];

const inventoryMovements = [
  { id: 1, date: '2025-01-15', item: 'Business Laptop Pro', type: 'Sale', quantity: -3, reference: 'INV-001' },
  { id: 2, date: '2025-01-14', item: 'Executive Office Desk', type: 'Sale', quantity: -2, reference: 'INV-002' },
  { id: 3, date: '2025-01-13', item: 'Premium Copy Paper', type: 'Purchase', quantity: 100, reference: 'PO-001' },
  { id: 4, date: '2025-01-12', item: 'Ergonomic Office Chair', type: 'Adjustment', quantity: -1, reference: 'ADJ-001' }
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('items');
  const [items] = useState(mockInventoryItems);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'out_of_stock': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalValue = filteredItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = filteredItems.filter(item => item.status === 'low_stock' || item.status === 'critical').length;

  const handleAddItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmitItem = (itemData: any) => {
    console.log('Submitting item:', itemData);
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      console.log('Deleting item:', itemId);
    }
  };

  const handleViewItem = (itemId: number) => {
    console.log('Viewing item:', itemId);
  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your stock levels and inventory</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Stock Report
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredItems.length}</p>
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
              <p className="text-2xl font-bold text-green-600 mt-1">${totalValue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-green-600 transform rotate-180" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{lowStockItems}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {new Set(filteredItems.map(item => item.category)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('items')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'items'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inventory Items
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'movements'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Stock Movements
          </button>
        </nav>
      </div>

      {/* Inventory Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items..."
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
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="critical">Critical</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Items Table */}
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Cost
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
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
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.sku}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{item.category}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="font-medium text-gray-900">{item.quantityOnHand}</p>
                          <p className="text-xs text-gray-500">{item.unitOfMeasure}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm text-gray-900">${item.costPrice.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-semibold text-gray-900">${item.totalValue.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-500 hover:text-blue-600" onClick={() => handleViewItem(item.id)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-blue-600" onClick={() => handleEditItem(item)}>
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
        </div>
      )}

      {/* Stock Movements Tab */}
      {activeTab === 'movements' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h2>
            <Button onClick={() => console.log('Adding stock adjustment')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Adjustment
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{movement.date}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{movement.item}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        movement.type === 'Sale' ? 'bg-red-100 text-red-800' :
                        movement.type === 'Purchase' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {movement.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className={`text-sm font-medium ${
                        movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{movement.reference}</p>
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
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        size="lg"
      >
        <InventoryForm
          item={editingItem}
          onSubmit={handleSubmitItem}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}