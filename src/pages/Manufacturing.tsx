import React, { useState } from 'react';
import { Plus, Search, Settings, Play, Pause, CheckCircle, Clock, Users, Package } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useGlobalState } from '../contexts/GlobalStateContext';

const mockWorkOrders = [
  {
    id: 1,
    workOrderNumber: 'WO-001',
    productName: 'Premium Widget A',
    quantity: 100,
    status: 'in_progress',
    priority: 'high',
    startDate: '2025-01-10',
    dueDate: '2025-01-25',
    completedQuantity: 65,
    assignedTo: 'Production Team A',
    estimatedCost: 5000.00,
    actualCost: 3250.00,
    materials: [
      { name: 'Steel Rod', required: 50, allocated: 50, consumed: 32 },
      { name: 'Plastic Housing', required: 100, allocated: 100, consumed: 65 }
    ]
  },
  {
    id: 2,
    workOrderNumber: 'WO-002',
    productName: 'Standard Widget B',
    quantity: 200,
    status: 'scheduled',
    priority: 'medium',
    startDate: '2025-01-20',
    dueDate: '2025-02-05',
    completedQuantity: 0,
    assignedTo: 'Production Team B',
    estimatedCost: 8000.00,
    actualCost: 0.00,
    materials: [
      { name: 'Aluminum Sheet', required: 100, allocated: 100, consumed: 0 },
      { name: 'Electronic Components', required: 200, allocated: 150, consumed: 0 }
    ]
  },
  {
    id: 3,
    workOrderNumber: 'WO-003',
    productName: 'Deluxe Widget C',
    quantity: 50,
    status: 'completed',
    priority: 'low',
    startDate: '2024-12-15',
    dueDate: '2025-01-05',
    completedQuantity: 50,
    assignedTo: 'Production Team A',
    estimatedCost: 3000.00,
    actualCost: 2850.00,
    materials: [
      { name: 'Premium Steel', required: 25, allocated: 25, consumed: 25 },
      { name: 'Gold Plating', required: 50, allocated: 50, consumed: 50 }
    ]
  }
];

const mockBillOfMaterials = [
  {
    id: 1,
    productCode: 'PWA-001',
    productName: 'Premium Widget A',
    version: '1.2',
    status: 'active',
    totalCost: 45.50,
    components: [
      { item: 'Steel Rod', quantity: 0.5, unit: 'kg', unitCost: 15.00, totalCost: 7.50 },
      { item: 'Plastic Housing', quantity: 1, unit: 'pcs', unitCost: 12.00, totalCost: 12.00 },
      { item: 'Screws', quantity: 4, unit: 'pcs', unitCost: 0.50, totalCost: 2.00 },
      { item: 'Labor', quantity: 2, unit: 'hrs', unitCost: 12.00, totalCost: 24.00 }
    ]
  },
  {
    id: 2,
    productCode: 'SWB-001',
    productName: 'Standard Widget B',
    version: '2.1',
    status: 'active',
    totalCost: 38.75,
    components: [
      { item: 'Aluminum Sheet', quantity: 0.5, unit: 'kg', unitCost: 18.00, totalCost: 9.00 },
      { item: 'Electronic Components', quantity: 1, unit: 'set', unitCost: 15.00, totalCost: 15.00 },
      { item: 'Packaging', quantity: 1, unit: 'pcs', unitCost: 2.75, totalCost: 2.75 },
      { item: 'Labor', quantity: 1, unit: 'hrs', unitCost: 12.00, totalCost: 12.00 }
    ]
  }
];

const mockProductionSchedule = [
  { id: 1, workOrder: 'WO-001', product: 'Premium Widget A', startTime: '08:00', endTime: '16:00', machine: 'Machine A1', operator: 'John Smith' },
  { id: 2, workOrder: 'WO-004', product: 'Standard Widget B', startTime: '09:00', endTime: '17:00', machine: 'Machine B2', operator: 'Jane Doe' },
  { id: 3, workOrder: 'WO-005', product: 'Deluxe Widget C', startTime: '10:00', endTime: '14:00', machine: 'Machine A2', operator: 'Bob Johnson' }
];

export default function Manufacturing() {
  const { formatCurrency } = useGlobalState();
  const [activeTab, setActiveTab] = useState('workorders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWorkOrders = mockWorkOrders.filter(wo => {
    const matchesSearch = wo.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
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

  const totalWorkOrders = filteredWorkOrders.length;
  const activeWorkOrders = filteredWorkOrders.filter(wo => wo.status === 'in_progress').length;
  const completedWorkOrders = filteredWorkOrders.filter(wo => wo.status === 'completed').length;
  const totalProduction = filteredWorkOrders.reduce((sum, wo) => sum + wo.completedQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manufacturing (MRP)</h1>
          <p className="text-gray-600">Manage production planning, work orders, and material requirements</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Settings className="w-4 h-4 mr-2" />
            Production Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Work Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalWorkOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Production</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{activeWorkOrders}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Play className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedWorkOrders}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Units Produced</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{totalProduction}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('workorders')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workorders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Work Orders
          </button>
          <button
            onClick={() => setActiveTab('bom')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bom'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bill of Materials
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Production Schedule
          </button>
        </nav>
      </div>

      {/* Work Orders Tab */}
      {activeTab === 'workorders' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search work orders..."
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
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Work Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkOrders.map((workOrder) => (
              <Card key={workOrder.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{workOrder.workOrderNumber}</h3>
                      <p className="text-sm text-gray-600">{workOrder.productName}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workOrder.status)}`}>
                          {workOrder.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(workOrder.priority)}`}>
                          {workOrder.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-semibold text-gray-900">{workOrder.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="font-semibold text-green-600">{workOrder.completedQuantity} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-semibold text-gray-900">{workOrder.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Assigned To</p>
                      <p className="font-semibold text-gray-900">{workOrder.assignedTo}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round((workOrder.completedQuantity / workOrder.quantity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(workOrder.completedQuantity / workOrder.quantity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {workOrder.startDate} - {workOrder.dueDate}
                    </div>
                    <div className="text-sm text-gray-600">
                      Cost: {formatCurrency(workOrder.actualCost)} / {formatCurrency(workOrder.estimatedCost)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Update Progress
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bill of Materials Tab */}
      {activeTab === 'bom' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Bill of Materials</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create BOM
              </Button>
            </div>

            <div className="space-y-6">
              {mockBillOfMaterials.map((bom) => (
                <div key={bom.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bom.productName}</h3>
                      <p className="text-sm text-gray-600">{bom.productCode} - Version {bom.version}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-lg font-bold text-green-600">${bom.totalCost.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bom.components.map((component, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{component.item}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">{component.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{component.unit}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">${component.unitCost.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">${component.totalCost.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Production Schedule Tab */}
      {activeTab === 'schedule' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Today's Production Schedule</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Production
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Slot
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Machine
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operator
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockProductionSchedule.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-gray-900">{schedule.workOrder}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{schedule.product}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{schedule.startTime} - {schedule.endTime}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{schedule.machine}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-900">{schedule.operator}</p>
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