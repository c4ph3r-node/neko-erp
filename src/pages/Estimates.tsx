import React, { useState } from 'react';
import { Plus, Search, FileText, Send, Copy, Eye, Edit, Trash2, CheckCircle, Clock, DollarSign } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import EstimateForm from '../components/Forms/EstimateForm';

const mockEstimates = [
  {
    id: 1,
    estimateNumber: 'EST-001',
    customer: 'Acme Corporation',
    issueDate: '2025-01-10',
    expiryDate: '2025-02-09',
    status: 'sent',
    subtotal: 5250.00,
    taxAmount: 525.00,
    total: 5775.00,
    description: 'Website development services estimate',
    validityDays: 30,
    items: [
      { description: 'Frontend Development', quantity: 40, unitPrice: 100.00, amount: 4000.00 },
      { description: 'Backend Development', quantity: 25, unitPrice: 50.00, amount: 1250.00 }
    ],
    notes: 'This estimate is valid for 30 days from the issue date.',
    terms: 'Payment terms: 50% upfront, 50% on completion.'
  },
  {
    id: 2,
    estimateNumber: 'EST-002',
    customer: 'TechStart Inc',
    issueDate: '2025-01-12',
    expiryDate: '2025-02-11',
    status: 'accepted',
    subtotal: 3800.00,
    taxAmount: 380.00,
    total: 4180.00,
    description: 'Mobile app development estimate',
    validityDays: 30,
    items: [
      { description: 'Mobile App Development', quantity: 60, unitPrice: 60.00, amount: 3600.00 },
      { description: 'App Store Submission', quantity: 1, unitPrice: 200.00, amount: 200.00 }
    ],
    notes: 'Includes iOS and Android versions.',
    terms: 'Payment in 3 milestones: 40%, 40%, 20%.'
  },
  {
    id: 3,
    estimateNumber: 'EST-003',
    customer: 'Global Dynamics',
    issueDate: '2025-01-08',
    expiryDate: '2025-02-07',
    status: 'draft',
    subtotal: 2100.00,
    taxAmount: 210.00,
    total: 2310.00,
    description: 'System integration consulting',
    validityDays: 30,
    items: [
      { description: 'System Analysis', quantity: 20, unitPrice: 80.00, amount: 1600.00 },
      { description: 'Integration Setup', quantity: 10, unitPrice: 50.00, amount: 500.00 }
    ],
    notes: 'Estimate pending client requirements clarification.',
    terms: 'Standard payment terms apply.'
  },
  {
    id: 4,
    estimateNumber: 'EST-004',
    customer: 'Creative Solutions LLC',
    issueDate: '2025-01-05',
    expiryDate: '2025-01-20',
    status: 'expired',
    subtotal: 1200.00,
    taxAmount: 120.00,
    total: 1320.00,
    description: 'Logo design and branding package',
    validityDays: 15,
    items: [
      { description: 'Logo Design', quantity: 1, unitPrice: 800.00, amount: 800.00 },
      { description: 'Brand Guidelines', quantity: 1, unitPrice: 400.00, amount: 400.00 }
    ],
    notes: 'Includes 3 logo concepts and revisions.',
    terms: '100% payment on acceptance.'
  }
];

export default function Estimates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [estimates, setEstimates] = useState(mockEstimates);
  const [showModal, setShowModal] = useState(false);
  const [editingEstimate, setEditingEstimate] = useState<any>(null);

  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch = estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estimate.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estimate.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalEstimateValue = filteredEstimates.reduce((sum, estimate) => sum + estimate.total, 0);
  const acceptedEstimates = filteredEstimates.filter(e => e.status === 'accepted').length;
  const pendingEstimates = filteredEstimates.filter(e => e.status === 'sent').length;
  const acceptanceRate = filteredEstimates.length > 0 ? (acceptedEstimates / filteredEstimates.length * 100) : 0;

  const handleAddEstimate = () => {
    setEditingEstimate(null);
    setShowModal(true);
  };

  const handleEditEstimate = (estimate: any) => {
    setEditingEstimate(estimate);
    setShowModal(true);
  };

  const handleSubmitEstimate = (estimateData: any) => {
    if (editingEstimate) {
      setEstimates(prev => prev.map(est => est.id === editingEstimate.id ? { ...est, ...estimateData } : est));
    } else {
      const newEstimate = { 
        ...estimateData, 
        id: Date.now(), 
        estimateNumber: `EST-${String(estimates.length + 1).padStart(3, '0')}` 
      };
      setEstimates(prev => [...prev, newEstimate]);
    }
    setShowModal(false);
    setEditingEstimate(null);
  };

  const handleDeleteEstimate = (estimateId: number) => {
    if (confirm('Are you sure you want to delete this estimate?')) {
      setEstimates(prev => prev.filter(est => est.id !== estimateId));
    }
  };

  const handleSendEstimate = (estimateId: number) => {
    sendEstimate(estimateId);
    alert('Estimate sent successfully!');
  };

  const handleAcceptEstimate = (estimateId: number) => {
    updateEstimate(estimateId, { status: 'accepted' });
    alert('Estimate accepted!');
  };

  const handleConvertToInvoice = (estimateId: number) => {
    convertEstimateToInvoice(estimateId);
    alert('Estimate converted to invoice successfully!');
  };

  const handleViewEstimate = (estimateId: number) => {
    const estimate = estimates.find(e => e.id === estimateId);
    if (estimate) {
      setEditingEstimate(estimate);
      setShowModal(true);
    }
  };

  const handleDownloadEstimate = (estimateId: number) => {
    downloadDocument('estimate', estimateId);
  };

  const handleDuplicateEstimate = (estimate: any) => {
    const duplicatedEstimate = {
      ...estimate,
      id: Date.now(),
      estimateNumber: `EST-${String(estimates.length + 1).padStart(3, '0')}`,
      status: 'draft',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setEstimates(prev => [...prev, duplicatedEstimate]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimates & Quotes</h1>
          <p className="text-gray-600">Create and manage customer estimates and quotations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => console.log('Opening estimate templates')}>
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button onClick={handleAddEstimate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Estimate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Estimate Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalEstimateValue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted Estimates</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{acceptedEstimates}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Estimates</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingEstimates}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{acceptanceRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
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
              placeholder="Search estimates..."
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
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Estimates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEstimates.map((estimate) => (
          <Card key={estimate.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{estimate.estimateNumber}</h3>
                  <p className="text-sm text-gray-600">{estimate.customer}</p>
                  <p className="text-sm text-gray-500 mt-1">{estimate.description}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(estimate.status)}`}>
                    {estimate.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${estimate.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total Amount</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Issue Date</p>
                  <p className="font-semibold text-gray-900">{estimate.issueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className="font-semibold text-gray-900">{estimate.expiryDate}</p>
                  {new Date(estimate.expiryDate) < new Date() && estimate.status === 'sent' && (
                    <p className="text-xs text-red-600 font-medium">Expired</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Estimate Items</h4>
                <div className="space-y-2">
                  {estimate.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.description} (x{item.quantity})</span>
                      <span className="font-medium text-gray-900">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleViewEstimate(estimate.id)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleEditEstimate(estimate)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {estimate.status === 'draft' && (
                  <Button size="sm" onClick={() => handleSendEstimate(estimate.id)}>
                    <Send className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                )}
                {estimate.status === 'accepted' && (
                  <Button size="sm" onClick={() => handleConvertToInvoice(estimate.id)}>
                    <FileText className="w-4 h-4 mr-1" />
                    Invoice
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => handleDownloadEstimate(estimate.id)}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleDuplicateEstimate(estimate)}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredEstimates.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No estimates found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Get started by creating your first estimate'}
            </p>
            <Button onClick={handleAddEstimate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Estimate
            </Button>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEstimate ? 'Edit Estimate' : 'Create New Estimate'}
        size="xl"
      >
        <EstimateForm
          estimate={editingEstimate}
          onSubmit={handleSubmitEstimate}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}