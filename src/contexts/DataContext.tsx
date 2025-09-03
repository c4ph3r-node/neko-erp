import React, { createContext, useContext, useState, useEffect } from 'react';

// Centralized data store for all ERP modules with interrelated data
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
  payrollRuns: any[];
  timeEntries: any[];
  leaveRequests: any[];
  maintenanceRecords: any[];
  salesOrders: any[];
  workOrders: any[];
  
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
  sendInvoice: (id: number) => void;
  
  addEstimate: (estimate: any) => void;
  updateEstimate: (id: number, estimate: any) => void;
  deleteEstimate: (id: number) => void;
  sendEstimate: (id: number) => void;
  convertEstimateToInvoice: (estimateId: number) => void;
  
  addPurchaseOrder: (po: any) => void;
  updatePurchaseOrder: (id: number, po: any) => void;
  deletePurchaseOrder: (id: number) => void;
  approvePurchaseOrder: (id: number) => void;
  
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
  fileTaxReturn: (id: number) => void;
  
  addUser: (user: any) => void;
  updateUser: (id: number, user: any) => void;
  deleteUser: (id: number) => void;
  
  addRole: (role: any) => void;
  updateRole: (id: number, role: any) => void;
  deleteRole: (id: number) => void;
  
  addPayrollRun: (payroll: any) => void;
  updatePayrollRun: (id: number, payroll: any) => void;
  deletePayrollRun: (id: number) => void;
  processPayroll: (id: number) => void;
  
  addTimeEntry: (entry: any) => void;
  updateTimeEntry: (id: number, entry: any) => void;
  deleteTimeEntry: (id: number) => void;
  approveTimeEntry: (id: number) => void;
  
  addLeaveRequest: (request: any) => void;
  updateLeaveRequest: (id: number, request: any) => void;
  deleteLeaveRequest: (id: number) => void;
  approveLeaveRequest: (id: number) => void;
  rejectLeaveRequest: (id: number) => void;
  
  // Business Operations
  generateReport: (reportType: string, parameters: any) => any;
  exportData: (dataType: string, format: string) => void;
  downloadDocument: (type: string, id: number) => void;
  
  // Utility Functions
  getNextNumber: (type: string) => string;
  calculateTotals: (items: any[]) => { subtotal: number; tax: number; total: number };
  updateRelatedData: (entityType: string, entityId: number, updates: any) => void;
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
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      balance: 5250.00,
      status: 'active',
      lastTransaction: '2025-01-15',
      creditLimit: 10000.00,
      paymentTerms: 30,
      taxNumber: 'TAX123456',
      currency: 'USD',
      contactPerson: 'John Smith',
      priceLevel: 'Standard',
      isActive: true,
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      name: 'TechStart Inc',
      email: 'billing@techstart.com',
      phone: '+1 (555) 987-6543',
      address: {
        street: '456 Innovation Dr',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'United States'
      },
      balance: 3800.00,
      status: 'active',
      lastTransaction: '2025-01-14',
      creditLimit: 15000.00,
      paymentTerms: 45,
      taxNumber: 'TAX789012',
      currency: 'USD',
      contactPerson: 'Sarah Johnson',
      priceLevel: 'Premium',
      isActive: true,
      createdAt: '2022-08-20'
    },
    {
      id: 3,
      name: 'Global Dynamics',
      email: 'accounting@globaldynamics.com',
      phone: '+1 (555) 456-7890',
      address: {
        street: '789 Corporate Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States'
      },
      balance: 0.00,
      status: 'active',
      lastTransaction: '2025-01-10',
      creditLimit: 20000.00,
      paymentTerms: 30,
      taxNumber: 'TAX345678',
      currency: 'USD',
      contactPerson: 'Mike Wilson',
      priceLevel: 'Standard',
      isActive: true,
      createdAt: '2023-06-10'
    }
  ]);

  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Office Supplies Co.',
      email: 'billing@officesupplies.com',
      phone: '+1 (555) 234-5678',
      address: {
        street: '456 Supply St',
        city: 'Business City',
        state: 'BC',
        zipCode: '12345',
        country: 'United States'
      },
      balance: -2500.00,
      status: 'active',
      paymentTerms: 30,
      lastTransaction: '2025-01-14',
      taxNumber: 'VEN123456',
      currency: 'USD',
      contactPerson: 'Lisa Chen',
      isActive: true
    },
    {
      id: 2,
      name: 'Tech Equipment Ltd',
      email: 'accounts@techequipment.com',
      phone: '+1 (555) 345-6789',
      address: {
        street: '789 Tech Ave',
        city: 'Innovation City',
        state: 'IC',
        zipCode: '67890',
        country: 'United States'
      },
      balance: -5200.00,
      status: 'active',
      paymentTerms: 45,
      lastTransaction: '2025-01-12',
      taxNumber: 'VEN789012',
      currency: 'USD',
      contactPerson: 'David Park',
      isActive: true
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
      ytdNet: 4375.00,
      address: '123 Main St, City, State 12345',
      taxId: '123-45-6789',
      bankAccount: {
        accountNumber: '****1234',
        routingNumber: '123456789',
        bankName: 'First National Bank'
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543'
      }
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
      ytdNet: 3791.67,
      address: '456 Oak Ave, City, State 67890',
      taxId: '987-65-4321',
      bankAccount: {
        accountNumber: '****5678',
        routingNumber: '987654321',
        bankName: 'Community Bank'
      },
      emergencyContact: {
        name: 'Bob Smith',
        relationship: 'Brother',
        phone: '+1 (555) 876-5432'
      }
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-001',
      customerId: 1,
      customerName: 'Acme Corporation',
      amount: 5250.00,
      subtotal: 5000.00,
      taxAmount: 250.00,
      total: 5250.00,
      status: 'paid',
      issueDate: '2025-01-10',
      dueDate: '2025-02-09',
      paidDate: '2025-01-15',
      description: 'Website development services',
      lines: [
        { id: '1', description: 'Frontend Development', quantity: 40, unitPrice: 100.00, discount: 0, taxRate: 5, amount: 4000.00 },
        { id: '2', description: 'Backend Development', quantity: 20, unitPrice: 50.00, discount: 0, taxRate: 5, amount: 1000.00 }
      ],
      notes: 'Thank you for your business',
      terms: 'Payment due within 30 days'
    },
    {
      id: 2,
      invoiceNumber: 'INV-002',
      customerId: 2,
      customerName: 'TechStart Inc',
      amount: 3800.00,
      subtotal: 3600.00,
      taxAmount: 200.00,
      total: 3800.00,
      status: 'sent',
      issueDate: '2025-01-12',
      dueDate: '2025-02-11',
      description: 'Consulting services',
      lines: [
        { id: '1', description: 'Consulting Services', quantity: 60, unitPrice: 60.00, discount: 0, taxRate: 5.56, amount: 3600.00 }
      ],
      notes: 'Monthly consulting retainer',
      terms: 'Payment due within 30 days'
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
      validityDays: 30,
      items: [
        { description: 'Frontend Development', quantity: 40, unitPrice: 100.00, amount: 4000.00 },
        { description: 'Backend Development', quantity: 25, unitPrice: 50.00, amount: 1250.00 }
      ],
      notes: 'This estimate is valid for 30 days from the issue date.',
      terms: 'Payment terms: 50% upfront, 50% on completion.'
    },
    {
      id: 2,
      estimateNumber: 'EST-002',
      customerId: 2,
      customer: 'TechStart Inc',
      issueDate: '2025-01-12',
      expiryDate: '2025-02-11',
      status: 'accepted',
      subtotal: 3800.00,
      taxAmount: 380.00,
      total: 4180.00,
      description: 'Mobile app development estimate',
      validityDays: 30,
      items: [
        { description: 'Mobile App Development', quantity: 60, unitPrice: 60.00, amount: 3600.00 },
        { description: 'App Store Submission', quantity: 1, unitPrice: 200.00, amount: 200.00 }
      ],
      notes: 'Includes iOS and Android versions.',
      terms: 'Payment in 3 milestones: 40%, 40%, 20%.'
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
      managerId: 1,
      manager: 'John Doe',
      description: 'Complete website redesign with modern UI/UX',
      priority: 'high',
      department: 'Engineering'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      code: 'APP-001',
      customerId: 2,
      customer: 'TechStart Inc',
      status: 'active',
      startDate: '2024-12-15',
      endDate: '2025-04-15',
      budget: 45000.00,
      actualCost: 15200.00,
      billingType: 'time_and_materials',
      progress: 25,
      hoursLogged: 180,
      budgetedHours: 500,
      managerId: 2,
      manager: 'Jane Smith',
      description: 'Cross-platform mobile application',
      priority: 'medium',
      department: 'Engineering'
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
      isDefault: true,
      isActive: true,
      routingNumber: '123456789',
      iban: '',
      swiftCode: 'FNBKUS33'
    },
    {
      id: 2,
      name: 'Business Savings',
      accountNumber: '****5678',
      bankName: 'First National Bank',
      accountType: 'savings',
      balance: 125000.00,
      currency: 'USD',
      isDefault: false,
      isActive: true,
      routingNumber: '123456789',
      iban: '',
      swiftCode: 'FNBKUS33'
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
      category: 'Income',
      relatedEntityType: 'invoice',
      relatedEntityId: 1
    },
    {
      id: 2,
      bankAccountId: 1,
      date: '2025-01-14',
      description: 'Office Supplies Purchase',
      reference: 'CHK-1234',
      debit: 342.00,
      credit: 0,
      balance: 40000.75,
      status: 'cleared',
      category: 'Expenses',
      relatedEntityType: 'expense',
      relatedEntityId: null
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
      depreciationMethod: 'straight_line',
      usefulLife: 3,
      salvageValue: 100.00,
      location: 'Engineering Office',
      condition: 'good',
      status: 'active',
      serialNumber: 'DL123456789',
      warrantyExpiry: '2026-01-15',
      lastMaintenanceDate: '2024-12-01',
      nextMaintenanceDate: '2025-06-01',
      supplier: 'Tech Equipment Ltd',
      model: 'Latitude 5520',
      manufacturer: 'Dell'
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
      variancePercent: -75.0,
      categories: [
        { name: 'Revenue', budgeted: 600000.00, actual: 150000.00, variance: -450000.00 },
        { name: 'Cost of Goods Sold', budgeted: 240000.00, actual: 60000.00, variance: -180000.00 },
        { name: 'Operating Expenses', budgeted: 180000.00, actual: 45000.00, variance: -135000.00 },
        { name: 'Marketing', budgeted: 50000.00, actual: 15000.00, variance: -35000.00 },
        { name: 'R&D', budgeted: 30000.00, actual: 5000.00, variance: -25000.00 }
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
      actualAmount: 5250.00,
      status: 'actual',
      runningBalance: 125450.00,
      relatedEntityType: 'invoice',
      relatedEntityId: 1
    },
    {
      id: 2,
      date: '2025-01-20',
      description: 'Rent Payment',
      category: 'Operating Expenses',
      type: 'outflow',
      amount: 2500.00,
      actualAmount: 0,
      status: 'projected',
      runningBalance: 122950.00,
      recurring: true,
      recurringFrequency: 'monthly'
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
      totalPurchases: 103600.00,
      vatOnSales: 18050.00,
      vatOnPurchases: 10360.00,
      netVat: 7690.00,
      filedDate: '2025-01-25',
      filedBy: 'John Smith'
    }
  ]);

  const [payrollRuns, setPayrollRuns] = useState([
    {
      id: 1,
      payPeriod: 'January 2025',
      payPeriodStart: '2025-01-01',
      payPeriodEnd: '2025-01-31',
      payDate: '2025-01-31',
      status: 'processed',
      employeeCount: 15,
      totalGross: 125000.00,
      totalDeductions: 37500.00,
      totalNet: 87500.00,
      entries: [
        { employeeId: 1, employeeName: 'John Doe', grossPay: 6250.00, deductions: 1875.00, netPay: 4375.00 },
        { employeeId: 2, employeeName: 'Jane Smith', grossPay: 5416.67, deductions: 1625.00, netPay: 3791.67 }
      ]
    }
  ]);

  const [timeEntries, setTimeEntries] = useState([
    {
      id: 1,
      employeeId: 1,
      employee: 'John Doe',
      projectId: 1,
      project: 'Website Redesign',
      date: '2025-01-15',
      hoursWorked: 8,
      overtime: 0,
      task: 'Frontend Development',
      description: 'Implemented responsive navigation component',
      billable: true,
      approved: true,
      hourlyRate: 75.00
    },
    {
      id: 2,
      employeeId: 2,
      employee: 'Jane Smith',
      projectId: 2,
      project: 'Mobile App Development',
      date: '2025-01-15',
      hoursWorked: 6,
      overtime: 2,
      task: 'UI Design',
      description: 'Created wireframes for mobile interface',
      billable: true,
      approved: false,
      hourlyRate: 65.00
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      employeeId: 1,
      employee: 'John Doe',
      type: 'Vacation',
      startDate: '2025-02-01',
      endDate: '2025-02-05',
      days: 5,
      status: 'pending',
      reason: 'Family vacation',
      halfDay: false,
      emergencyLeave: false
    }
  ]);

  const [users, setUsers] = useState([
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
    }
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Administrator',
      code: 'super_admin',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      userCount: 1,
      isSystemRole: true,
      isActive: true
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
      asset: assets.length + 1,
      payroll: payrollRuns.length + 1,
      user: users.length + 1
    };
    
    const prefixes = {
      invoice: 'INV',
      estimate: 'EST',
      purchaseOrder: 'PO',
      project: 'PRJ',
      employee: 'EMP',
      asset: 'AST',
      payroll: 'PAY',
      user: 'USR'
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

  const updateRelatedData = (entityType: string, entityId: number, updates: any) => {
    // Update related entities when one entity changes
    switch (entityType) {
      case 'customer':
        // Update invoices and estimates when customer changes
        setInvoices(prev => prev.map(inv => 
          inv.customerId === entityId ? { ...inv, customerName: updates.name } : inv
        ));
        setEstimates(prev => prev.map(est => 
          est.customerId === entityId ? { ...est, customer: updates.name } : est
        ));
        setProjects(prev => prev.map(proj => 
          proj.customerId === entityId ? { ...proj, customer: updates.name } : proj
        ));
        break;
      
      case 'employee':
        // Update time entries and payroll when employee changes
        setTimeEntries(prev => prev.map(entry => 
          entry.employeeId === entityId ? { ...entry, employee: `${updates.firstName} ${updates.lastName}` } : entry
        ));
        setLeaveRequests(prev => prev.map(leave => 
          leave.employeeId === entityId ? { ...leave, employee: `${updates.firstName} ${updates.lastName}` } : leave
        ));
        break;
      
      case 'project':
        // Update time entries when project changes
        setTimeEntries(prev => prev.map(entry => 
          entry.projectId === entityId ? { ...entry, project: updates.name } : entry
        ));
        break;
    }
  };

  // Customer CRUD with related data updates
  const addCustomer = (customer: any) => {
    const newCustomer = { 
      ...customer, 
      id: Date.now(), 
      balance: 0, 
      status: 'active',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: number, customer: any) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
    updateRelatedData('customer', id, customer);
  };

  const deleteCustomer = (id: number) => {
    // Check for related data before deletion
    const hasInvoices = invoices.some(inv => inv.customerId === id);
    const hasEstimates = estimates.some(est => est.customerId === id);
    const hasProjects = projects.some(proj => proj.customerId === id);
    
    if (hasInvoices || hasEstimates || hasProjects) {
      alert('Cannot delete customer with existing invoices, estimates, or projects');
      return false;
    }
    
    setCustomers(prev => prev.filter(c => c.id !== id));
    return true;
  };

  // Invoice CRUD with customer balance updates
  const addInvoice = (invoice: any) => {
    const newInvoice = { 
      ...invoice, 
      id: Date.now(), 
      invoiceNumber: getNextNumber('invoice'),
      status: 'draft',
      paidAmount: 0,
      currency: 'USD'
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
    if (invoice && invoice.status === 'paid') {
      alert('Cannot delete paid invoices');
      return false;
    }
    
    if (invoice) {
      // Update customer balance
      setCustomers(prev => prev.map(c => 
        c.id === invoice.customerId 
          ? { ...c, balance: c.balance - invoice.amount }
          : c
      ));
    }
    setInvoices(prev => prev.filter(i => i.id !== id));
    return true;
  };

  const sendInvoice = (id: number) => {
    setInvoices(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'sent', sentAt: new Date().toISOString() } : i
    ));
  };

  // Estimate CRUD with conversion functionality
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
    return true;
  };

  const sendEstimate = (id: number) => {
    setEstimates(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'sent', sentAt: new Date().toISOString() } : e
    ));
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
        description: estimate.description,
        notes: estimate.notes,
        terms: estimate.terms
      };
      addInvoice(newInvoice);
      updateEstimate(estimateId, { status: 'converted' });
    }
  };

  // Project CRUD with time tracking integration
  const addProject = (project: any) => {
    const newProject = { 
      ...project, 
      id: Date.now(), 
      code: project.code || getNextNumber('project'),
      actualCost: 0,
      hoursLogged: 0,
      progress: 0,
      isActive: true
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: number, project: any) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...project } : p));
    updateRelatedData('project', id, project);
  };

  const deleteProject = (id: number) => {
    const hasTimeEntries = timeEntries.some(entry => entry.projectId === id);
    if (hasTimeEntries) {
      alert('Cannot delete project with existing time entries');
      return false;
    }
    setProjects(prev => prev.filter(p => p.id !== id));
    return true;
  };

  // Time Entry CRUD with project cost updates
  const addTimeEntry = (entry: any) => {
    const newEntry = { ...entry, id: Date.now(), approved: false };
    setTimeEntries(prev => [...prev, newEntry]);
    
    // Update project costs and hours
    if (entry.projectId && entry.billable) {
      const cost = entry.hoursWorked * (entry.hourlyRate || 0);
      setProjects(prev => prev.map(p => 
        p.id === entry.projectId 
          ? { 
              ...p, 
              hoursLogged: p.hoursLogged + entry.hoursWorked,
              actualCost: p.actualCost + cost,
              progress: Math.min(((p.hoursLogged + entry.hoursWorked) / p.budgetedHours) * 100, 100)
            }
          : p
      ));
    }
  };

  const updateTimeEntry = (id: number, entry: any) => {
    setTimeEntries(prev => prev.map(e => e.id === id ? { ...e, ...entry } : e));
  };

  const deleteTimeEntry = (id: number) => {
    const entry = timeEntries.find(e => e.id === id);
    if (entry && entry.projectId && entry.billable) {
      const cost = entry.hoursWorked * (entry.hourlyRate || 0);
      setProjects(prev => prev.map(p => 
        p.id === entry.projectId 
          ? { 
              ...p, 
              hoursLogged: Math.max(0, p.hoursLogged - entry.hoursWorked),
              actualCost: Math.max(0, p.actualCost - cost)
            }
          : p
      ));
    }
    setTimeEntries(prev => prev.filter(e => e.id !== id));
    return true;
  };

  const approveTimeEntry = (id: number) => {
    setTimeEntries(prev => prev.map(e => 
      e.id === id ? { ...e, approved: true } : e
    ));
  };

  // Leave Request CRUD
  const addLeaveRequest = (request: any) => {
    const newRequest = { ...request, id: Date.now(), status: 'pending' };
    setLeaveRequests(prev => [...prev, newRequest]);
  };

  const updateLeaveRequest = (id: number, request: any) => {
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, ...request } : r));
  };

  const deleteLeaveRequest = (id: number) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== id));
    return true;
  };

  const approveLeaveRequest = (id: number) => {
    setLeaveRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'approved' } : r
    ));
  };

  const rejectLeaveRequest = (id: number) => {
    setLeaveRequests(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'rejected' } : r
    ));
  };

  // Reporting Functions
  const generateReport = (reportType: string, parameters: any) => {
    switch (reportType) {
      case 'profit_loss':
        const revenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
        const expenses = transactions.filter(t => t.debit > 0).reduce((sum, t) => sum + t.debit, 0);
        return { 
          revenue, 
          expenses, 
          netIncome: revenue - expenses,
          period: parameters.period || 'Current Period',
          generatedAt: new Date().toISOString()
        };
      
      case 'balance_sheet':
        const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0) + 
                           bankAccounts.reduce((sum, b) => sum + b.balance, 0);
        const totalLiabilities = vendors.reduce((sum, v) => sum + Math.abs(v.balance), 0);
        return { 
          totalAssets, 
          totalLiabilities, 
          equity: totalAssets - totalLiabilities,
          asOfDate: new Date().toISOString().split('T')[0]
        };
      
      case 'cash_flow':
        const inflows = cashFlowEntries.filter(e => e.type === 'inflow').reduce((sum, e) => sum + e.amount, 0);
        const outflows = cashFlowEntries.filter(e => e.type === 'outflow').reduce((sum, e) => sum + e.amount, 0);
        return { 
          inflows, 
          outflows, 
          netCashFlow: inflows - outflows,
          period: parameters.period || 'Current Period'
        };
      
      case 'ar_aging':
        const arAging = customers.map(customer => {
          const customerInvoices = invoices.filter(i => i.customerId === customer.id && i.status !== 'paid');
          const current = customerInvoices.filter(i => new Date(i.dueDate) >= new Date()).reduce((sum, i) => sum + i.amount, 0);
          const overdue30 = customerInvoices.filter(i => {
            const daysOverdue = Math.floor((new Date().getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            return daysOverdue > 0 && daysOverdue <= 30;
          }).reduce((sum, i) => sum + i.amount, 0);
          const overdue60 = customerInvoices.filter(i => {
            const daysOverdue = Math.floor((new Date().getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            return daysOverdue > 30 && daysOverdue <= 60;
          }).reduce((sum, i) => sum + i.amount, 0);
          const overdue90 = customerInvoices.filter(i => {
            const daysOverdue = Math.floor((new Date().getTime() - new Date(i.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            return daysOverdue > 60;
          }).reduce((sum, i) => sum + i.amount, 0);
          
          return {
            customer: customer.name,
            current,
            overdue30,
            overdue60,
            overdue90Plus: overdue90,
            total: current + overdue30 + overdue60 + overdue90
          };
        });
        return arAging;
      
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
      case 'projects':
        data = projects;
        filename = 'projects';
        break;
      case 'time_entries':
        data = timeEntries;
        filename = 'time_entries';
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
      alert(`${dataType} exported to Excel successfully!`);
    } else if (format === 'pdf') {
      console.log(`Exporting ${dataType} to PDF format`);
      alert(`${dataType} exported to PDF successfully!`);
    }
  };

  const downloadDocument = (type: string, id: number) => {
    switch (type) {
      case 'invoice':
        const invoice = invoices.find(i => i.id === id);
        if (invoice) {
          console.log('Generating invoice PDF:', invoice);
          alert(`Invoice ${invoice.invoiceNumber} downloaded successfully!`);
        }
        break;
      case 'estimate':
        const estimate = estimates.find(e => e.id === id);
        if (estimate) {
          console.log('Generating estimate PDF:', estimate);
          alert(`Estimate ${estimate.estimateNumber} downloaded successfully!`);
        }
        break;
      case 'payslip':
        console.log('Generating payslip PDF for ID:', id);
        alert('Payslip downloaded successfully!');
        break;
      case 'tax_return':
        const taxReturn = taxReturns.find(t => t.id === id);
        if (taxReturn) {
          console.log('Generating tax return PDF:', taxReturn);
          alert(`Tax return for ${taxReturn.period} downloaded successfully!`);
        }
        break;
      default:
        alert('Document downloaded successfully!');
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).filter(key => typeof data[0][key] !== 'object').join(',');
    const rows = data.map(item => 
      Object.entries(item)
        .filter(([key, value]) => typeof value !== 'object')
        .map(([key, value]) => 
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

  // Initialize other arrays with realistic data
  const [items, setItems] = useState([
    {
      id: 1,
      sku: 'LAPTOP-001',
      name: 'Business Laptop Pro',
      description: 'High-performance laptop for business use',
      type: 'inventory',
      category: 'Electronics',
      unitOfMeasure: 'Each',
      quantityOnHand: 25,
      reorderLevel: 10,
      reorderQuantity: 50,
      costPrice: 899.00,
      sellingPrice: 1299.00,
      taxRate: 10.0,
      totalValue: 22475.00,
      status: 'in_stock',
      lastUpdated: '2025-01-15',
      trackInventory: true,
      serialTracking: false,
      batchTracking: false,
      isActive: true
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 1,
      poNumber: 'PO-001',
      vendorId: 1,
      vendor: 'Office Supplies Co.',
      orderDate: '2025-01-10',
      deliveryDate: '2025-01-25',
      status: 'approved',
      priority: 'high',
      subtotal: 2500.00,
      taxAmount: 250.00,
      total: 2750.00,
      items: [
        { product: 'Office Chairs', quantity: 10, unitPrice: 150.00, amount: 1500.00 },
        { product: 'Desk Supplies', quantity: 20, unitPrice: 50.00, amount: 1000.00 }
      ],
      approvedBy: 'John Smith',
      requestedBy: 'Jane Doe',
      department: 'Administration'
    }
  ]);

  const [accounts, setAccounts] = useState([
    { id: 1, code: '1000', name: 'Cash and Cash Equivalents', type: 'Asset', balance: 125450.00, isActive: true },
    { id: 2, code: '1200', name: 'Accounts Receivable', type: 'Asset', balance: 23840.00, isActive: true },
    { id: 3, code: '1500', name: 'Inventory', type: 'Asset', balance: 45600.00, isActive: true },
    { id: 4, code: '2000', name: 'Accounts Payable', type: 'Liability', balance: -18500.00, isActive: true },
    { id: 5, code: '3000', name: 'Owner\'s Equity', type: 'Equity', balance: 100000.00, isActive: true },
    { id: 6, code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 180500.00, isActive: true },
    { id: 7, code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: -75200.00, isActive: true },
    { id: 8, code: '6000', name: 'Operating Expenses', type: 'Expense', balance: -28400.00, isActive: true }
  ]);

  const [journalEntries, setJournalEntries] = useState([
    {
      id: 1,
      date: '2025-01-15',
      reference: 'JE-001',
      description: 'Sales Invoice #1001 - Acme Corp',
      totalDebit: 5250.00,
      totalCredit: 5250.00,
      status: 'posted',
      lines: [
        { accountId: 2, accountCode: '1200', accountName: 'Accounts Receivable', debit: 5250.00, credit: 0 },
        { accountId: 6, accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 5250.00 }
      ],
      createdBy: 'System',
      approvedBy: 'John Smith'
    }
  ]);

  const [salesOrders, setSalesOrders] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  const value: DataContextType = {
    // Data
    customers, vendors, employees, items, invoices, estimates, purchaseOrders,
    projects, bankAccounts, transactions, assets, accounts, journalEntries,
    taxReturns, budgets, cashFlowEntries, users, roles, payrollRuns, timeEntries,
    leaveRequests, maintenanceRecords, salesOrders, workOrders,
    
    // Customer CRUD
    addCustomer, updateCustomer, deleteCustomer,
    
    // Vendor CRUD
    addVendor: (vendor: any) => {
      const newVendor = { ...vendor, id: Date.now(), balance: 0, status: 'active', isActive: true };
      setVendors(prev => [...prev, newVendor]);
    },
    updateVendor: (id: number, vendor: any) => {
      setVendors(prev => prev.map(v => v.id === id ? { ...v, ...vendor } : v));
    },
    deleteVendor: (id: number) => {
      const hasPOs = purchaseOrders.some(po => po.vendorId === id);
      if (hasPOs) {
        alert('Cannot delete vendor with existing purchase orders');
        return false;
      }
      setVendors(prev => prev.filter(v => v.id !== id));
      return true;
    },
    
    // Employee CRUD
    addEmployee: (employee: any) => {
      const newEmployee = { 
        ...employee, 
        id: Date.now(), 
        employeeNumber: getNextNumber('employee'),
        status: 'active',
        ytdGross: 0,
        ytdDeductions: 0,
        ytdNet: 0
      };
      setEmployees(prev => [...prev, newEmployee]);
      updateRelatedData('employee', newEmployee.id, employee);
    },
    updateEmployee: (id: number, employee: any) => {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...employee } : e));
      updateRelatedData('employee', id, employee);
    },
    deleteEmployee: (id: number) => {
      const hasTimeEntries = timeEntries.some(entry => entry.employeeId === id);
      const hasLeaveRequests = leaveRequests.some(leave => leave.employeeId === id);
      if (hasTimeEntries || hasLeaveRequests) {
        alert('Cannot delete employee with existing time entries or leave requests');
        return false;
      }
      setEmployees(prev => prev.filter(e => e.id !== id));
      return true;
    },
    
    // Invoice CRUD
    addInvoice, updateInvoice, deleteInvoice, sendInvoice,
    
    // Estimate CRUD
    addEstimate, updateEstimate, deleteEstimate, sendEstimate, convertEstimateToInvoice,
    
    // Purchase Order CRUD
    addPurchaseOrder: (po: any) => {
      const newPO = { 
        ...po, 
        id: Date.now(), 
        poNumber: getNextNumber('purchaseOrder'),
        status: 'pending_approval'
      };
      setPurchaseOrders(prev => [...prev, newPO]);
    },
    updatePurchaseOrder: (id: number, po: any) => {
      setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, ...po } : p));
    },
    deletePurchaseOrder: (id: number) => {
      const po = purchaseOrders.find(p => p.id === id);
      if (po && po.status === 'received') {
        alert('Cannot delete received purchase orders');
        return false;
      }
      setPurchaseOrders(prev => prev.filter(p => p.id !== id));
      return true;
    },
    approvePurchaseOrder: (id: number) => {
      setPurchaseOrders(prev => prev.map(po => 
        po.id === id ? { ...po, status: 'approved', approvedAt: new Date().toISOString() } : po
      ));
    },
    
    // Project CRUD
    addProject, updateProject, deleteProject,
    
    // Bank Account CRUD
    addBankAccount: (account: any) => {
      const newAccount = { ...account, id: Date.now(), isActive: true };
      setBankAccounts(prev => [...prev, newAccount]);
    },
    updateBankAccount: (id: number, account: any) => {
      setBankAccounts(prev => prev.map(a => a.id === id ? { ...a, ...account } : a));
    },
    deleteBankAccount: (id: number) => {
      const hasTransactions = transactions.some(t => t.bankAccountId === id);
      if (hasTransactions) {
        alert('Cannot delete bank account with existing transactions');
        return false;
      }
      setBankAccounts(prev => prev.filter(a => a.id !== id));
      return true;
    },
    
    // Transaction CRUD
    addTransaction: (transaction: any) => {
      const newTransaction = { 
        ...transaction, 
        id: Date.now(),
        status: 'cleared',
        balance: 0 // Will be calculated
      };
      
      // Calculate new balance
      const account = bankAccounts.find(a => a.id === transaction.bankAccountId);
      if (account) {
        const newBalance = account.balance + (transaction.credit || 0) - (transaction.debit || 0);
        newTransaction.balance = newBalance;
        
        // Update bank account balance
        setBankAccounts(prev => prev.map(acc => 
          acc.id === transaction.bankAccountId 
            ? { ...acc, balance: newBalance }
            : acc
        ));
      }
      
      setTransactions(prev => [...prev, newTransaction]);
      
      // Create corresponding journal entry
      const journalLines = [];
      if (transaction.debit > 0) {
        journalLines.push({
          accountId: 8, // Operating Expenses
          accountCode: '6000',
          accountName: 'Operating Expenses',
          debit: transaction.debit,
          credit: 0
        });
        journalLines.push({
          accountId: 1, // Cash
          accountCode: '1000',
          accountName: 'Cash and Cash Equivalents',
          debit: 0,
          credit: transaction.debit
        });
      } else {
        journalLines.push({
          accountId: 1, // Cash
          accountCode: '1000',
          accountName: 'Cash and Cash Equivalents',
          debit: transaction.credit,
          credit: 0
        });
        journalLines.push({
          accountId: 6, // Revenue
          accountCode: '4000',
          accountName: 'Sales Revenue',
          debit: 0,
          credit: transaction.credit
        });
      }
      
      const journalEntry = {
        id: Date.now(),
        date: transaction.date,
        reference: `JE-${journalEntries.length + 1}`,
        description: transaction.description,
        totalDebit: transaction.debit || transaction.credit,
        totalCredit: transaction.debit || transaction.credit,
        status: 'posted',
        lines: journalLines,
        createdBy: 'System'
      };
      
      setJournalEntries(prev => [...prev, journalEntry]);
    },
    updateTransaction: (id: number, transaction: any) => {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...transaction } : t));
    },
    deleteTransaction: (id: number) => {
      setTransactions(prev => prev.filter(t => t.id !== id));
      return true;
    },
    
    // Asset CRUD
    addAsset: (asset: any) => {
      const newAsset = { 
        ...asset, 
        id: Date.now(), 
        assetNumber: asset.assetNumber || getNextNumber('asset'),
        status: 'active'
      };
      setAssets(prev => [...prev, newAsset]);
    },
    updateAsset: (id: number, asset: any) => {
      setAssets(prev => prev.map(a => a.id === id ? { ...a, ...asset } : a));
    },
    deleteAsset: (id: number) => {
      setAssets(prev => prev.filter(a => a.id !== id));
      return true;
    },
    
    // Budget CRUD
    addBudget: (budget: any) => {
      const newBudget = { ...budget, id: Date.now(), status: 'draft' };
      setBudgets(prev => [...prev, newBudget]);
    },
    updateBudget: (id: number, budget: any) => {
      setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...budget } : b));
    },
    deleteBudget: (id: number) => {
      setBudgets(prev => prev.filter(b => b.id !== id));
      return true;
    },
    
    // Cash Flow CRUD
    addCashFlowEntry: (entry: any) => {
      const newEntry = { ...entry, id: Date.now() };
      setCashFlowEntries(prev => [...prev, newEntry]);
    },
    updateCashFlowEntry: (id: number, entry: any) => {
      setCashFlowEntries(prev => prev.map(e => e.id === id ? { ...e, ...entry } : e));
    },
    deleteCashFlowEntry: (id: number) => {
      setCashFlowEntries(prev => prev.filter(e => e.id !== id));
      return true;
    },
    
    // Tax Return CRUD
    addTaxReturn: (taxReturn: any) => {
      const newReturn = { ...taxReturn, id: Date.now(), status: 'draft' };
      setTaxReturns(prev => [...prev, newReturn]);
    },
    updateTaxReturn: (id: number, taxReturn: any) => {
      setTaxReturns(prev => prev.map(t => t.id === id ? { ...t, ...taxReturn } : t));
    },
    deleteTaxReturn: (id: number) => {
      const taxReturn = taxReturns.find(t => t.id === id);
      if (taxReturn && taxReturn.status === 'filed') {
        alert('Cannot delete filed tax returns');
        return false;
      }
      setTaxReturns(prev => prev.filter(t => t.id !== id));
      return true;
    },
    fileTaxReturn: (id: number) => {
      setTaxReturns(prev => prev.map(t => 
        t.id === id ? { ...t, status: 'filed', filedDate: new Date().toISOString().split('T')[0] } : t
      ));
    },
    
    // User CRUD
    addUser: (user: any) => {
      const newUser = { 
        ...user, 
        id: Date.now(), 
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
        avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=2563eb&color=ffffff`
      };
      setUsers(prev => [...prev, newUser]);
    },
    updateUser: (id: number, user: any) => {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
    },
    deleteUser: (id: number) => {
      setUsers(prev => prev.filter(u => u.id !== id));
      return true;
    },
    
    // Role CRUD
    addRole: (role: any) => {
      const newRole = { ...role, id: Date.now(), userCount: 0, isSystemRole: false, isActive: true };
      setRoles(prev => [...prev, newRole]);
    },
    updateRole: (id: number, role: any) => {
      setRoles(prev => prev.map(r => r.id === id ? { ...r, ...role } : r));
    },
    deleteRole: (id: number) => {
      setRoles(prev => prev.filter(r => r.id !== id));
      return true;
    },
    
    // Payroll CRUD
    addPayrollRun: (payroll: any) => {
      const newPayroll = { ...payroll, id: Date.now(), status: 'draft' };
      setPayrollRuns(prev => [...prev, newPayroll]);
    },
    updatePayrollRun: (id: number, payroll: any) => {
      setPayrollRuns(prev => prev.map(p => p.id === id ? { ...p, ...payroll } : p));
    },
    deletePayrollRun: (id: number) => {
      const payroll = payrollRuns.find(p => p.id === id);
      if (payroll && payroll.status === 'paid') {
        alert('Cannot delete paid payroll runs');
        return false;
      }
      setPayrollRuns(prev => prev.filter(p => p.id !== id));
      return true;
    },
    processPayroll: (id: number) => {
      setPayrollRuns(prev => prev.map(p => 
        p.id === id ? { ...p, status: 'processed' } : p
      ));
    },
    
    // Time Entry CRUD
    addTimeEntry, updateTimeEntry, deleteTimeEntry, approveTimeEntry,
    
    // Leave Request CRUD
    addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, approveLeaveRequest, rejectLeaveRequest,
    
    // Item CRUD
    addItem: (item: any) => {
      const newItem = { 
        ...item, 
        id: Date.now(), 
        status: 'in_stock',
        totalValue: item.quantityOnHand * item.costPrice,
        isActive: true,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [...prev, newItem]);
    },
    updateItem: (id: number, item: any) => {
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
    },
    deleteItem: (id: number) => {
      setItems(prev => prev.filter(i => i.id !== id));
      return true;
    },
    
    // Utility Functions
    getNextNumber, calculateTotals, updateRelatedData, generateReport, exportData, downloadDocument
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}