import React, { useState } from 'react';
import { Plus, Search, Play, Pause, Settings, Zap, Clock, CheckCircle, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useGlobalState } from '../contexts/GlobalStateContext';

const mockWorkflows = [
  {
    id: 1,
    name: 'Purchase Order Approval',
    description: 'Automated approval workflow for purchase orders above $1000',
    status: 'active',
    trigger: 'Purchase Order Created',
    totalRuns: 45,
    successRate: 95.6,
    lastRun: '2025-01-15 14:30',
    steps: [
      { name: 'Manager Approval', type: 'approval', assignee: 'Department Manager', status: 'active' },
      { name: 'Finance Review', type: 'approval', assignee: 'Finance Team', status: 'active' },
      { name: 'Send to Vendor', type: 'action', assignee: 'System', status: 'active' }
    ]
  },
  {
    id: 2,
    name: 'Invoice Processing',
    description: 'Automatic invoice processing and approval routing',
    status: 'active',
    trigger: 'Invoice Received',
    totalRuns: 128,
    successRate: 92.3,
    lastRun: '2025-01-15 16:45',
    steps: [
      { name: 'OCR Processing', type: 'action', assignee: 'System', status: 'active' },
      { name: 'Data Validation', type: 'condition', assignee: 'System', status: 'active' },
      { name: 'Accounting Review', type: 'approval', assignee: 'Accountant', status: 'active' },
      { name: 'Payment Processing', type: 'action', assignee: 'System', status: 'active' }
    ]
  },
  {
    id: 3,
    name: 'Employee Onboarding',
    description: 'Complete employee onboarding process automation',
    status: 'draft',
    trigger: 'New Employee Added',
    totalRuns: 12,
    successRate: 100,
    lastRun: '2025-01-10 09:15',
    steps: [
      { name: 'Welcome Email', type: 'notification', assignee: 'System', status: 'active' },
      { name: 'Document Collection', type: 'approval', assignee: 'HR Manager', status: 'active' },
      { name: 'IT Setup', type: 'approval', assignee: 'IT Team', status: 'active' },
      { name: 'Training Schedule', type: 'action', assignee: 'System', status: 'active' }
    ]
  },
  {
    id: 4,
    name: 'Expense Report Approval',
    description: 'Multi-level approval for employee expense reports',
    status: 'active',
    trigger: 'Expense Report Submitted',
    totalRuns: 89,
    successRate: 88.8,
    lastRun: '2025-01-15 11:20',
    steps: [
      { name: 'Manager Review', type: 'approval', assignee: 'Direct Manager', status: 'active' },
      { name: 'Finance Approval', type: 'approval', assignee: 'Finance Manager', status: 'active' },
      { name: 'Reimbursement', type: 'action', assignee: 'Payroll System', status: 'active' }
    ]
  }
];

const mockWorkflowInstances = [
  {
    id: 1,
    workflowName: 'Purchase Order Approval',
    entityType: 'Purchase Order',
    entityId: 'PO-001',
    status: 'pending',
    currentStep: 'Manager Approval',
    initiatedBy: 'John Smith',
    initiatedAt: '2025-01-15 14:30',
    assignedTo: 'Jane Doe'
  },
  {
    id: 2,
    workflowName: 'Invoice Processing',
    entityType: 'Invoice',
    entityId: 'INV-002',
    status: 'approved',
    currentStep: 'Payment Processing',
    initiatedBy: 'System',
    initiatedAt: '2025-01-15 16:45',
    assignedTo: 'Finance Team'
  },
  {
    id: 3,
    workflowName: 'Expense Report Approval',
    entityType: 'Expense Report',
    entityId: 'EXP-003',
    status: 'rejected',
    currentStep: 'Manager Review',
    initiatedBy: 'Bob Johnson',
    initiatedAt: '2025-01-15 11:20',
    assignedTo: 'Alice Brown'
  }
];

const workflowTemplates = [
  {
    id: 1,
    name: 'Document Approval',
    description: 'Standard document review and approval process',
    category: 'General',
    steps: 3
  },
  {
    id: 2,
    name: 'Financial Transaction',
    description: 'Multi-level approval for financial transactions',
    category: 'Finance',
    steps: 4
  },
  {
    id: 3,
    name: 'HR Process',
    description: 'Human resources workflow template',
    category: 'HR',
    steps: 5
  }
];

export default function WorkflowAutomation() {
  const { showNotification } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workflows');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredWorkflows = mockWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-600';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'approval': return Users;
      case 'action': return Zap;
      case 'condition': return Settings;
      case 'notification': return AlertTriangle;
      default: return Settings;
    }
  };

  const handleToggleWorkflow = (workflowId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    showNotification(`Workflow ${newStatus === 'active' ? 'activated' : 'paused'} successfully`, 'success');
  };

  const handleApproveInstance = (instanceId: number) => {
    showNotification('Workflow instance approved successfully', 'success');
  };

  const handleRejectInstance = (instanceId: number) => {
    showNotification('Workflow instance rejected', 'success');
  };

  const totalWorkflows = filteredWorkflows.length;
  const activeWorkflows = filteredWorkflows.filter(w => w.status === 'active').length;
  const totalRuns = filteredWorkflows.reduce((sum, w) => sum + w.totalRuns, 0);
  const avgSuccessRate = filteredWorkflows.reduce((sum, w) => sum + w.successRate, 0) / filteredWorkflows.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="text-gray-600">Design, manage, and monitor automated business processes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Settings className="w-4 h-4 mr-2" />
            Workflow Builder
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workflows</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalWorkflows}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{activeWorkflows}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{totalRuns}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{avgSuccessRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workflows'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Workflows
          </button>
          <button
            onClick={() => setActiveTab('instances')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'instances'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Instances
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
        </nav>
      </div>

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search workflows..."
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
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkflows.map((workflow) => (
              <Card key={workflow.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                          {workflow.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Trigger: {workflow.trigger}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={workflow.status === 'active' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleWorkflow(workflow.id, workflow.status)}
                    >
                      {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Runs</p>
                      <p className="font-semibold text-gray-900">{workflow.totalRuns}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="font-semibold text-green-600">{workflow.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Run</p>
                      <p className="font-semibold text-gray-900 text-xs">{workflow.lastRun}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Workflow Steps</h4>
                    <div className="space-y-2">
                      {workflow.steps.map((step, index) => {
                        const StepIcon = getStepIcon(step.type);
                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <StepIcon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{step.name}</p>
                              <p className="text-xs text-gray-500">{step.assignee}</p>
                            </div>
                            {index < workflow.steps.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Clock className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Instances Tab */}
      {activeTab === 'instances' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Active Workflow Instances</h2>
            <div className="text-sm text-gray-500">
              {mockWorkflowInstances.filter(i => i.status === 'pending').length} pending approval
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Step
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initiated
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
                {mockWorkflowInstances.map((instance) => (
                  <tr key={instance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{instance.workflowName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{instance.entityType}</p>
                        <p className="text-xs text-gray-500">{instance.entityId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{instance.currentStep}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{instance.assignedTo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{instance.initiatedBy}</p>
                        <p className="text-xs text-gray-500">{instance.initiatedAt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(instance.status)}`}>
                        {instance.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {instance.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApproveInstance(instance.id)}>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleRejectInstance(instance.id)}>
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowTemplates.map((template) => (
            <Card key={template.id}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {template.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {template.steps} steps
                  </span>
                </div>

                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}