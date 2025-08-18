import React, { useState } from 'react';
import Button from '../UI/Button';

interface InventoryFormProps {
  item?: any;
  onSubmit: (item: any) => void;
  onCancel: () => void;
}

export default function InventoryForm({ item, onSubmit, onCancel }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    sku: item?.sku || '',
    name: item?.name || '',
    description: item?.description || '',
    type: item?.type || 'inventory',
    category: item?.category || '',
    unitOfMeasure: item?.unitOfMeasure || 'Each',
    costPrice: item?.costPrice || 0,
    sellingPrice: item?.sellingPrice || 0,
    taxRate: item?.taxRate || 0,
    reorderLevel: item?.reorderLevel || 0,
    reorderQuantity: item?.reorderQuantity || 0,
    trackInventory: item?.trackInventory || true,
    serialTracking: item?.serialTracking || false,
    batchTracking: item?.batchTracking || false,
    barcode: item?.barcode || '',
    weight: item?.weight || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU *
          </label>
          <input
            type="text"
            required
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="inventory">Inventory</option>
            <option value="service">Service</option>
            <option value="non_inventory">Non-Inventory</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit of Measure
          </label>
          <select
            value={formData.unitOfMeasure}
            onChange={(e) => handleChange('unitOfMeasure', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Each">Each</option>
            <option value="Box">Box</option>
            <option value="Kg">Kilogram</option>
            <option value="Liter">Liter</option>
            <option value="Meter">Meter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) => handleChange('costPrice', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.sellingPrice}
            onChange={(e) => handleChange('sellingPrice', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.taxRate}
            onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reorder Level
          </label>
          <input
            type="number"
            min="0"
            value={formData.reorderLevel}
            onChange={(e) => handleChange('reorderLevel', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reorder Quantity
          </label>
          <input
            type="number"
            min="0"
            value={formData.reorderQuantity}
            onChange={(e) => handleChange('reorderQuantity', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barcode
          </label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => handleChange('barcode', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.weight}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Tracking Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="trackInventory"
              checked={formData.trackInventory}
              onChange={(e) => handleChange('trackInventory', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="trackInventory" className="ml-2 block text-sm text-gray-900">
              Track Inventory
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="serialTracking"
              checked={formData.serialTracking}
              onChange={(e) => handleChange('serialTracking', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="serialTracking" className="ml-2 block text-sm text-gray-900">
              Serial Number Tracking
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="batchTracking"
              checked={formData.batchTracking}
              onChange={(e) => handleChange('batchTracking', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="batchTracking" className="ml-2 block text-sm text-gray-900">
              Batch Tracking
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {item ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
}