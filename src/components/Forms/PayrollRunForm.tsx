import React, { useState } from 'react';
import Button from '../UI/Button';

interface PayrollRunFormProps {
  onSubmit: (payrollData: any) => void;
  onCancel: () => void;
}

export default function PayrollRunForm({ onSubmit, onCancel }: PayrollRunFormProps) {
  const [formData, setFormData] = useState({
    payPeriod: '',
    payPeriodStart: '',
    payPeriodEnd: '',
    payDate: '',
    description: '',
    includeOvertime: true,
    includeBonuses: false,
    includeCommissions: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'draft',
      employeeCount: 0,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      entries: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pay Period Name *</label>
        <input
          type="text"
          required
          value={formData.payPeriod}
          onChange={(e) => setFormData(prev => ({ ...prev, payPeriod: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., February 2025"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pay Period Start *</label>
          <input
            type="date"
            required
            value={formData.payPeriodStart}
            onChange={(e) => setFormData(prev => ({ ...prev, payPeriodStart: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pay Period End *</label>
          <input
            type="date"
            required
            value={formData.payPeriodEnd}
            onChange={(e) => setFormData(prev => ({ ...prev, payPeriodEnd: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pay Date *</label>
        <input
          type="date"
          required
          value={formData.payDate}
          onChange={(e) => setFormData(prev => ({ ...prev, payDate: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Optional description for this payroll run"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Payroll Options</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeOvertime"
              checked={formData.includeOvertime}
              onChange={(e) => setFormData(prev => ({ ...prev, includeOvertime: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeOvertime" className="ml-2 block text-sm text-gray-900">
              Include Overtime Pay
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeBonuses"
              checked={formData.includeBonuses}
              onChange={(e) => setFormData(prev => ({ ...prev, includeBonuses: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeBonuses" className="ml-2 block text-sm text-gray-900">
              Include Bonuses
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCommissions"
              checked={formData.includeCommissions}
              onChange={(e) => setFormData(prev => ({ ...prev, includeCommissions: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeCommissions" className="ml-2 block text-sm text-gray-900">
              Include Commissions
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Payroll Run</Button>
      </div>
    </form>
  );
}