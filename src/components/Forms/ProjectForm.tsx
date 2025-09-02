import React, { useState } from 'react';
import Button from '../UI/Button';

interface ProjectFormProps {
  project?: any;
  onSubmit: (project: any) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    code: project?.code || '',
    description: project?.description || '',
    customerId: project?.customerId || '',
    customer: project?.customer || '',
    status: project?.status || 'planning',
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    endDate: project?.endDate || '',
    budget: project?.budget || 0,
    billingType: project?.billingType || 'fixed',
    hourlyRate: project?.hourlyRate || 0,
    managerId: project?.managerId || '',
    manager: project?.manager || '',
    budgetedHours: project?.budgetedHours || 0,
    priority: project?.priority || 'medium',
    department: project?.department || '',
    tags: project?.tags || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      actualCost: project?.actualCost || 0,
      hoursLogged: project?.hoursLogged || 0,
      progress: project?.progress || 0,
      isActive: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter project name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Code *</label>
          <input
            type="text"
            required
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., WEB-001"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Project description and objectives"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
          <input
            type="text"
            required
            value={formData.customer}
            onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Customer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Manager *</label>
          <input
            type="text"
            required
            value={formData.manager}
            onChange={(e) => setFormData(prev => ({ ...prev, manager: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Project manager name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Department"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Billing Type</label>
          <select
            value={formData.billingType}
            onChange={(e) => setFormData(prev => ({ ...prev, billingType: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="fixed">Fixed Price</option>
            <option value="time_and_materials">Time & Materials</option>
            <option value="milestone">Milestone Based</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.hourlyRate}
            onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={formData.billingType === 'fixed'}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Budgeted Hours</label>
        <input
          type="number"
          min="0"
          value={formData.budgetedHours}
          onChange={(e) => setFormData(prev => ({ ...prev, budgetedHours: parseInt(e.target.value) || 0 }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Comma-separated tags"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{project ? 'Update Project' : 'Create Project'}</Button>
      </div>
    </form>
  );
}