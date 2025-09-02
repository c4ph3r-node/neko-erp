import React, { useState } from 'react';
import Button from '../UI/Button';

interface AssetFormProps {
  asset?: any;
  onSubmit: (asset: any) => void;
  onCancel: () => void;
}

export default function AssetForm({ asset, onSubmit, onCancel }: AssetFormProps) {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    assetNumber: asset?.assetNumber || '',
    category: asset?.category || '',
    description: asset?.description || '',
    purchaseDate: asset?.purchaseDate || new Date().toISOString().split('T')[0],
    purchasePrice: asset?.purchasePrice || 0,
    depreciationMethod: asset?.depreciationMethod || 'straight_line',
    usefulLife: asset?.usefulLife || 5,
    salvageValue: asset?.salvageValue || 0,
    location: asset?.location || '',
    condition: asset?.condition || 'excellent',
    status: asset?.status || 'active',
    serialNumber: asset?.serialNumber || '',
    barcode: asset?.barcode || '',
    warrantyExpiry: asset?.warrantyExpiry || '',
    supplier: asset?.supplier || '',
    model: asset?.model || '',
    manufacturer: asset?.manufacturer || ''
  });

  const calculateCurrentValue = () => {
    const yearsOwned = (new Date().getTime() - new Date(formData.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    const annualDepreciation = (formData.purchasePrice - formData.salvageValue) / formData.usefulLife;
    const totalDepreciation = Math.min(annualDepreciation * yearsOwned, formData.purchasePrice - formData.salvageValue);
    return Math.max(formData.purchasePrice - totalDepreciation, formData.salvageValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      currentValue: calculateCurrentValue(),
      lastMaintenanceDate: asset?.lastMaintenanceDate || null,
      nextMaintenanceDate: asset?.nextMaintenanceDate || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter asset name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asset Number *</label>
          <input
            type="text"
            required
            value={formData.assetNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, assetNumber: e.target.value.toUpperCase() }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., AST-001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Computer Equipment">Computer Equipment</option>
            <option value="Office Equipment">Office Equipment</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Manufacturing Equipment">Manufacturing Equipment</option>
            <option value="Furniture">Furniture</option>
            <option value="Building">Building</option>
            <option value="Land">Land</option>
            <option value="Software">Software</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Asset location"
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
          placeholder="Asset description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
          <input
            type="text"
            value={formData.serialNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
          <input
            type="date"
            required
            value={formData.purchaseDate}
            onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.purchasePrice}
            onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Depreciation Method</label>
          <select
            value={formData.depreciationMethod}
            onChange={(e) => setFormData(prev => ({ ...prev, depreciationMethod: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="straight_line">Straight Line</option>
            <option value="declining_balance">Declining Balance</option>
            <option value="units_of_production">Units of Production</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Useful Life (Years)</label>
          <input
            type="number"
            min="1"
            value={formData.usefulLife}
            onChange={(e) => setFormData(prev => ({ ...prev, usefulLife: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salvage Value</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.salvageValue}
            onChange={(e) => setFormData(prev => ({ ...prev, salvageValue: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="disposed">Disposed</option>
            <option value="sold">Sold</option>
            <option value="retired">Retired</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Expiry</label>
          <input
            type="date"
            value={formData.warrantyExpiry}
            onChange={(e) => setFormData(prev => ({ ...prev, warrantyExpiry: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Calculated Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-700">Current Value:</p>
            <p className="font-semibold text-blue-900">${calculateCurrentValue().toFixed(2)}</p>
          </div>
          <div>
            <p className="text-blue-700">Annual Depreciation:</p>
            <p className="font-semibold text-blue-900">${((formData.purchasePrice - formData.salvageValue) / formData.usefulLife).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-blue-700">Total Depreciation:</p>
            <p className="font-semibold text-blue-900">${(formData.purchasePrice - calculateCurrentValue()).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{asset ? 'Update Asset' : 'Create Asset'}</Button>
      </div>
    </form>
  );
}