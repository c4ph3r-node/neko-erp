import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, CheckCircle, Clock, Filter } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { purchaseOrderService } from '../../services/purchase-order.service';

export default function PurchaseOrdersList({ tenantId }: { tenantId: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [tenantId]);

  useEffect(() => {
    let filtered = orders;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    if (approvalFilter !== 'all') {
      filtered = filtered.filter(o => o.approval_status === approvalFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(o =>
        o.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  }, [orders, statusFilter, approvalFilter, searchTerm]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await purchaseOrderService.getOrders(tenantId);
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading POs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this PO?')) {
      try {
        await purchaseOrderService.deleteOrder(id);
        setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        console.error('Error deleting PO:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      sent: 'bg-indigo-100 text-indigo-800',
      received: 'bg-purple-100 text-purple-800',
      invoiced: 'bg-orange-100 text-orange-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getApprovalColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-50 text-yellow-700',
      approved: 'bg-green-50 text-green-700',
      rejected: 'bg-red-50 text-red-700'
    };
    return colors[status] || 'bg-gray-50 text-gray-700';
  };

  const stats = {
    total: filteredOrders.length,
    pending_approval: filteredOrders.filter(o => o.approval_status === 'pending').length,
    approved: filteredOrders.filter(o => o.approval_status === 'approved').length,
    spend: filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total POs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending_approval}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Spend</p>
            <p className="text-2xl font-bold text-blue-600">${(stats.spend / 1000).toFixed(0)}k</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search POs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="sent">Sent</option>
          </select>
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Approvals</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading POs...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No purchase orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">PO #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Approval</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.po_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.vendor?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.po_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">${order.total?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getApprovalColor(order.approval_status)}`}>
                        {order.approval_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="View">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        {order.approval_status === 'pending' && (
                          <button className="p-1 hover:bg-gray-100 rounded" title="Approve">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
