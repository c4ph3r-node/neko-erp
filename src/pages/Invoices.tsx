import React, { useState } from 'react';
import { Plus, Search, FileText, Send, Download, Eye, Edit, Trash2, CheckCircle, Clock, DollarSign, Mail, Printer, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import InvoiceForm from '../components/Forms/InvoiceForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  draft: Clock,
  sent: Send,
  viewed: Eye,
  paid: CheckCircle,
  overdue: Clock,
  cancelled: Trash2
};

export default function Invoices() {
  const { state, dispatch, formatCurrency, showNotification } = useGlobalState();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const filteredInvoices = state.invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = (invoiceData) => {
    dispatch({
      type: 'ADD_INVOICE',
      payload: {
        ...invoiceData,
        id: Date.now(),
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    setShowCreateModal(false);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoice) => {
    // Navigate to edit form or open edit modal
    showNotification('Edit invoice functionality would open here', 'info');
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch({
        type: 'DELETE_INVOICE',
        payload: invoiceId
      });
    }
  };

  const handleSendInvoice = (invoice) => {
    dispatch({
      type: 'UPDATE_INVOICE',
      payload: { ...invoice, status: 'sent', sentAt: new Date() }
    });
  };

  const handleMarkAsPaid = (invoice) => {
    dispatch({
      type: 'UPDATE_INVOICE',
      payload: { ...invoice, status: 'paid', paidAt: new Date() }
    });
  };

  const getTotalOutstanding = () => {
    return filteredInvoices
      .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + (inv.total - (inv.paidAmount || 0)), 0);
  };

  const getTotalRevenue = () => {
    return filteredInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText size={32} className="text-blue-600" />
            Invoice Management
          </h1>
          <p className="text-gray-600 mt-1">Create, send, and track customer invoices</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(getTotalOutstanding())}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid This Month</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalRevenue())}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredInvoices.filter(inv => inv.status === 'overdue').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="viewed">Viewed</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Button variant="secondary" className="flex items-center gap-2">
            <Filter size={18} />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => {
                const StatusIcon = statusIcons[invoice.status] || Clock;
                return (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{invoice.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                      {invoice.paidAmount > 0 && (
                        <div className="text-sm text-green-600">Paid: {formatCurrency(invoice.paidAmount)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => handleSendInvoice(invoice)}
                            className="text-green-600 hover:text-green-900"
                            title="Send"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice)}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Paid"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first invoice.'}
            </p>
            <div className="mt-6">
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus size={18} className="mr-2" />
                Create Invoice
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Invoice"
      >
        <InvoiceForm
          onSubmit={handleCreateInvoice}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={`Invoice ${selectedInvoice?.invoiceNumber}`}
        size="large"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Invoice Details</h3>
                  <p><strong>Number:</strong> {selectedInvoice.invoiceNumber}</p>
                  <p><strong>Customer:</strong> {selectedInvoice.customer}</p>
                  <p><strong>Issue Date:</strong> {new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                  <p><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Financial Summary</h3>
                  <p><strong>Subtotal:</strong> {formatCurrency(selectedInvoice.subtotal)}</p>
                  <p><strong>Tax:</strong> {formatCurrency(selectedInvoice.taxAmount)}</p>
                  <p><strong>Total:</strong> {formatCurrency(selectedInvoice.total)}</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedInvoice.status]}`}>
                      {selectedInvoice.status?.charAt(0).toUpperCase() + selectedInvoice.status?.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Invoice Items</h3>
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2">{item.description}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-2">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Download size={16} />
                Download PDF
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Mail size={16} />
                Send Email
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <Printer size={16} />
                Print
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}