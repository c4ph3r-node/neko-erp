import React, { useState } from 'react';
import Button from '../UI/Button';

interface AccountFormProps {
  account?: any;
  onSubmit: (account: any) => void;
  onCancel: () => void;
}

export default function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState({
    code: account?.code || '',
    name: account?.name || '',
    type: account?.type || 'Asset',
    subType: account?.subType || '',
    description: account?.description || '',
    parentId: account?.parentId || '',
    taxCode: account?.taxCode || '',
    openingBalance: account?.balance || 0,
    isActive: account?.isActive !== undefined ? account.isActive : true
  });

  const accountTypes = {
    'Asset': ['Current Asset', 'Fixed Asset', 'Intangible Asset', 'Investment'],
    'Liability': ['Current Liability', 'Long-term Liability', 'Contingent Liability'],
    'Equity': ['Capital', 'Retained Earnings', 'Current Earnings', 'Reserves'],
    'Revenue': ['Operating Revenue', 'Other Revenue', 'Interest Income'],
    'Expense': ['Cost of Sales', 'Operating Expense', 'Financial Expense', 'Other Expense']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type, 
      subType: accountTypes[type as keyof typeof accountTypes][0] || ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Code *</label>
          <input
            type="text"
            required
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Cash at Bank"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
          <select
            required
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Asset">Asset</option>
            <option value="Liability">Liability</option>
            <option value="Equity">Equity</option>
            <option value="Revenue">Revenue</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Type *</label>
          <select
            required
            value={formData.subType}
            onChange={(e) => setFormData(prev => ({ ...prev, subType: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {accountTypes[formData.type as keyof typeof accountTypes]?.map(subType => (
              <option key={subType} value={subType}>{subType}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Account description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance (KES)</label>
          <input
            type="number"
            step="0.01"
            value={formData.openingBalance}
            onChange={(e) => setFormData(prev => ({ ...prev, openingBalance: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Code</label>
          <select
            value={formData.taxCode}
            onChange={(e) => setFormData(prev => ({ ...prev, taxCode: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No Tax</option>
            <option value="VAT_16">VAT 16%</option>
            <option value="VAT_0">VAT 0% (Zero-rated)</option>
            <option value="VAT_EXEMPT">VAT Exempt</option>
            <option value="WITHHOLDING_5">Withholding Tax 5%</option>
            <option value="WITHHOLDING_10">Withholding Tax 10%</option>
          </select>
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
          Active Account
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{account ? 'Update Account' : 'Create Account'}</Button>
      </div>
    </form>
  );
}