import React, { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, Send, FileText } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import InvoiceForm from '../components/Forms/InvoiceForm';

const mockInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-001',
    customer: 'Acme Corporation',
    amount: 5250.00,
    status: 'paid',
    issueDate: '2025-01-10',
    dueDate: '2025-02-09',
    description: 'Website development services'
  },
  {
    id: 2,
    invoiceNumber: 'INV-002',
    customer: 'TechStart Inc',
    amount: 3800.00,
    status: 'sent',
    issueDate: '2025-01-12',
    dueDate: '2025-02-11',
    description: 'Consulting services'
  },
  {
    id: 3,
    invoiceNumber: 'INV-003',
    customer: 'Global Dynamics',
    amount: 2100.00,
    status: 'overdue',
    issueDate: '2024-12-15',
    dueDate: '2025-01-14',
    description: 'Software licensing'
  },
  {
    id: 4,
    invoiceNumber: 'INV-004',
    customer: 'Creative Solutions LLC',
    amount: 1200.00,
    status: 'draft',
    issueDate: '2025-01-15',
    dueDate: '2025-02-14',
    description: 'Logo design and branding'
  }
];

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [invoices] = useState(mockInvoices);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredInvoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstandingAmount = totalAmount - paidAmount;

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleSubmitInvoice = (invoiceData: any) => {
    console.log('Submitting invoice:', invoiceData);
    // Here you would typically make an API call to save the invoice
    setShowModal(false);
    setEditingInvoice(null);
  };

  const handleSendInvoice = (invoiceId: number) => {
    sendInvoice(invoiceId);
    alert('Invoice sent successfully!');
  };

  const handleDownloadInvoice = (invoiceId: number) => {
    downloadDocument('invoice', invoiceId);
  };

  const handleViewInvoice = (invoiceId: number) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
      setEditingInvoice(invoice);
      setShowModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Create, send, and track your invoices</p>
        </div>
        <Button onClick={handleAddInvoice}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Invoice Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${totalAmount.toFixed(2)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Paid Amount</p>
            <p className="text-2xl font-bold text-green-600 mt-1">${paidAmount.toFixed(2)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Outstanding</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">${outstandingAmount.toFixed(2)}</p>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">{invoice.issueDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.customer}</p>
                      <p className="text-sm text-gray-500">{invoice.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{invoice.dueDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-gray-500 hover:text-blue-600"
                        onClick={() => handleViewInvoice(invoice.id)}
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-blue-600" 
                        onClick={() => handleEditInvoice(invoice)}
                        title="Edit Invoice"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-green-600" 
                        onClick={() => handleSendInvoice(invoice.id)}
                        title="Send Invoice"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-blue-600" 
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by creating your first invoice'}
            </p>
            <Button onClick={handleAddInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
        size="xl"
      >
        <InvoiceForm
          invoice={editingInvoice}
          onSubmit={handleSubmitInvoice}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}