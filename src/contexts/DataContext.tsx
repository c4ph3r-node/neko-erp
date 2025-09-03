import React, { createContext, useContext, useState, useEffect } from 'react';

// Centralized data store for all ERP modules
interface DataContextType {
  // Core Data
  customers: any[];
  vendors: any[];
  employees: any[];
  items: any[];
  invoices: any[];
  estimates: any[];
  purchaseOrders: any[];
  projects: any[];
  bankAccounts: any[];
  transactions: any[];
  assets: any[];
  accounts: any[];
  journalEntries: any[];
  taxReturns: any[];
  budgets: any[];
  cashFlowEntries: any[];
  users: any[];
  roles: any[];
  
  // CRUD Operations
  addCustomer: (customer: any) => void;
  updateCustomer: (id: number, customer: any) => void;
  deleteCustomer: (id: number) => void;
  
  addVendor: (vendor: any) => void;
  updateVendor: (id: number, vendor: any) => void;
  deleteVendor: (id: number) => void;
  
  addEmployee: (employee: any) => void;
  updateEmployee: (id: number, employee: any) => void;
  deleteEmployee: (id: number) => void;
  
  addItem: (item: any) => void;
  updateItem: (id: number, item: any) => void;
  deleteItem: (id: number) => void;
  
  addInvoice: (invoice: any) => void;
  updateInvoice: (id: number, invoice: any) => void;
  deleteInvoice: (id: number) => void;
  
  addEstimate: (estimate: any) => void;
  updateEstimate: (id: number, estimate: any) => void;
  deleteEstimate: (id: number) => void;
  convertEstimateToInvoice: (estimateId: number) => void;
  
  addPurchaseOrder: (po: any) => void;
  updatePurchaseOrder: (id: number, po: any) => void;
  deletePurchaseOrder: (id: number) => void;
  
  addProject: (project: any) => void;
  updateProject: (id: number, project: any) => void;
  deleteProject: (id: number) => void;
  
  addBankAccount: (account: any) => void;
  updateBankAccount: (id: number, account: any) => void;
  deleteBankAccount: (id: number) => void;
  
  addTransaction: (transaction: any) => void;
  updateTransaction: (id: number, transaction: any) => void;
  deleteTransaction: (id: number) => void;
  
  addAsset: (asset: any) => void;
  updateAsset: (id: number, asset: any) => void;
  deleteAsset: (id: number) => void;
  
  addBudget: (budget: any) => void;
  updateBudget: (id: number, budget: any) => void;
  deleteBudget: (id: number) => void;
  
  addCashFlowEntry: (entry: any) => void;
  updateCashFlowEntry: (id: number, entry: any) => void;
  deleteCashFlowEntry: (id: number) => void;
  
  addTaxReturn: (taxReturn: any) => void;
  updateTaxReturn: (id: number, taxReturn: any) => void;
  deleteTaxReturn: (id: number) => void;
  
  addUser: (user: any) => void;
  updateUser: (id: number, user: any) => void;
  deleteUser: (id: number) => void;
  
  addRole: (role: any) => void;
  updateRole: (id: number, role: any) => void;
  deleteRole: (id: number) => void;
  
  // Business Operations
  sendInvoice: (invoiceId: number) => void;
  sendEstimate: (estimateId: number) => void;
  approveEstimate: (estimateId: number) => void;
  rejectEstimate: (estimateId: number) => void;
  approvePurchaseOrder: (poId: number) => void;
  processPayroll: (payrollId: number) => void;
  approveTimesheet: (timesheetId: number) => void;
  approveLeaveRequest: (leaveId: number) => void;
  
  // Reporting Functions
  generateReport: (reportType: string, parameters: any) => any;
  exportData: (dataType: string, format: string) => void;
  
  // Utility Functions
  getNextNumber: (type: string) => string;
  calculateTotals: (items: any[]) => { subtotal: number; tax: number; total: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Initialize with realistic interconnected data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, New York, NY 10001',
      balance: 5250.00,
      status: 'active',
      lastTransaction: '2025-01-15',
      creditLimit: 10000.00,
      paymentTerms: 30,
      taxNumber: 'TAX123456',
      currency: 'USD'
    },
    {
      id: 2,
      name: 'TechStart Inc',
      email: 'billing@techstart.com',
      phone: '+1 (555) 987-6543',
      address: '456 Innovation Dr, San Francisco, CA 94105',
      balance: 3800.00,
      status: 'active',
      lastTransaction: '2025-01-14',
      creditLimit: 15000.00,
      paymentTerms: 45,
      taxNumber: 'TAX789012',
      currency: 'USD'
    }
  ]);

  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Office Supplies Co.',
      email: 'billing@officesupplies.com',
      phone: '+1 (555) 234-5678',
      address: '456 Supply St, Business City, BC 12345',
      balance: -2500.00,
      status: 'active',
      paymentTerms: 30,
      lastTransaction: '2025-01-14',
      taxNumber: 'VEN123456',
      currency: 'USD'
    },
    {
      id: 2,
      name: 'Tech Equipment Ltd',
      email: 'accounts@techequipment.com',
      phone: '+1 (555) 345-6789',
      address: '789 Tech Ave, Innovation City, IC 67890',
      balance: -5200.00,
      status: 'active',
      paymentTerms: 45,
      lastTransaction: '2025-01-12',
      taxNumber: 'VEN789012',
      currency: 'USD'
    }
  ]);

  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeNumber: 'EMP-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Software Engineer',
      department: 'Engineering',
      salary: 75000,
      payFrequency: 'monthly',
      hireDate: '2023-01-15',
      status: 'active',
      lastPayroll: '2025-01-01',
      ytdGross: 6250.00,
      ytdDeductions: 1875.00,
      ytdNet: 4375.00
    },
    {
      id: 2,
      employeeNumber: 'EMP-002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678',
      position: 'Marketing Manager',
      department: 'Marketing',
      salary: 65000,
      payFrequency: 'monthly',
      hireDate: '2022-08-20',
      status: 'active',
      lastPayroll: '2025-01-01',
      ytdGross: 5416.67,
      ytdDeductions: 1625.00,
      ytdNet: 3791.67
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-001',
      customerId: 1,
      customerName: 'Acme Corporation',
      amount: 5250.00,
      status: 'paid',
      issueDate: '2025-01-10',
      dueDate: '2025-02-09',
      description: 'Website development services',
      lines: [
        { description: 'Frontend Development', quantity: 40, unitPrice: 100.00, amount: 4000.00 },
        { description: 'Backend Development', quantity: 25, unitPrice: 50.00, amount: 1250.00 }
      ]
    },
    {
      id: 2,
      invoiceNumber: 'INV-002',
      customerId: 2,
      customerName: 'TechStart Inc',
      amount: 3800.00,
      status: 'sent',
      issueDate: '2025-01-12',
      dueDate: '2025-02-11',
      description: 'Consulting services',
      lines: [
        { description: 'Consulting Services', quantity: 60, unitPrice: 63.33, amount: 3800.00 }
      ]
    }
  ]);

  const [estimates, setEstimates] = useState([
    {
      id: 1,
      estimateNumber: 'EST-001',
      customerId: 1,
      customer: 'Acme Corporation',
      issueDate: '2025-01-10',
      expiryDate: '2025-02-09',
      status: 'sent',
      subtotal: 5250.00,
      taxAmount: 525.00,
      total: 5775.00,
      description: 'Website development services estimate',
      items: [
        { description: 'Frontend Development', quantity: 40, unitPrice: 100.00, amount: 4000.00 },
        { description: 'Backend Development', quantity: 25, unitPrice: 50.00, amount: 1250.00 }
      ]
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      code: 'WEB-001',
      customerId: 1,
      customer: 'Acme Corporation',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      budget: 25000.00,
      actualCost: 8500.00,
      billingType: 'fixed',
      progress: 35,
      hoursLogged: 120,
      budgetedHours: 300,
      manager: 'John Doe'
    }
  ]);

  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      name: 'Business Checking',
      accountNumber: '****1234',
      bankName: 'First National Bank',
      accountType: 'checking',
      balance: 45250.75,
      currency: 'USD',
      isDefault: true
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      bankAccountId: 1,
      date: '2025-01-15',
      description: 'Customer Payment - INV-001',
      reference: 'DEP-001',
      debit: 0,
      credit: 5250.00,
      balance: 45250.75,
      status: 'cleared',
      category: 'Income'
    }
  ]);

  const [assets, setAssets] = useState([
    {
      id: 1,
      assetNumber: 'AST-001',
      name: 'Dell Laptop - Engineering',
      category: 'Computer Equipment',
      purchaseDate: '2023-01-15',
      purchasePrice: 1200.00,
      currentValue: 800.00,
      location: 'Engineering Office',
      condition: 'good',
      status: 'active'
    }
  ]);

  const [budgets, setBudgets] = useState([
    {
      id: 1,
      name: 'Annual Budget 2025',
      period: '2025',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'active',
      totalBudget: 500000.00,
      actualSpent: 125000.00,
      variance: -375000.00,
      categories: [
        { name: 'Revenue', budgeted: 600000.00, actual: 150000.00, variance: -450000.00 },
        { name: 'Operating Expenses', budgeted: 180000.00, actual: 45000.00, variance: -135000.00 }
      ]
    }
  ]);

  const [cashFlowEntries, setCashFlowEntries] = useState([
    {
      id: 1,
      date: '2025-01-15',
      description: 'Customer Payment - Acme Corp',
      category: 'Accounts Receivable',
      type: 'inflow',
      amount: 5250.00,
      status: 'actual',
      runningBalance: 125450.00
    }
  ]);

  const [taxReturns, setTaxReturns] = useState([
    {
      id: 1,
      returnType: 'VAT Return',
      period: 'Q4 2024',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      dueDate: '2025-01-31',
      status: 'filed',
      totalSales: 180500.00,
      vatOnSales: 18050.00,
      netVat: 7690.00
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      role: 'super_admin',
      status: 'active',
      twoFactorEnabled: true,
      permissions: ['all']
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Administrator',
      code: 'super_admin',
      description: 'Full system access',
      permissions: ['all'],
      userCount: 1,
      isSystemRole: true
    }
  ]);

  // Utility Functions
  const getNextNumber = (type: string): string => {
    const counts = {
      invoice: invoices.length + 1,
      estimate: estimates.length + 1,
      purchaseOrder: purchaseOrders.length + 1,
      project: projects.length + 1,
      employee: employees.length + 1,
      asset: assets.length + 1
    };
    
    const prefixes = {
      invoice: 'INV',
      estimate: 'EST',
      purchaseOrder: 'PO',
      project: 'PRJ',
      employee: 'EMP',
      asset: 'AST'
    };
    
    const count = counts[type as keyof typeof counts] || 1;
    const prefix = prefixes[type as keyof typeof prefixes] || 'DOC';
    return `${prefix}-${String(count).padStart(3, '0')}`;
  };

  const calculateTotals = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Customer CRUD
  const addCustomer = (customer: any) => {
    const newCustomer = { ...customer, id: Date.now(), balance: 0, status: 'active' };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: number, customer: any) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
  };

  const deleteCustomer = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Vendor CRUD
  const addVendor = (vendor: any) => {
    const newVendor = { ...vendor, id: Date.now(), balance: 0, status: 'active' };
    setVendors(prev => [...prev, newVendor]);
  };

  const updateVendor = (id: number, vendor: any) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...vendor } : v));
  };

  const deleteVendor = (id: number) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  // Invoice CRUD with Customer Balance Updates
  const addInvoice = (invoice: any) => {
    const newInvoice = { 
      ...invoice, 
      id: Date.now(), 
      invoiceNumber: getNextNumber('invoice'),
      status: 'draft'
    };
    setInvoices(prev => [...prev, newInvoice]);
    
    // Update customer balance
    if (invoice.customerId) {
      setCustomers(prev => prev.map(c => 
        c.id === invoice.customerId 
          ? { ...c, balance: c.balance + invoice.total, lastTransaction: invoice.issueDate }
          : c
      ));
    }
  };

  const updateInvoice = (id: number, invoice: any) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...invoice } : i));
  };

  const deleteInvoice = (id: number) => {
    const invoice = invoices.find(i => i.id === id);
    if (invoice) {
      // Update customer balance
      setCustomers(prev => prev.map(c => 
        c.id === invoice.customerId 
          ? { ...c, balance: c.balance - invoice.amount }
          : c
      ));
    }
    setInvoices(prev => prev.filter(i => i.id !== id));
  };

  // Estimate CRUD
  const addEstimate = (estimate: any) => {
    const newEstimate = { 
      ...estimate, 
      id: Date.now(), 
      estimateNumber: getNextNumber('estimate'),
      status: 'draft'
    };
    setEstimates(prev => [...prev, newEstimate]);
  };

  const updateEstimate = (id: number, estimate: any) => {
    setEstimates(prev => prev.map(e => e.id === id ? { ...e, ...estimate } : e));
  };

  const deleteEstimate = (id: number) => {
    setEstimates(prev => prev.filter(e => e.id !== id));
  };

  const convertEstimateToInvoice = (estimateId: number) => {
    const estimate = estimates.find(e => e.id === estimateId);
    if (estimate) {
      const newInvoice = {
        customerId: estimate.customerId,
        customerName: estimate.customer,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lines: estimate.items,
        subtotal: estimate.subtotal,
        taxAmount: estimate.taxAmount,
        total: estimate.total,
        description: estimate.description
      };
      addInvoice(newInvoice);
      updateEstimate(estimateId, { status: 'converted' });
    }
  };

  // Business Operations
  const sendInvoice = (invoiceId: number) => {
    setInvoices(prev => prev.map(i => 
      i.id === invoiceId ? { ...i, status: 'sent', sentAt: new Date().toISOString() } : i
    ));
  };

  const sendEstimate = (estimateId: number) => {
    setEstimates(prev => prev.map(e => 
      e.id === estimateId ? { ...e, status: 'sent', sentAt: new Date().toISOString() } : e
    ));
  };

  const approveEstimate = (estimateId: number) => {
    setEstimates(prev => prev.map(e => 
      e.id === estimateId ? { ...e, status: 'accepted' } : e
    ));
  };

  const rejectEstimate = (estimateId: number) => {
    setEstimates(prev => prev.map(e => 
      e.id === estimateId ? { ...e, status: 'rejected' } : e
    ));
  };

  // Reporting Functions
  const generateReport = (reportType: string, parameters: any) => {
    switch (reportType) {
      case 'profit_loss':
        const revenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
        const expenses = transactions.filter(t => t.debit > 0).reduce((sum, t) => sum + t.debit, 0);
        return { revenue, expenses, netIncome: revenue - expenses };
      
      case 'balance_sheet':
        const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0);
        const totalLiabilities = vendors.reduce((sum, v) => sum + Math.abs(v.balance), 0);
        return { totalAssets, totalLiabilities, equity: totalAssets - totalLiabilities };
      
      case 'cash_flow':
        const inflows = cashFlowEntries.filter(e => e.type === 'inflow').reduce((sum, e) => sum + e.amount, 0);
        const outflows = cashFlowEntries.filter(e => e.type === 'outflow').reduce((sum, e) => sum + e.amount, 0);
        return { inflows, outflows, netCashFlow: inflows - outflows };
      
      default:
        return {};
    }
  };

  const exportData = (dataType: string, format: string) => {
    let data: any[] = [];
    let filename = '';
    
    switch (dataType) {
      case 'customers':
        data = customers;
        filename = 'customers';
        break;
      case 'vendors':
        data = vendors;
        filename = 'vendors';
        break;
      case 'invoices':
        data = invoices;
        filename = 'invoices';
        break;
      case 'employees':
        data = employees;
        filename = 'employees';
        break;
      default:
        return;
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      downloadFile(csv, `${filename}.csv`, 'text/csv');
    } else if (format === 'excel') {
      // Simulate Excel export
      console.log(`Exporting ${dataType} to Excel format`);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Initialize other state arrays
  const [items, setItems] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);

  const value: DataContextType = {
    // Data
    customers, vendors, employees, items, invoices, estimates, purchaseOrders,
    projects, bankAccounts, transactions, assets, accounts, journalEntries,
    taxReturns, budgets, cashFlowEntries, users, roles,
    
    // Customer CRUD
    addCustomer, updateCustomer, deleteCustomer,
    
    // Vendor CRUD
    addVendor, updateVendor, deleteVendor,
    
    // Employee CRUD
    addEmployee: (employee: any) => {
      const newEmployee = { ...employee, id: Date.now(), employeeNumber: getNextNumber('employee') };
      setEmployees(prev => [...prev, newEmployee]);
    },
    updateEmployee: (id: number, employee: any) => {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...employee } : e));
    },
    deleteEmployee: (id: number) => {
      setEmployees(prev => prev.filter(e => e.id !== id));
    },
    
    // Invoice CRUD
    addInvoice, updateInvoice, deleteInvoice,
    
    // Estimate CRUD
    addEstimate, updateEstimate, deleteEstimate, convertEstimateToInvoice,
    
    // Other CRUD operations (simplified for brevity)
    addItem: (item: any) => setItems(prev => [...prev, { ...item, id: Date.now() }]),
    updateItem: (id: number, item: any) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i)),
    deleteItem: (id: number) => setItems(prev => prev.filter(i => i.id !== id)),
    
    addPurchaseOrder: (po: any) => setPurchaseOrders(prev => [...prev, { ...po, id: Date.now() }]),
    updatePurchaseOrder: (id: number, po: any) => setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, ...po } : p)),
    deletePurchaseOrder: (id: number) => setPurchaseOrders(prev => prev.filter(p => p.id !== id)),
    
    addProject: (project: any) => setProjects(prev => [...prev, { ...project, id: Date.now() }]),
    updateProject: (id: number, project: any) => setProjects(prev => prev.map(p => p.id === id ? { ...p, ...project } : p)),
    deleteProject: (id: number) => setProjects(prev => prev.filter(p => p.id !== id)),
    
    addBankAccount: (account: any) => setBankAccounts(prev => [...prev, { ...account, id: Date.now() }]),
    updateBankAccount: (id: number, account: any) => setBankAccounts(prev => prev.map(a => a.id === id ? { ...a, ...account } : a)),
    deleteBankAccount: (id: number) => setBankAccounts(prev => prev.filter(a => a.id !== id)),
    
    addTransaction: (transaction: any) => {
      const newTransaction = { ...transaction, id: Date.now() };
      setTransactions(prev => [...prev, newTransaction]);
      
      // Update bank account balance
      if (transaction.bankAccountId) {
        setBankAccounts(prev => prev.map(acc => 
          acc.id === transaction.bankAccountId 
            ? { ...acc, balance: acc.balance + (transaction.credit || 0) - (transaction.debit || 0) }
            : acc
        ));
      }
    },
    updateTransaction: (id: number, transaction: any) => setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...transaction } : t)),
    deleteTransaction: (id: number) => setTransactions(prev => prev.filter(t => t.id !== id)),
    
    addAsset: (asset: any) => setAssets(prev => [...prev, { ...asset, id: Date.now() }]),
    updateAsset: (id: number, asset: any) => setAssets(prev => prev.map(a => a.id === id ? { ...a, ...asset } : a)),
    deleteAsset: (id: number) => setAssets(prev => prev.filter(a => a.id !== id)),
    
    addBudget: (budget: any) => setBudgets(prev => [...prev, { ...budget, id: Date.now() }]),
    updateBudget: (id: number, budget: any) => setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...budget } : b)),
    deleteBudget: (id: number) => setBudgets(prev => prev.filter(b => b.id !== id)),
    
    addCashFlowEntry: (entry: any) => setCashFlowEntries(prev => [...prev, { ...entry, id: Date.now() }]),
    updateCashFlowEntry: (id: number, entry: any) => setCashFlowEntries(prev => prev.map(e => e.id === id ? { ...e, ...entry } : e)),
    deleteCashFlowEntry: (id: number) => setCashFlowEntries(prev => prev.filter(e => e.id !== id)),
    
    addTaxReturn: (taxReturn: any) => setTaxReturns(prev => [...prev, { ...taxReturn, id: Date.now() }]),
    updateTaxReturn: (id: number, taxReturn: any) => setTaxReturns(prev => prev.map(t => t.id === id ? { ...t, ...taxReturn } : t)),
    deleteTaxReturn: (id: number) => setTaxReturns(prev => prev.filter(t => t.id !== id)),
    
    addUser: (user: any) => setUsers(prev => [...prev, { ...user, id: Date.now() }]),
    updateUser: (id: number, user: any) => setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u)),
    deleteUser: (id: number) => setUsers(prev => prev.filter(u => u.id !== id)),
    
    addRole: (role: any) => setRoles(prev => [...prev, { ...role, id: Date.now() }]),
    updateRole: (id: number, role: any) => setRoles(prev => prev.map(r => r.id === id ? { ...r, ...role } : r)),
    deleteRole: (id: number) => setRoles(prev => prev.filter(r => r.id !== id)),
    
    // Business Operations
    sendInvoice, sendEstimate, approveEstimate, rejectEstimate,
    approvePurchaseOrder: (poId: number) => {
      setPurchaseOrders(prev => prev.map(po => 
        po.id === poId ? { ...po, status: 'approved', approvedAt: new Date().toISOString() } : po
      ));
    },
    processPayroll: (payrollId: number) => {
      console.log('Processing payroll:', payrollId);
    },
    approveTimesheet: (timesheetId: number) => {
      console.log('Approving timesheet:', timesheetId);
    },
    approveLeaveRequest: (leaveId: number) => {
      console.log('Approving leave request:', leaveId);
    },
    
    // Utility Functions
    getNextNumber, calculateTotals, generateReport, exportData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}