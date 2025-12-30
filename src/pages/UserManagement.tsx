import React, { useState } from 'react';
import { Plus, Search, Users, Shield, Key, Mail, Phone, Edit, Trash2, UserPlus, Settings, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import UserForm from '../components/Forms/UserForm';
import RoleForm from '../components/Forms/RoleForm';
import { useGlobalState } from '../contexts/GlobalStateContext';

const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2025-01-15 14:30',
    twoFactorEnabled: true,
    permissions: ['all'],
    createdAt: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1 (555) 234-5678',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-01-15 16:45',
    twoFactorEnabled: false,
    permissions: ['users', 'accounting', 'reports'],
    createdAt: '2022-08-20',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@company.com',
    phone: '+1 (555) 345-6789',
    role: 'accountant',
    status: 'active',
    lastLogin: '2025-01-14 09:15',
    twoFactorEnabled: true,
    permissions: ['accounting', 'banking', 'reports'],
    createdAt: '2023-03-10',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice.brown@company.com',
    phone: '+1 (555) 456-7890',
    role: 'employee',
    status: 'pending',
    lastLogin: null,
    twoFactorEnabled: false,
    permissions: ['projects', 'timesheets'],
    createdAt: '2025-01-10',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
  }
];

const mockRoles = [
  {
    id: 1,
    name: 'Super Administrator',
    code: 'super_admin',
    description: 'Full system access with all permissions',
    permissions: ['all'],
    userCount: 1,
    isSystemRole: true
  },
  {
    id: 2,
    name: 'Administrator',
    code: 'admin',
    description: 'Administrative access to most system functions',
    permissions: ['users', 'accounting', 'banking', 'inventory', 'reports', 'settings'],
    userCount: 1,
    isSystemRole: true
  },
  {
    id: 3,
    name: 'Accountant',
    code: 'accountant',
    description: 'Access to financial and accounting modules',
    permissions: ['accounting', 'banking', 'invoices', 'reports', 'tax'],
    userCount: 1,
    isSystemRole: true
  },
  {
    id: 4,
    name: 'Business Owner',
    code: 'business_owner',
    description: 'Business owner with dashboard and reporting access',
    permissions: ['dashboard', 'reports', 'customers', 'projects'],
    userCount: 0,
    isSystemRole: true
  },
  {
    id: 5,
    name: 'Employee',
    code: 'employee',
    description: 'Basic employee access to timesheets and projects',
    permissions: ['projects', 'timesheets', 'expenses'],
    userCount: 1,
    isSystemRole: true
  },
  {
    id: 6,
    name: 'Sales Manager',
    code: 'sales_manager',
    description: 'Sales team management and customer access',
    permissions: ['customers', 'invoices', 'estimates', 'sales_orders', 'reports'],
    userCount: 0,
    isSystemRole: false
  }
];

const mockAuditLogs = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    action: 'User Login',
    entityType: 'Authentication',
    entityId: null,
    timestamp: '2025-01-15 14:30:25',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Successful login'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Smith',
    action: 'Invoice Created',
    entityType: 'Invoice',
    entityId: 'INV-001',
    timestamp: '2025-01-15 16:45:12',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    details: 'Created invoice for Acme Corporation - $5,250.00'
  },
  {
    id: 3,
    userId: 3,
    userName: 'Bob Johnson',
    action: 'Bank Transaction Added',
    entityType: 'Transaction',
    entityId: 'TXN-001',
    timestamp: '2025-01-14 09:15:33',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: 'Added bank transaction - Office Supplies Purchase'
  }
];

export default function UserManagement() {
  const { showNotification } = useGlobalState();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState(mockRoles);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<any>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getRoleDisplay = (roleCode: string) => {
    const role = roles.find(r => r.code === roleCode);
    return role ? role.name : roleCode;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const users2FA = users.filter(u => u.twoFactorEnabled).length;

  // User CRUD Operations
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleSubmitUser = (userData: any) => {
    if (editingUser) {
      setUsers(prev => prev.map(user => user.id === editingUser.id ? { ...user, ...userData } : user));
    } else {
      const newUser = { ...userData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
      setUsers(prev => [...prev, newUser]);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleSuspendUser = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' } : user
    ));
  };

  const handleActivateUser = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
  };

  const handleResendInvitation = (userId: number) => {
    showNotification('Invitation resent successfully', 'success');
  };

  // Role CRUD Operations
  const handleAddRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleSubmitRole = (roleData: any) => {
    if (editingRole) {
      setRoles(prev => prev.map(role => role.id === editingRole.id ? { ...role, ...roleData } : role));
    } else {
      const newRole = { ...roleData, id: Date.now(), userCount: 0, isSystemRole: false };
      setRoles(prev => [...prev, newRole]);
    }
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      showNotification('Cannot delete system roles', 'error');
      return;
    }
    if (role?.userCount > 0) {
      showNotification('Cannot delete role with assigned users', 'error');
      return;
    }
    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management & Security</h1>
          <p className="text-gray-600">Manage users, roles, permissions, and security settings</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => navigate('/settings')}>
            <Shield className="w-4 h-4 mr-2" />
            Security Settings
          </Button>
          <Button onClick={handleAddUser}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Invitations</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingUsers}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{users2FA}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Audit Logs
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </Card>

          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2FA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={user.avatar}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {getRoleDisplay(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {user.lastLogin || 'Never'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {user.twoFactorEnabled ? (
                            <Shield className="w-4 h-4 text-green-600 mr-1" />
                          ) : (
                            <Shield className="w-4 h-4 text-gray-400 mr-1" />
                          )}
                          <span className={`text-xs ${user.twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                            {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleSuspendUser(user.id)}
                            className="p-1 text-gray-500 hover:text-yellow-600"
                          >
                            {user.status === 'suspended' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                          {user.status === 'pending' && (
                            <button 
                              onClick={() => handleResendInvitation(user.id)}
                              className="p-1 text-gray-500 hover:text-green-600"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Roles & Permissions</h2>
              <Button onClick={handleAddRole}>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.id}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            {role.code}
                          </span>
                          {role.isSystemRole && (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              System Role
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 4).map((permission, index) => (
                          <span key={index} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{role.permissions.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {role.userCount} users
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => handleEditRole(role)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!role.isSystemRole && (
                          <Button variant="secondary" size="sm" onClick={() => handleDeleteRole(role.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Audit Logs</h2>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => showNotification('Audit logs exported successfully', 'success')}>
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
              <Button variant="secondary" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Audit Settings
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{log.timestamp}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{log.userName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{log.entityType}</p>
                        {log.entityId && (
                          <p className="text-xs text-gray-500">{log.entityId}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{log.ipAddress}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{log.details}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Edit User' : 'Invite New User'}
        size="lg"
      >
        <UserForm
          user={editingUser}
          roles={roles}
          onSubmit={handleSubmitUser}
          onCancel={() => setShowUserModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={editingRole ? 'Edit Role' : 'Create New Role'}
        size="lg"
      >
        <RoleForm
          role={editingRole}
          onSubmit={handleSubmitRole}
          onCancel={() => setShowRoleModal(false)}
        />
      </Modal>
    </div>
  );
}