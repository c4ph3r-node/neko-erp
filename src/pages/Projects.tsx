import React, { useState } from 'react';
import { Plus, Search, Clock, DollarSign, Users, Calendar, BarChart3, Play, Pause, CreditCard as Edit, Eye, Trash2, CheckCircle, X } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import ProjectForm from '../components/Forms/ProjectForm';
import TimeEntryForm from '../components/Forms/TimeEntryForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

const mockProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    code: 'WEB-001',
    customer: 'Acme Corporation',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    budget: 25000.00,
    actualCost: 8500.00,
    billingType: 'fixed',
    progress: 35,
    hoursLogged: 120,
    budgetedHours: 300,
    manager: 'John Doe'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    code: 'APP-001',
    customer: 'TechStart Inc',
    status: 'active',
    startDate: '2024-12-15',
    endDate: '2025-04-15',
    budget: 45000.00,
    actualCost: 15200.00,
    billingType: 'time_and_materials',
    progress: 25,
    hoursLogged: 180,
    budgetedHours: 500,
    manager: 'Jane Smith'
  },
  {
    id: 3,
    name: 'System Integration',
    code: 'SYS-001',
    customer: 'Global Dynamics',
    status: 'completed',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    budget: 18000.00,
    actualCost: 17500.00,
    billingType: 'milestone',
    progress: 100,
    hoursLogged: 220,
    budgetedHours: 225,
    manager: 'Bob Johnson'
  },
  {
    id: 4,
    name: 'Data Migration',
    code: 'DATA-001',
    customer: 'Creative Solutions LLC',
    status: 'on_hold',
    startDate: '2025-01-15',
    endDate: '2025-02-28',
    budget: 12000.00,
    actualCost: 2400.00,
    billingType: 'fixed',
    progress: 15,
    hoursLogged: 30,
    budgetedHours: 150,
    manager: 'Alice Brown'
  }
];

const recentTimeEntries = [
  { id: 1, project: 'Website Redesign', employee: 'John Doe', date: '2025-01-15', hours: 8, task: 'Frontend Development', billable: true },
  { id: 2, project: 'Mobile App Development', employee: 'Jane Smith', date: '2025-01-15', hours: 6, task: 'UI Design', billable: true },
  { id: 3, project: 'Website Redesign', employee: 'Bob Johnson', date: '2025-01-14', hours: 4, task: 'Testing', billable: true },
  { id: 4, project: 'Data Migration', employee: 'Alice Brown', date: '2025-01-14', hours: 2, task: 'Planning', billable: false }
];

export default function Projects() {
  const { showNotification, formatCurrency } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState(mockProjects);
  const [timeEntries, setTimeEntries] = useState(recentTimeEntries);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingTimeEntry, setEditingTimeEntry] = useState<any>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalBudget = filteredProjects.reduce((sum, project) => sum + project.budget, 0);
  const totalActualCost = filteredProjects.reduce((sum, project) => sum + project.actualCost, 0);
  const activeProjects = filteredProjects.filter(p => p.status === 'active').length;

  // Project CRUD Operations
  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const handleViewProject = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(project);
      setShowProjectModal(true);
    }
  };

  const handleSubmitProject = (projectData: any) => {
    if (editingProject) {
      setProjects(prev => prev.map(proj => proj.id === editingProject.id ? { ...proj, ...projectData } : proj));
    } else {
      const newProject = { ...projectData, id: Date.now() };
      setProjects(prev => [...prev, newProject]);
    }
    setShowProjectModal(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: number) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      setProjects(prev => prev.filter(proj => proj.id !== projectId));
    }
  };

  const handleToggleProjectStatus = (projectId: number) => {
    setProjects(prev => prev.map(proj => 
      proj.id === projectId ? { 
        ...proj, 
        status: proj.status === 'active' ? 'on_hold' : 'active' 
      } : proj
    ));
  };

  // Time Entry CRUD Operations
  const handleAddTimeEntry = () => {
    setEditingTimeEntry(null);
    setShowTimeModal(true);
  };

  const handleEditTimeEntry = (timeEntry: any) => {
    setEditingTimeEntry(timeEntry);
    setShowTimeModal(true);
  };

  const handleSubmitTimeEntry = (timeData: any) => {
    if (editingTimeEntry) {
      setTimeEntries(prev => prev.map(entry => entry.id === editingTimeEntry.id ? { ...entry, ...timeData } : entry));
    } else {
      const newTimeEntry = { ...timeData, id: Date.now() };
      setTimeEntries(prev => [...prev, newTimeEntry]);
    }
    setShowTimeModal(false);
    setEditingTimeEntry(null);
  };

  const handleDeleteTimeEntry = (entryId: number) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
    }
  };

  const handleApproveTimeEntry = (entryId: number) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, approved: true } : entry
    ));
  };

  const handleProjectReports = () => {
    showNotification('Project reports functionality would open here', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Track project progress, time, and profitability</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleProjectReports}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Project Reports
          </Button>
          <Button onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{activeProjects}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actual Costs</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totalActualCost)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {((totalBudget - totalActualCost) / totalBudget * 100).toFixed(1)}%
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
            onClick={() => setActiveTab('projects')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('timesheet')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timesheet'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Time Tracking
          </button>
        </nav>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
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
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.code} • {project.customer}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(project.budget)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Actual Cost</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(project.actualCost)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hours Logged</p>
                      <p className="font-semibold text-gray-900">{project.hoursLogged} / {project.budgetedHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="font-semibold text-gray-900">{project.progress}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {project.startDate} - {project.endDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {project.manager}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => handleViewProject(project.id)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleEditProject(project)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleToggleProjectStatus(project.id)}>
                      {project.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Time Tracking Tab */}
      {activeTab === 'timesheet' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Time Entries</h2>
              <Button onClick={handleAddTimeEntry}>
                <Plus className="w-4 h-4 mr-2" />
                Log Time
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
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Billable
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.date}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{entry.project}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.employee}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900">{entry.task}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-medium text-gray-900">{entry.hours}h</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          entry.billable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {entry.billable ? 'Billable' : 'Non-billable'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditTimeEntry(entry)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                            title="Edit Time Entry"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleApproveTimeEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-green-600"
                            title="Approve Time Entry"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTimeEntry(entry.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Time Entry"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modals */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        size="xl"
      >
        <ProjectForm
          project={editingProject}
          onSubmit={handleSubmitProject}
          onCancel={() => setShowProjectModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        title={editingTimeEntry ? 'Edit Time Entry' : 'Log Time Entry'}
        size="lg"
      >
        <TimeEntryForm
          timeEntry={editingTimeEntry}
          projects={projects}
          onSubmit={handleSubmitTimeEntry}
          onCancel={() => setShowTimeModal(false)}
        />
      </Modal>
    </div>
  );
}