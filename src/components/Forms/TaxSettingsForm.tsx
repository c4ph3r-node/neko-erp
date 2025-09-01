import React, { useState } from 'react';
import Button from '../UI/Button';

interface TaxSettingsFormProps {
  setting?: any;
  onSubmit: (settingData: any) => void;
  onCancel: () => void;
}

export default function TaxSettingsForm({ setting, onSubmit, onCancel }: TaxSettingsFormProps) {
  const [formData, setFormData] = useState({
    country: setting?.country || 'United States',
    taxType: setting?.taxType || '',
    rate: setting?.rate || 0,
    effectiveDate: setting?.effectiveDate || new Date().toISOString().split('T')[0],
    description: setting?.description || '',
    isActive: setting?.isActive !== undefined ? setting.isActive : true,
    applicableToSales: setting?.applicableToSales || false,
    applicableToPurchases: setting?.applicableToPurchases || false,
    applicableToPayroll: setting?.applicableToPayroll || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select
            required
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Type *</label>
          <select
            required
            value={formData.taxType}
            onChange={(e) => setFormData(prev => ({ ...prev, taxType: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Tax Type</option>
            <option value="VAT">VAT</option>
            <option value="Sales Tax">Sales Tax</option>
            <option value="Income Tax">Income Tax</option>
            <option value="Corporate Tax">Corporate Tax</option>
            <option value="Payroll Tax">Payroll Tax</option>
            <option value="Withholding Tax">Withholding Tax</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%) *</label>
          <input
            type="number"
            required
            min="0"
            max="100"
            step="0.01"
            value={formData.rate}
            onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
          <input
            type="date"
            required
            value={formData.effectiveDate}
            onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Description of this tax setting"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Applicability</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="applicableToSales"
              checked={formData.applicableToSales}
              onChange={(e) => setFormData(prev => ({ ...prev, applicableToSales: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="applicableToSales" className="ml-2 block text-sm text-gray-900">
              Apply to Sales
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="applicableToPurchases"
              checked={formData.applicableToPurchases}
              onChange={(e) => setFormData(prev => ({ ...prev, applicableToPurchases: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="applicableToPurchases" className="ml-2 block text-sm text-gray-900">
              Apply to Purchases
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="applicableToPayroll"
              checked={formData.applicableToPayroll}
              onChange={(e) => setFormData(prev => ({ ...prev, applicableToPayroll: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="applicableToPayroll" className="ml-2 block text-sm text-gray-900">
              Apply to Payroll
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active Tax Setting
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{setting ? 'Update Tax Setting' : 'Create Tax Setting'}</Button>
      </div>
    </form>
  );
}