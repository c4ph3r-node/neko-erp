import React, { useState } from 'react';
import Button from '../UI/Button';

interface TimeEntryFormProps {
  timeEntry?: any;
  projects: any[];
  onSubmit: (timeData: any) => void;
  onCancel: () => void;
}

export default function TimeEntryForm({ timeEntry, projects, onSubmit, onCancel }: TimeEntryFormProps) {
  const [formData, setFormData] = useState({
    project: timeEntry?.project || '',
    employee: timeEntry?.employee || '',
    date: timeEntry?.date || new Date().toISOString().split('T')[0],
    hours: timeEntry?.hours || 8,
    task: timeEntry?.task || '',
    description: timeEntry?.description || '',
    billable: timeEntry?.billable !== undefined ? timeEntry.billable : true,
    hourlyRate: timeEntry?.hourlyRate || 0,
    overtime: timeEntry?.overtime || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      approved: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
          <select
            required
            value={formData.project}
            onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Project</option>
            {projects.map(proj => (
              <option key={proj.id} value={proj.name}>
                {proj.name} ({proj.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
          <input
            type="text"
            required
            value={formData.employee}
            onChange={(e) => setFormData(prev => ({ ...prev, employee: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Employee name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hours *</label>
          <input
            type="number"
            required
            min="0"
            max="24"
            step="0.25"
            value={formData.hours}
            onChange={(e) => setFormData(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
        <input
          type="text"
          value={formData.task}
          onChange={(e) => setFormData(prev => ({ ...prev, task: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Task or activity description"
        />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.hourlyRate}
            onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-6 pt-6">
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="overtime"
              checked={formData.overtime}
              onChange={(e) => setFormData(prev => ({ ...prev, overtime: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="overtime" className="ml-2 block text-sm text-gray-900">
              Overtime
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{timeEntry ? 'Update Time Entry' : 'Log Time Entry'}</Button>
      </div>
    </form>
  );
}