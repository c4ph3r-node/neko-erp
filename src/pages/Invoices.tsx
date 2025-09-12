import React, { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, Send, FileText, Building2, CheckCircle, Printer, Mail, Copy } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import InvoiceForm from '../components/Forms/InvoiceForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

export default function Invoices() {
  const { state, addInvoice, updateInvoice, payInvoice, sendInvoice, downloadDocument, submitToKra } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  const filteredInvoices = state.invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
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

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = filteredInvoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + invoice.total, 0);
  const outstandingAmount = totalAmount - paidAmount;
  const vatAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.vatAmount, 0);

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice: any) => {
    if (invoice.status === 'paid') {
      alert('Cannot edit paid invoices');
      return;
    }
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      const details = `Invoice Details:\n\nInvoice Number: ${invoice.invoiceNumber}\nCustomer: ${invoice.customerName}\nIssue Date: ${invoice.issueDate.toISOString().split('T')[0]}\nDue Date: ${invoice.dueDate.toISOString().split('T')[0]}\nStatus: ${invoice.status}\n\nSubtotal: KES ${invoice.subtotal.toLocaleString()}\nVAT (16%): KES ${invoice.vatAmount.toLocaleString()}\nTotal: KES ${invoice.total.toLocaleString()}\nPaid: KES ${invoice.paidAmount.toLocaleString()}\nOutstanding: KES ${(invoice.total - invoice.paidAmount).toLocaleString()}\n\nKRA Status: ${invoice.kraSubmitted ? 'Submitted to eTIMS' : 'Pending KRA Submission'}`;
      alert(details);
    }
  };

  const handleSubmitInvoice = (invoiceData: any) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    setShowModal(false);
    setEditingInvoice(null);
  };

  const handleSendInvoice = (invoiceId: string) => {
    sendInvoice(invoiceId);
    alert('Invoice sent successfully via email and SMS!');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    downloadDocument('invoice', invoiceId);
  };

  const handlePayInvoice = (invoiceId: string) => {
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      const outstanding = invoice.total - invoice.paidAmount;
      const paymentAmount = parseFloat(prompt(`Enter payment amount (Outstanding: KES ${outstanding.toLocaleString()}):`) || '0');
      
      if (paymentAmount > 0 && paymentAmount <= outstanding) {
        payInvoice(invoiceId, paymentAmount);
        alert(`Payment of KES ${paymentAmount.toLocaleString()} recorded successfully!`);
      } else if (paymentAmount > outstanding) {
        alert('Payment amount cannot exceed outstanding balance');
      }
    }
  };

  const handleSubmitToKra = async (invoiceId: string) => {
    const success = await submitToKra('invoice', invoiceId);
    if (success) {
      alert('Invoice successfully submitted to KRA eTIMS system');
    }
  };

  const handleDuplicateInvoice = (invoice: any) => {
    const duplicatedInvoice = {
      ...invoice,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'draft',
      paidAmount: 0,
      kraSubmitted: false,
      etims: false
    };
    delete duplicatedInvoice.id;
    delete duplicatedInvoice.invoiceNumber;
    
    addInvoice(duplicatedInvoice);
    alert('Invoice duplicated successfully!');
  };

  const handlePrintInvoice = (invoiceId: string) => {
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      console.log('Printing invoice:', invoice);
      alert(`Invoice ${invoice.invoiceNumber} sent to printer`);
    }
  };

  const handleEmailInvoice = (invoiceId: string) => {
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      console.log('Emailing invoice:', invoice);
      alert(`Invoice ${invoice.invoiceNumber} will be emailed to ${invoice.customerName}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Create, send, and track your invoices with KRA eTIMS integration</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => console.log('Opening invoice templates')}>
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button onClick={handleAddInvoice}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Invoice Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">KES {totalAmount.toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Paid Amount</p>
            <p className="text-2xl font-bold text-green-600 mt-1">KES {paidAmount.toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Outstanding</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">KES {outstandingAmount.toLocaleString()}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">VAT Collected</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">KES {vatAmount.toLocaleString()}</p>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (KES)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KRA Status
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
                      <p className="text-sm text-gray-500">{invoice.issueDate.toISOString().split('T')[0]}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {invoice.lines.map(line => line.description).join(', ').substring(0, 50)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div>
                      <p className="font-semibold text-gray-900">{invoice.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">VAT: {invoice.vatAmount.toLocaleString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      invoice.kraSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.kraSubmitted ? 'SUBMITTED' : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{invoice.dueDate.toISOString().split('T')[0]}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button 
                        className="p-1 text-gray-500 hover:text-blue-600"
                        onClick={() => handleViewInvoice(invoice.id)}
                        title="View Invoice Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {invoice.status !== 'paid' && (
                        <button 
                          className="p-1 text-gray-500 hover:text-blue-600" 
                          onClick={() => handleEditInvoice(invoice)}
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {invoice.status === 'draft' && (
                        <button 
                          className="p-1 text-gray-500 hover:text-green-600" 
                          onClick={() => handleSendInvoice(invoice.id)}
                          title="Send Invoice"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {invoice.status !== 'paid' && (
                        <button 
                          className="p-1 text-gray-500 hover:text-green-600" 
                          onClick={() => handlePayInvoice(invoice.id)}
                          title="Record Payment"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        className="p-1 text-gray-500 hover:text-blue-600" 
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-purple-600" 
                        onClick={() => handlePrintInvoice(invoice.id)}
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-orange-600" 
                        onClick={() => handleEmailInvoice(invoice.id)}
                        title="Email Invoice"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-gray-600" 
                        onClick={() => handleDuplicateInvoice(invoice)}
                        title="Duplicate Invoice"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {!invoice.kraSubmitted && invoice.status !== 'draft' && (
                        <button 
                          className="p-1 text-gray-500 hover:text-red-600" 
                          onClick={() => handleSubmitToKra(invoice.id)}
                          title="Submit to KRA"
                        >
                          <Building2 className="w-4 h-4" />
                        </button>
                      )}
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