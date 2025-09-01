import React, { useState } from 'react';
import Button from '../UI/Button';

interface TimesheetFormProps {
  employees: any[];
  onSubmit: (timeData: any) => void;
  onCancel: () => void;
}

export default function TimesheetForm({ employees, onSubmit, onCancel }: TimesheetFormProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    employee: '',
    date: new Date().toISOString().split('T')[0],
    hoursWorked: 8,
    overtime: 0,
    project: '',
    task: '',
    description: '',
    billable: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEmployee = employees.find(emp => emp.id === parseInt(formData.employeeId));
    onSubmit({
      ...formData,
      employee: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
      approved: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
          <select
            required
            value={formData.employeeId}
            onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} - {emp.employeeNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Regular Hours *</label>
          <input
            type="number"
            required
            min="0"
            max="24"
            step="0.25"
            value={formData.hoursWorked}
            onChange={(e) => setFormData(prev => ({ ...prev, hoursWorked: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Hours</label>
          <input
            type="number"
            min="0"
            max="12"
            step="0.25"
            value={formData.overtime}
            onChange={(e) => setFormData(prev => ({ ...prev, overtime: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
          <input
            type="text"
            value={formData.project}
            onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Project name or code"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
          <input
            type="text"
            value={formData.task}
            onChange={(e) => setFormData(prev => ({ ...prev, task: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task description"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Description</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the work performed"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="billable"
          checked={formData.billable}
          onChange={(e) => setFormData(prev => ({ ...prev, billable: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="billable" className="ml-2 block text-sm text-gray-900">
          Billable Hours
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Log Time Entry</Button>
      </div>
    </form>
  );
}