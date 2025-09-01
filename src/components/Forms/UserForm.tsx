import React, { useState } from 'react';
import Button from '../UI/Button';

interface UserFormProps {
  user?: any;
  roles: any[];
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

export default function UserForm({ user, roles, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'employee',
    status: user?.status || 'pending',
    twoFactorEnabled: user?.twoFactorEnabled || false,
    permissions: user?.permissions || [],
    sendInvitation: !user // Send invitation for new users
  });

  const availablePermissions = [
    'dashboard', 'customers', 'vendors', 'invoices', 'estimates', 'purchase_orders',
    'inventory', 'banking', 'projects', 'sales_orders', 'manufacturing', 'payroll',
    'fixed_assets', 'accounting', 'reports', 'documents', 'workflows', 'settings',
    'users', 'tax', 'budgeting', 'cash_flow'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permission] }));
    } else {
      setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }));
    }
  };

  const handleRoleChange = (roleCode: string) => {
    const selectedRole = roles.find(r => r.code === roleCode);
    if (selectedRole) {
      setFormData(prev => ({ 
        ...prev, 
        role: roleCode,
        permissions: selectedRole.permissions.includes('all') ? ['all'] : selectedRole.permissions
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
          <select
            required
            value={formData.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {roles.map(role => (
              <option key={role.id} value={role.code}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availablePermissions.map((permission) => (
            <div key={permission} className="flex items-center">
              <input
                type="checkbox"
                id={permission}
                checked={formData.permissions.includes('all') || formData.permissions.includes(permission)}
                onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                disabled={formData.permissions.includes('all')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={permission} className="ml-2 block text-sm text-gray-900 capitalize">
                {permission.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="twoFactorEnabled"
            checked={formData.twoFactorEnabled}
            onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-900">
            Require Two-Factor Authentication
          </label>
        </div>
        {!user && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendInvitation"
              checked={formData.sendInvitation}
              onChange={(e) => setFormData(prev => ({ ...prev, sendInvitation: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sendInvitation" className="ml-2 block text-sm text-gray-900">
              Send invitation email to user
            </label>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{user ? 'Update User' : 'Invite User'}</Button>
      </div>
    </form>
  );
}