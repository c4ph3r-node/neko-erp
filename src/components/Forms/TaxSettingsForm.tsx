import React, { useState } from 'react';
import Button from '../UI/Button';
import { eastAfricanTaxConfigs } from '../../lib/eastAfricanTaxConfigs';

interface TaxSettingsFormProps {
  setting?: any;
  onSubmit: (settingData: any) => void;
  onCancel: () => void;
}

export default function TaxSettingsForm({ setting, onSubmit, onCancel }: TaxSettingsFormProps) {
  const [formData, setFormData] = useState({
    countryCode: setting?.countryCode || 'KE',
    taxRegistrationNumber: setting?.taxRegistrationNumber || '',
    vatRegistrationNumber: setting?.vatRegistrationNumber || '',
    effectiveDate: setting?.effectiveDate || new Date().toISOString().split('T')[0],
    isActive: setting?.isActive !== undefined ? setting.isActive : true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedCountry = eastAfricanTaxConfigs[formData.countryCode];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select
            required
            value={formData.countryCode}
            onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(eastAfricanTaxConfigs).map(country => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.countryName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Registration Number *</label>
          <input
            type="text"
            required
            value={formData.taxRegistrationNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, taxRegistrationNumber: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter tax registration number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">VAT Registration Number</label>
          <input
            type="text"
            value={formData.vatRegistrationNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, vatRegistrationNumber: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter VAT registration number (if applicable)"
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

      {selectedCountry && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Tax Authority Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Tax Authority:</span> {selectedCountry.taxAuthority}
            </div>
            <div>
              <span className="font-medium">VAT Rate:</span> {selectedCountry.vatRate}%
            </div>
            <div>
              <span className="font-medium">Corporate Tax:</span> {selectedCountry.corporateTaxRate}%
            </div>
            <div>
              <span className="font-medium">Currency:</span> {selectedCountry.currency}
            </div>
          </div>
        </div>
      )}

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