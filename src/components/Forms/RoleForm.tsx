import React, { useState } from 'react';
import Button from '../UI/Button';

interface RoleFormProps {
  role?: any;
  onSubmit: (roleData: any) => void;
  onCancel: () => void;
}

export default function RoleForm({ role, onSubmit, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    code: role?.code || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
    isActive: role?.isActive !== undefined ? role.isActive : true
  });

  const availablePermissions = [
    { code: 'dashboard', name: 'Dashboard Access', description: 'View main dashboard and analytics' },
    { code: 'customers', name: 'Customer Management', description: 'Manage customer records and relationships' },
    { code: 'vendors', name: 'Vendor Management', description: 'Manage vendor records and relationships' },
    { code: 'invoices', name: 'Invoice Management', description: 'Create, edit, and manage invoices' },
    { code: 'estimates', name: 'Estimate Management', description: 'Create and manage estimates and quotes' },
    { code: 'purchase_orders', name: 'Purchase Orders', description: 'Manage purchase orders and procurement' },
    { code: 'inventory', name: 'Inventory Management', description: 'Manage stock levels and inventory' },
    { code: 'banking', name: 'Banking & Transactions', description: 'Manage bank accounts and transactions' },
    { code: 'projects', name: 'Project Management', description: 'Manage projects and time tracking' },
    { code: 'sales_orders', name: 'Sales Orders', description: 'Manage sales orders and distribution' },
    { code: 'manufacturing', name: 'Manufacturing (MRP)', description: 'Manage production and work orders' },
    { code: 'payroll', name: 'Payroll & HR', description: 'Manage employees and payroll processing' },
    { code: 'fixed_assets', name: 'Fixed Assets', description: 'Manage asset register and depreciation' },
    { code: 'accounting', name: 'General Ledger', description: 'Manage chart of accounts and journal entries' },
    { code: 'reports', name: 'Financial Reports', description: 'Generate and view financial reports' },
    { code: 'documents', name: 'Document Management', description: 'Upload and manage business documents' },
    { code: 'workflows', name: 'Workflow Automation', description: 'Create and manage automated workflows' },
    { code: 'tax', name: 'Tax & Compliance', description: 'Manage tax returns and compliance' },
    { code: 'budgeting', name: 'Budget Planning', description: 'Create and manage budgets' },
    { code: 'cash_flow', name: 'Cash Flow Management', description: 'Monitor and forecast cash flow' },
    { code: 'settings', name: 'System Settings', description: 'Configure system settings' },
    { code: 'users', name: 'User Management', description: 'Manage users and permissions' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (permissionCode: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permissionCode] }));
    } else {
      setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permissionCode) }));
    }
  };

  const handleSelectAllPermissions = () => {
    const allPermissions = availablePermissions.map(p => p.code);
    setFormData(prev => ({ ...prev, permissions: allPermissions }));
  };

  const handleClearAllPermissions = () => {
    setFormData(prev => ({ ...prev, permissions: [] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Sales Manager"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role Code *</label>
          <input
            type="text"
            required
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., sales_manager"
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
          placeholder="Brief description of this role"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
          <div className="flex space-x-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleSelectAllPermissions}>
              Select All
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleClearAllPermissions}>
              Clear All
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {availablePermissions.map((permission) => (
            <div key={permission.code} className="flex items-start">
              <input
                type="checkbox"
                id={permission.code}
                checked={formData.permissions.includes(permission.code)}
                onChange={(e) => handlePermissionChange(permission.code, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <div className="ml-2">
                <label htmlFor={permission.code} className="block text-sm font-medium text-gray-900">
                  {permission.name}
                </label>
                <p className="text-xs text-gray-500">{permission.description}</p>
              </div>
            </div>
          ))}
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
          Active Role
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{role ? 'Update Role' : 'Create Role'}</Button>
      </div>
    </form>
  );
}