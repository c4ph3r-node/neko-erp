import React, { useState } from 'react';
import Button from '../UI/Button';

interface MaintenanceFormProps {
  maintenance?: any;
  assets: any[];
  onSubmit: (maintenance: any) => void;
  onCancel: () => void;
}

export default function MaintenanceForm({ maintenance, assets, onSubmit, onCancel }: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    assetId: maintenance?.assetId || '',
    assetName: maintenance?.assetName || '',
    date: maintenance?.date || new Date().toISOString().split('T')[0],
    type: maintenance?.type || 'Preventive',
    description: maintenance?.description || '',
    cost: maintenance?.cost || 0,
    status: maintenance?.status || 'scheduled',
    technician: maintenance?.technician || '',
    vendor: maintenance?.vendor || '',
    notes: maintenance?.notes || '',
    nextMaintenanceDate: maintenance?.nextMaintenanceDate || '',
    partsUsed: maintenance?.partsUsed || '',
    laborHours: maintenance?.laborHours || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAsset = assets.find(asset => asset.id === parseInt(formData.assetId));
    onSubmit({
      ...formData,
      assetName: selectedAsset ? selectedAsset.name : formData.assetName
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asset *</label>
          <select
            required
            value={formData.assetId}
            onChange={(e) => setFormData(prev => ({ ...prev, assetId: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Asset</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.assetNumber})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Date *</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Type *</label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Preventive">Preventive</option>
            <option value="Repair">Repair</option>
            <option value="Emergency">Emergency</option>
            <option value="Upgrade">Upgrade</option>
            <option value="Inspection">Inspection</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the maintenance work"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cost ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Labor Hours</label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={formData.laborHours}
            onChange={(e) => setFormData(prev => ({ ...prev, laborHours: parseFloat(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Next Maintenance</label>
          <input
            type="date"
            value={formData.nextMaintenanceDate}
            onChange={(e) => setFormData(prev => ({ ...prev, nextMaintenanceDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
          <input
            type="text"
            value={formData.technician}
            onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Technician name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Service vendor"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Parts Used</label>
        <textarea
          rows={2}
          value={formData.partsUsed}
          onChange={(e) => setFormData(prev => ({ ...prev, partsUsed: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="List of parts used in maintenance"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional maintenance notes"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{maintenance ? 'Update Maintenance' : 'Schedule Maintenance'}</Button>
      </div>
    </form>
  );
}