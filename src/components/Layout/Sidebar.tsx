import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, BookOpen, BarChart3, Settings, X, Building2, Package, CreditCard, FolderOpen, Building, UserCheck, Wrench, Cog, ShoppingCart, Zap, Calculator, DollarSign, TrendingUp, Shield, Target, Factory, Truck, Users as Users2, Briefcase, PieChart, ChevronDown, ChevronRight } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const moduleGroups = [
  {
    title: 'Dashboard',
    items: [
      { name: 'Dashboard', href: '/', icon: Home }
    ]
  },
  {
    title: 'Finance & Accounting',
    items: [
      { name: 'General Ledger', href: '/accounting', icon: BookOpen },
      { name: 'Banking', href: '/banking', icon: CreditCard },
      { name: 'Cash Flow', href: '/cash-flow', icon: TrendingUp },
      { name: 'Budgeting', href: '/budgeting', icon: Target },
      { name: 'Tax & Compliance', href: '/tax-compliance', icon: Calculator },
      { name: 'Reports', href: '/reports', icon: BarChart3 }
    ]
  },
  {
    title: 'Sales & CRM',
    items: [
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Estimates & Quotes', href: '/estimates', icon: FileText },
      { name: 'Invoices', href: '/invoices', icon: FileText },
      { name: 'Sales Orders', href: '/sales-orders', icon: ShoppingCart }
    ]
  },
  {
    title: 'Procurement & Vendors',
    items: [
      { name: 'Vendors', href: '/vendors', icon: Building },
      { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart }
    ]
  },
  {
    title: 'Inventory & Assets',
    items: [
      { name: 'Inventory Management', href: '/inventory', icon: Package },
      { name: 'Fixed Assets', href: '/fixed-assets', icon: Wrench }
    ]
  },
  {
    title: 'Production & Manufacturing',
    items: [
      { name: 'Manufacturing (MRP)', href: '/manufacturing', icon: Factory },
      { name: 'Projects', href: '/projects', icon: FolderOpen }
    ]
  },
  {
    title: 'Human Resources',
    items: [
      { name: 'Payroll & HR', href: '/payroll', icon: UserCheck },
      { name: 'User Management', href: '/user-management', icon: Shield }
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Documents', href: '/documents', icon: FileText },
      { name: 'Workflows', href: '/workflows', icon: Zap }
    ]
  },
  {
    title: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Settings }
    ]
  }
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { tenant } = useTenant();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Dashboard', 'Finance & Accounting']);

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

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
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">NekoERP</h1>
              <p className="text-xs text-gray-500">Kenyan Business Suite</p>
              {tenant && (
                <p className="text-xs text-blue-600">{tenant.name}</p>
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

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <style jsx>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}</style>
          {moduleGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.title}
                  </span>
                </span>
                {expandedGroups.includes(group.title) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>
              
              {expandedGroups.includes(group.title) && (
                <div className="ml-2 space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}