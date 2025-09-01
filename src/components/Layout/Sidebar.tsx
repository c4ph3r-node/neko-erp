import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  BookOpen, 
  BarChart3, 
  Settings,
  X,
  Building2,
  Package,
  CreditCard,
  FolderOpen,
  Building,
  UserCheck,
  Wrench,
  Cog,
  ShoppingCart,
  Zap,
  Calculator,
  DollarSign,
  TrendingUp,
  Shield,
  Target
} from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Vendors', href: '/vendors', icon: Building },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Estimates', href: '/estimates', icon: FileText },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Banking', href: '/banking', icon: CreditCard },
  { name: 'Cash Flow', href: '/cash-flow', icon: TrendingUp },
  { name: 'Budgeting', href: '/budgeting', icon: Target },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Sales Orders', href: '/sales-orders', icon: ShoppingCart },
  { name: 'Manufacturing', href: '/manufacturing', icon: Cog },
  { name: 'Payroll & HR', href: '/payroll', icon: UserCheck },
  { name: 'Fixed Assets', href: '/fixed-assets', icon: Wrench },
  { name: 'Accounting', href: '/accounting', icon: BookOpen },
  { name: 'Tax & Compliance', href: '/tax-compliance', icon: Calculator },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Workflows', href: '/workflows', icon: Zap },
  { name: 'User Management', href: '/user-management', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { tenant } = useTenant();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">CloudERP</h1>
              {tenant && (
                <p className="text-xs text-gray-500">{tenant.name}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
              onClick={() => setOpen(false)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}