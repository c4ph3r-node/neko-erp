import React, { useState } from 'react';
import Button from '../UI/Button';

interface LeaveRequestFormProps {
  employees: any[];
  onSubmit: (leaveData: any) => void;
  onCancel: () => void;
}

export default function LeaveRequestForm({ employees, onSubmit, onCancel }: LeaveRequestFormProps) {
  const [formData, setFormData] = useState({
    employeeId: '',
    employee: '',
    type: 'Vacation',
    startDate: '',
    endDate: '',
    reason: '',
    halfDay: false,
    emergencyLeave: false
  });

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return formData.halfDay ? diffDays * 0.5 : diffDays;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEmployee = employees.find(emp => emp.id === parseInt(formData.employeeId));
    onSubmit({
      ...formData,
      employee: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
      days: calculateDays(),
      status: 'pending'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              {emp.firstName} {emp.lastName} - {emp.department}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type *</label>
        <select
          required
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Vacation">Vacation</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Personal Leave">Personal Leave</option>
          <option value="Maternity Leave">Maternity Leave</option>
          <option value="Paternity Leave">Paternity Leave</option>
          <option value="Bereavement">Bereavement</option>
          <option value="Emergency Leave">Emergency Leave</option>
        </select>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {formData.startDate && formData.endDate && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            Total Leave Days: <span className="font-semibold">{calculateDays()}</span>
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Leave *</label>
        <textarea
          required
          rows={3}
          value={formData.reason}
          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Please provide a reason for your leave request"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="halfDay"
            checked={formData.halfDay}
            onChange={(e) => setFormData(prev => ({ ...prev, halfDay: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="halfDay" className="ml-2 block text-sm text-gray-900">
            Half Day Leave
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="emergencyLeave"
            checked={formData.emergencyLeave}
            onChange={(e) => setFormData(prev => ({ ...prev, emergencyLeave: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="emergencyLeave" className="ml-2 block text-sm text-gray-900">
            Emergency Leave (Requires immediate approval)
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit Leave Request</Button>
      </div>
    </form>
  );
}