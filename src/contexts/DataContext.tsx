import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataContextType {
  // Customer Data
  customers: any[];
  addCustomer: (customer: any) => void;
  updateCustomer: (id: number, customer: any) => void;
  deleteCustomer: (id: number) => void;
  
  // Vendor Data
  vendors: any[];
  addVendor: (vendor: any) => void;
  updateVendor: (id: number, vendor: any) => void;
  deleteVendor: (id: number) => void;
  
  // Invoice Data
  invoices: any[];
  addInvoice: (invoice: any) => void;
  updateInvoice: (id: number, invoice: any) => void;
  deleteInvoice: (id: number) => void;
  sendInvoice: (id: number) => void;
  
  // Estimate Data
  estimates: any[];
  addEstimate: (estimate: any) => void;
  updateEstimate: (id: number, estimate: any) => void;
  deleteEstimate: (id: number) => void;
  sendEstimate: (id: number) => void;
  convertEstimateToInvoice: (id: number) => void;
  
  // Accounting Data
  accounts: any[];
  journalEntries: any[];
  addAccount: (account: any) => void;
  updateAccount: (id: number, account: any) => void;
  deleteAccount: (id: number) => void;
  addJournalEntry: (entry: any) => void;
  updateJournalEntry: (id: number, entry: any) => void;
  deleteJournalEntry: (id: number) => void;
  postJournalEntry: (id: number) => void;
  reverseJournalEntry: (id: number) => void;
  
  // Employee Data
  employees: any[];
  addEmployee: (employee: any) => void;
  updateEmployee: (id: number, employee: any) => void;
  deleteEmployee: (id: number) => void;
  
  // Project Data
  projects: any[];
  addProject: (project: any) => void;
  updateProject: (id: number, project: any) => void;
  deleteProject: (id: number) => void;
  
  // Inventory Data
  inventoryItems: any[];
  addInventoryItem: (item: any) => void;
  updateInventoryItem: (id: number, item: any) => void;
  deleteInventoryItem: (id: number) => void;
  adjustInventory: (id: number, adjustment: any) => void;
  
  // Payroll Data
  payrollRuns: any[];
  addPayrollRun: (payroll: any) => void;
  updatePayrollRun: (id: number, payroll: any) => void;
  deletePayrollRun: (id: number) => void;
  processPayroll: (id: number) => void;
  
  // Tax Data
  taxReturns: any[];
  addTaxReturn: (taxReturn: any) => void;
  updateTaxReturn: (id: number, taxReturn: any) => void;
  deleteTaxReturn: (id: number) => void;
  fileTaxReturn: (id: number) => void;
  
  // Budget Data
  budgets: any[];
  addBudget: (budget: any) => void;
  updateBudget: (id: number, budget: any) => void;
  deleteBudget: (id: number) => void;
  
  // Cash Flow Data
  cashFlowEntries: any[];
  addCashFlowEntry: (entry: any) => void;
  updateCashFlowEntry: (id: number, entry: any) => void;
  deleteCashFlowEntry: (id: number) => void;
  
  // Report Generation
  generateReport: (reportType: string, parameters: any) => any;
  exportData: (type: string, format: string) => void;
  downloadDocument: (type: string, id: number) => void;
  
  // Financial Calculations
  calculateFinancialSummary: () => any;
  getAccountBalance: (accountId: number) => number;
  updateAccountBalances: () => void;
  calculateVATReturn: (period: string) => any;
  calculatePayeTax: (grossSalary: number) => number;
  calculateNSSF: (grossSalary: number) => number;
  calculateNHIF: (grossSalary: number) => number;
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
  // Kenyan-specific initial data with realistic business scenarios
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Safaricom PLC',
      email: 'procurement@safaricom.co.ke',
      phone: '+254 722 000 000',
      address: 'Safaricom House, Waiyaki Way, Nairobi',
      balance: 125000.00,
      status: 'active',
      creditLimit: 500000.00,
      paymentTerms: 30,
      taxNumber: 'P051000853M',
      currency: 'KES',
      lastTransaction: '2025-01-15',
      pinNumber: 'P051000853M',
      vatNumber: 'VAT051000853M'
    },
    {
      id: 2,
      name: 'Equity Bank Kenya',
      email: 'corporate@equitybank.co.ke',
      phone: '+254 763 000 000',
      address: 'Equity Centre, Upper Hill, Nairobi',
      balance: 89500.00,
      status: 'active',
      creditLimit: 300000.00,
      paymentTerms: 15,
      taxNumber: 'P051234567K',
      currency: 'KES',
      lastTransaction: '2025-01-14',
      pinNumber: 'P051234567K',
      vatNumber: 'VAT051234567K'
    },
    {
      id: 3,
      name: 'Kenya Airways',
      email: 'finance@kenya-airways.com',
      phone: '+254 711 024 747',
      address: 'Airport North Road, Embakasi, Nairobi',
      balance: 245000.00,
      status: 'active',
      creditLimit: 1000000.00,
      paymentTerms: 45,
      taxNumber: 'P051987654L',
      currency: 'KES',
      lastTransaction: '2025-01-13',
      pinNumber: 'P051987654L',
      vatNumber: 'VAT051987654L'
    }
  ]);

  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Kenya Power & Lighting Co.',
      email: 'billing@kplc.co.ke',
      phone: '+254 711 000 000',
      address: 'Stima Plaza, Kolobot Road, Nairobi',
      balance: -45000.00,
      status: 'active',
      paymentTerms: 30,
      taxNumber: 'P051987654L',
      currency: 'KES',
      lastTransaction: '2025-01-14',
      pinNumber: 'P051987654L',
      vatNumber: 'VAT051987654L'
    },
    {
      id: 2,
      name: 'Nairobi Water & Sewerage Co.',
      email: 'accounts@nairobiwater.co.ke',
      phone: '+254 020 000 000',
      address: 'Kampala Road, Nairobi',
      balance: -12500.00,
      status: 'active',
      paymentTerms: 15,
      taxNumber: 'P051456789N',
      currency: 'KES',
      lastTransaction: '2025-01-13',
      pinNumber: 'P051456789N',
      vatNumber: 'VAT051456789N'
    },
    {
      id: 3,
      name: 'Simba Corp Kenya Ltd',
      email: 'suppliers@simbacorp.com',
      phone: '+254 722 456 789',
      address: 'Industrial Area, Nairobi',
      balance: -85000.00,
      status: 'active',
      paymentTerms: 30,
      taxNumber: 'P051789123S',
      currency: 'KES',
      lastTransaction: '2025-01-12',
      pinNumber: 'P051789123S',
      vatNumber: 'VAT051789123S'
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-001',
      customerId: 1,
      customerName: 'Safaricom PLC',
      issueDate: new Date('2025-01-10'),
      dueDate: new Date('2025-02-09'),
      status: 'sent',
      subtotal: 125000.00,
      taxAmount: 20000.00, // 16% VAT
      total: 145000.00,
      paidAmount: 0,
      currency: 'KES',
      lines: [
        { id: '1', description: 'Software Development Services', quantity: 100, unitPrice: 1250.00, discount: 0, taxRate: 16, amount: 125000.00 }
      ],
      notes: 'Payment due within 30 days',
      terms: 'Standard payment terms apply',
      sentAt: new Date('2025-01-10'),
      createdBy: 'John Doe'
    },
    {
      id: 2,
      invoiceNumber: 'INV-002',
      customerId: 2,
      customerName: 'Equity Bank Kenya',
      issueDate: new Date('2025-01-12'),
      dueDate: new Date('2025-01-27'),
      status: 'paid',
      subtotal: 89500.00,
      taxAmount: 14320.00,
      total: 103820.00,
      paidAmount: 103820.00,
      currency: 'KES',
      lines: [
        { id: '2', description: 'Banking System Integration', quantity: 1, unitPrice: 89500.00, discount: 0, taxRate: 16, amount: 89500.00 }
      ],
      notes: 'Thank you for your business',
      terms: 'Payment within 15 days',
      sentAt: new Date('2025-01-12'),
      paidAt: new Date('2025-01-25'),
      createdBy: 'Jane Smith'
    }
  ]);

  const [estimates, setEstimates] = useState([
    {
      id: 1,
      estimateNumber: 'EST-001',
      customer: 'Kenya Airways',
      issueDate: '2025-01-12',
      expiryDate: '2025-02-11',
      status: 'sent',
      subtotal: 245000.00,
      taxAmount: 39200.00,
      total: 284200.00,
      description: 'Flight booking system development',
      items: [
        { description: 'System Development', quantity: 1, unitPrice: 245000.00, amount: 245000.00 }
      ],
      notes: 'This estimate includes full system development and testing.',
      terms: 'Payment in 3 milestones: 40%, 40%, 20%.',
      validityDays: 30
    }
  ]);

  // Kenyan Chart of Accounts following IFRS standards
  const [accounts, setAccounts] = useState([
    // ASSETS (1000-1999)
    { id: 1, code: '1000', name: 'Cash at Bank - KCB', type: 'Asset', subType: 'Current Asset', balance: 2500000.00, isActive: true, description: 'Main operating account' },
    { id: 2, code: '1001', name: 'Cash at Bank - Equity Bank', type: 'Asset', subType: 'Current Asset', balance: 850000.00, isActive: true, description: 'Secondary operating account' },
    { id: 3, code: '1010', name: 'Petty Cash', type: 'Asset', subType: 'Current Asset', balance: 25000.00, isActive: true, description: 'Office petty cash' },
    { id: 4, code: '1100', name: 'Accounts Receivable - Trade', type: 'Asset', subType: 'Current Asset', balance: 459320.00, isActive: true, description: 'Customer receivables' },
    { id: 5, code: '1110', name: 'Accounts Receivable - Staff', type: 'Asset', subType: 'Current Asset', balance: 15000.00, isActive: true, description: 'Staff advances' },
    { id: 6, code: '1200', name: 'Inventory - Raw Materials', type: 'Asset', subType: 'Current Asset', balance: 450000.00, isActive: true, description: 'Raw materials stock' },
    { id: 7, code: '1210', name: 'Inventory - Finished Goods', type: 'Asset', subType: 'Current Asset', balance: 320000.00, isActive: true, description: 'Finished products' },
    { id: 8, code: '1300', name: 'Prepaid Expenses', type: 'Asset', subType: 'Current Asset', balance: 75000.00, isActive: true, description: 'Prepaid rent, insurance' },
    { id: 9, code: '1310', name: 'VAT Input (Recoverable)', type: 'Asset', subType: 'Current Asset', balance: 128000.00, isActive: true, description: 'VAT paid on purchases' },
    { id: 10, code: '1400', name: 'Computer Equipment', type: 'Asset', subType: 'Fixed Asset', balance: 850000.00, isActive: true, description: 'Computers and IT equipment' },
    { id: 11, code: '1410', name: 'Office Furniture & Fittings', type: 'Asset', subType: 'Fixed Asset', balance: 320000.00, isActive: true, description: 'Office furniture' },
    { id: 12, code: '1420', name: 'Motor Vehicles', type: 'Asset', subType: 'Fixed Asset', balance: 1200000.00, isActive: true, description: 'Company vehicles' },
    { id: 13, code: '1430', name: 'Buildings', type: 'Asset', subType: 'Fixed Asset', balance: 5000000.00, isActive: true, description: 'Office buildings' },
    { id: 14, code: '1500', name: 'Accumulated Depreciation - Equipment', type: 'Asset', subType: 'Fixed Asset', balance: -425000.00, isActive: true, description: 'Depreciation on equipment' },
    { id: 15, code: '1510', name: 'Accumulated Depreciation - Vehicles', type: 'Asset', subType: 'Fixed Asset', balance: -480000.00, isActive: true, description: 'Depreciation on vehicles' },
    
    // LIABILITIES (2000-2999)
    { id: 16, code: '2000', name: 'Accounts Payable - Trade', type: 'Liability', subType: 'Current Liability', balance: -142500.00, isActive: true, description: 'Supplier payables' },
    { id: 17, code: '2100', name: 'VAT Output (Payable)', type: 'Liability', subType: 'Current Liability', balance: -59200.00, isActive: true, description: 'VAT collected on sales' },
    { id: 18, code: '2110', name: 'Withholding VAT Payable', type: 'Liability', subType: 'Current Liability', balance: -18500.00, isActive: true, description: 'Withholding VAT on services' },
    { id: 19, code: '2200', name: 'PAYE Payable', type: 'Liability', subType: 'Current Liability', balance: -125000.00, isActive: true, description: 'Employee income tax' },
    { id: 20, code: '2210', name: 'NSSF Payable', type: 'Liability', subType: 'Current Liability', balance: -36000.00, isActive: true, description: 'Social security contributions' },
    { id: 21, code: '2220', name: 'NHIF Payable', type: 'Liability', subType: 'Current Liability', balance: -24000.00, isActive: true, description: 'Health insurance contributions' },
    { id: 22, code: '2230', name: 'Withholding Tax Payable', type: 'Liability', subType: 'Current Liability', balance: -45000.00, isActive: true, description: 'Withholding tax on services' },
    { id: 23, code: '2300', name: 'Accrued Expenses', type: 'Liability', subType: 'Current Liability', balance: -65000.00, isActive: true, description: 'Accrued utilities, rent' },
    { id: 24, code: '2400', name: 'Bank Loan - KCB', type: 'Liability', subType: 'Long-term Liability', balance: -2500000.00, isActive: true, description: 'Term loan from KCB' },
    { id: 25, code: '2410', name: 'Hire Purchase Liability', type: 'Liability', subType: 'Long-term Liability', balance: -450000.00, isActive: true, description: 'Vehicle hire purchase' },
    
    // EQUITY (3000-3999)
    { id: 26, code: '3000', name: 'Share Capital', type: 'Equity', subType: 'Capital', balance: 1000000.00, isActive: true, description: 'Issued share capital' },
    { id: 27, code: '3100', name: 'Retained Earnings', type: 'Equity', subType: 'Retained Earnings', balance: 2850000.00, isActive: true, description: 'Accumulated profits' },
    { id: 28, code: '3200', name: 'Current Year Earnings', type: 'Equity', subType: 'Current Earnings', balance: 1245000.00, isActive: true, description: 'Current year profit/loss' },
    
    // REVENUE (4000-4999)
    { id: 29, code: '4000', name: 'Sales Revenue - Software Services', type: 'Revenue', subType: 'Operating Revenue', balance: 3250000.00, isActive: true, description: 'Software development revenue' },
    { id: 30, code: '4100', name: 'Sales Revenue - Consulting', type: 'Revenue', subType: 'Operating Revenue', balance: 1800000.00, isActive: true, description: 'Consulting services revenue' },
    { id: 31, code: '4200', name: 'Sales Revenue - Training', type: 'Revenue', subType: 'Operating Revenue', balance: 650000.00, isActive: true, description: 'Training services revenue' },
    { id: 32, code: '4300', name: 'Interest Income', type: 'Revenue', subType: 'Other Revenue', balance: 45000.00, isActive: true, description: 'Bank interest earned' },
    { id: 33, code: '4400', name: 'Foreign Exchange Gains', type: 'Revenue', subType: 'Other Revenue', balance: 25000.00, isActive: true, description: 'FX gains' },
    
    // EXPENSES (5000-6999)
    { id: 34, code: '5000', name: 'Cost of Sales - Direct Labor', type: 'Expense', subType: 'Cost of Sales', balance: 1625000.00, isActive: true, description: 'Direct project costs' },
    { id: 35, code: '5100', name: 'Cost of Sales - Materials', type: 'Expense', subType: 'Cost of Sales', balance: 485000.00, isActive: true, description: 'Direct materials' },
    { id: 36, code: '6000', name: 'Salaries and Wages', type: 'Expense', subType: 'Operating Expense', balance: 2400000.00, isActive: true, description: 'Employee salaries' },
    { id: 37, code: '6010', name: 'PAYE Tax Expense', type: 'Expense', subType: 'Operating Expense', balance: 360000.00, isActive: true, description: 'Employee income tax' },
    { id: 38, code: '6020', name: 'NSSF Contributions', type: 'Expense', subType: 'Operating Expense', balance: 144000.00, isActive: true, description: 'Employer NSSF contributions' },
    { id: 39, code: '6030', name: 'NHIF Contributions', type: 'Expense', subType: 'Operating Expense', balance: 96000.00, isActive: true, description: 'Employer NHIF contributions' },
    { id: 40, code: '6100', name: 'Rent Expense', type: 'Expense', subType: 'Operating Expense', balance: 480000.00, isActive: true, description: 'Office rent' },
    { id: 41, code: '6110', name: 'Utilities - Electricity', type: 'Expense', subType: 'Operating Expense', balance: 180000.00, isActive: true, description: 'Electricity bills' },
    { id: 42, code: '6120', name: 'Utilities - Water', type: 'Expense', subType: 'Operating Expense', balance: 45000.00, isActive: true, description: 'Water bills' },
    { id: 43, code: '6200', name: 'Professional Fees', type: 'Expense', subType: 'Operating Expense', balance: 180000.00, isActive: true, description: 'Legal and audit fees' },
    { id: 44, code: '6300', name: 'Marketing & Advertising', type: 'Expense', subType: 'Operating Expense', balance: 125000.00, isActive: true, description: 'Marketing expenses' },
    { id: 45, code: '6400', name: 'Travel & Entertainment', type: 'Expense', subType: 'Operating Expense', balance: 95000.00, isActive: true, description: 'Business travel' },
    { id: 46, code: '6500', name: 'Depreciation Expense', type: 'Expense', subType: 'Operating Expense', balance: 285000.00, isActive: true, description: 'Asset depreciation' },
    { id: 47, code: '6600', name: 'Bank Charges', type: 'Expense', subType: 'Operating Expense', balance: 35000.00, isActive: true, description: 'Banking fees' },
    { id: 48, code: '6700', name: 'Insurance Expense', type: 'Expense', subType: 'Operating Expense', balance: 120000.00, isActive: true, description: 'Business insurance' }
  ]);

  const [journalEntries, setJournalEntries] = useState([
    {
      id: 1,
      date: new Date('2025-01-15'),
      reference: 'JE-001',
      description: 'Sales Invoice - Safaricom PLC',
      totalDebit: 145000.00,
      totalCredit: 145000.00,
      status: 'posted',
      createdBy: 'John Doe',
      approvedBy: 'Jane Smith',
      lines: [
        { id: '1', accountId: 4, accountCode: '1100', accountName: 'Accounts Receivable - Trade', debit: 145000.00, credit: 0, description: 'Invoice INV-001' },
        { id: '2', accountId: 29, accountCode: '4000', accountName: 'Sales Revenue - Software Services', debit: 0, credit: 125000.00, description: 'Software services revenue' },
        { id: '3', accountId: 17, accountCode: '2100', accountName: 'VAT Output (Payable)', debit: 0, credit: 20000.00, description: '16% VAT on sales' }
      ]
    },
    {
      id: 2,
      date: new Date('2025-01-14'),
      reference: 'JE-002',
      description: 'Utility Payment - KPLC',
      totalDebit: 58000.00,
      totalCredit: 58000.00,
      status: 'posted',
      createdBy: 'Bob Johnson',
      approvedBy: 'Jane Smith',
      lines: [
        { id: '4', accountId: 41, accountCode: '6110', accountName: 'Utilities - Electricity', debit: 50000.00, credit: 0, description: 'Monthly electricity bill' },
        { id: '5', accountId: 9, accountCode: '1310', accountName: 'VAT Input (Recoverable)', debit: 8000.00, credit: 0, description: '16% VAT on utilities' },
        { id: '6', accountId: 1, accountCode: '1000', accountName: 'Cash at Bank - KCB', debit: 0, credit: 58000.00, description: 'Payment to KPLC' }
      ]
    }
  ]);

  const [employees, setEmployees] = useState([
    {
      id: 1,
      employeeNumber: 'EMP-001',
      firstName: 'John',
      lastName: 'Kamau',
      email: 'john.kamau@company.co.ke',
      phone: '+254 722 123 456',
      position: 'Software Engineer',
      department: 'IT',
      salary: 120000.00, // Monthly salary in KES
      payFrequency: 'monthly',
      hireDate: '2023-01-15',
      status: 'active',
      kraPin: 'A123456789Z',
      nssfNumber: 'NSSF123456',
      nhifNumber: 'NHIF789012',
      bankAccount: {
        accountNumber: '1234567890',
        bankName: 'Equity Bank',
        branch: 'Upper Hill'
      },
      address: 'Kileleshwa, Nairobi',
      idNumber: '12345678',
      emergencyContact: {
        name: 'Mary Kamau',
        relationship: 'Spouse',
        phone: '+254 722 987 654'
      },
      ytdGross: 1440000.00,
      ytdPaye: 216000.00,
      ytdNssf: 14400.00,
      ytdNhif: 19200.00,
      ytdNet: 1190400.00
    },
    {
      id: 2,
      employeeNumber: 'EMP-002',
      firstName: 'Grace',
      lastName: 'Wanjiku',
      email: 'grace.wanjiku@company.co.ke',
      phone: '+254 733 456 789',
      position: 'Accountant',
      department: 'Finance',
      salary: 95000.00,
      payFrequency: 'monthly',
      hireDate: '2022-08-20',
      status: 'active',
      kraPin: 'A987654321Y',
      nssfNumber: 'NSSF654321',
      nhifNumber: 'NHIF210987',
      bankAccount: {
        accountNumber: '9876543210',
        bankName: 'KCB Bank',
        branch: 'Westlands'
      },
      address: 'Westlands, Nairobi',
      idNumber: '87654321',
      emergencyContact: {
        name: 'Peter Wanjiku',
        relationship: 'Brother',
        phone: '+254 733 123 456'
      },
      ytdGross: 1140000.00,
      ytdPaye: 142500.00,
      ytdNssf: 11400.00,
      ytdNhif: 15200.00,
      ytdNet: 970900.00
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
      employeeCount: 2,
      totalGross: 215000.00,
      totalPaye: 29875.00,
      totalNssf: 2150.00,
      totalNhif: 2867.00,
      totalNet: 180108.00,
      entries: [
        { 
          employeeId: 1, 
          employeeName: 'John Kamau', 
          grossPay: 120000.00, 
          paye: 16500.00,
          nssf: 1200.00,
          nhif: 1600.00,
          netPay: 100700.00,
          hoursWorked: 176,
          overtimeHours: 8
        },
        { 
          employeeId: 2, 
          employeeName: 'Grace Wanjiku', 
          grossPay: 95000.00, 
          paye: 13375.00,
          nssf: 950.00,
          nhif: 1267.00,
          netPay: 79408.00,
          hoursWorked: 176,
          overtimeHours: 0
        }
      ]
    }
  ]);

  const [taxReturns, setTaxReturns] = useState([
    {
      id: 1,
      returnType: 'VAT Return',
      period: 'January 2025',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      dueDate: '2025-02-20',
      status: 'draft',
      totalSales: 5700000.00,
      totalPurchases: 2110000.00,
      vatOnSales: 912000.00,
      vatOnPurchases: 337600.00,
      netVat: 574400.00,
      withholdingVat: 18500.00,
      vatPayable: 555900.00
    },
    {
      id: 2,
      returnType: 'PAYE Return',
      period: 'January 2025',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      dueDate: '2025-02-09',
      status: 'filed',
      totalPayroll: 3000000.00,
      totalPaye: 450000.00,
      totalNssf: 30000.00,
      totalNhif: 40000.00,
      filedDate: '2025-02-05',
      filedBy: 'Grace Wanjiku'
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
      totalBudget: 8500000.00,
      actualSpent: 2125000.00,
      variance: 6375000.00,
      categories: [
        { name: 'Revenue', budgeted: 12000000.00, actual: 5700000.00, variance: 6300000.00 },
        { name: 'Cost of Sales', budgeted: 4800000.00, actual: 2110000.00, variance: 2690000.00 },
        { name: 'Salaries & Benefits', budgeted: 3600000.00, actual: 3000000.00, variance: 600000.00 },
        { name: 'Operating Expenses', budgeted: 1800000.00, actual: 925000.00, variance: 875000.00 },
        { name: 'Marketing', budgeted: 600000.00, actual: 125000.00, variance: 475000.00 }
      ]
    }
  ]);

  const [cashFlowEntries, setCashFlowEntries] = useState([
    {
      id: 1,
      date: '2025-02-01',
      description: 'Customer Payment - Safaricom PLC',
      category: 'Accounts Receivable',
      type: 'inflow',
      amount: 145000.00,
      actualAmount: 0,
      status: 'projected',
      runningBalance: 3540000.00
    },
    {
      id: 2,
      date: '2025-02-05',
      description: 'Salary Payments',
      category: 'Payroll',
      type: 'outflow',
      amount: 215000.00,
      actualAmount: 0,
      status: 'projected',
      runningBalance: 3325000.00
    },
    {
      id: 3,
      date: '2025-02-10',
      description: 'VAT Payment to KRA',
      category: 'Tax Payments',
      type: 'outflow',
      amount: 555900.00,
      actualAmount: 0,
      status: 'projected',
      runningBalance: 2769100.00
    }
  ]);

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      sku: 'LAPTOP-001',
      name: 'Dell Latitude 5520',
      category: 'Computer Equipment',
      quantityOnHand: 25,
      costPrice: 85000.00,
      sellingPrice: 125000.00,
      reorderLevel: 5,
      reorderQuantity: 20,
      status: 'in_stock',
      supplier: 'Simba Corp Kenya',
      totalValue: 2125000.00,
      lastUpdated: '2025-01-15'
    },
    {
      id: 2,
      sku: 'DESK-002',
      name: 'Executive Office Desk',
      category: 'Office Furniture',
      quantityOnHand: 8,
      costPrice: 35000.00,
      sellingPrice: 55000.00,
      reorderLevel: 3,
      reorderQuantity: 10,
      status: 'low_stock',
      supplier: 'Furniture Palace Kenya',
      totalValue: 280000.00,
      lastUpdated: '2025-01-14'
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Safaricom Digital Platform',
      code: 'SAF-001',
      customerId: 1,
      customer: 'Safaricom PLC',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      budget: 2500000.00,
      actualCost: 850000.00,
      billingType: 'time_and_materials',
      hourlyRate: 2500.00,
      progress: 35,
      hoursLogged: 340,
      budgetedHours: 1000,
      manager: 'John Kamau'
    }
  ]);

  // Kenyan Tax Calculation Functions
  const calculatePayeTax = (grossSalary: number): number => {
    // Kenya PAYE tax brackets for 2025
    let tax = 0;
    const monthlyGross = grossSalary;
    
    if (monthlyGross <= 24000) {
      tax = monthlyGross * 0.10;
    } else if (monthlyGross <= 32333) {
      tax = 2400 + (monthlyGross - 24000) * 0.25;
    } else if (monthlyGross <= 500000) {
      tax = 2400 + 2083.25 + (monthlyGross - 32333) * 0.30;
    } else if (monthlyGross <= 800000) {
      tax = 2400 + 2083.25 + 140300.10 + (monthlyGross - 500000) * 0.325;
    } else {
      tax = 2400 + 2083.25 + 140300.10 + 97500 + (monthlyGross - 800000) * 0.35;
    }
    
    // Personal relief
    tax = Math.max(0, tax - 2400);
    
    return Math.round(tax);
  };

  const calculateNSSF = (grossSalary: number): number => {
    // NSSF contribution: 6% of pensionable pay (max KES 2,160 per month)
    const contribution = Math.min(grossSalary * 0.06, 2160);
    return Math.round(contribution);
  };

  const calculateNHIF = (grossSalary: number): number => {
    // NHIF contribution brackets
    if (grossSalary <= 5999) return 150;
    if (grossSalary <= 7999) return 300;
    if (grossSalary <= 11999) return 400;
    if (grossSalary <= 14999) return 500;
    if (grossSalary <= 19999) return 600;
    if (grossSalary <= 24999) return 750;
    if (grossSalary <= 29999) return 850;
    if (grossSalary <= 34999) return 900;
    if (grossSalary <= 39999) return 950;
    if (grossSalary <= 44999) return 1000;
    if (grossSalary <= 49999) return 1100;
    if (grossSalary <= 59999) return 1200;
    if (grossSalary <= 69999) return 1300;
    if (grossSalary <= 79999) return 1400;
    if (grossSalary <= 89999) return 1500;
    if (grossSalary <= 99999) return 1600;
    return 1700; // For salaries above 100,000
  };

  const calculateVATReturn = (period: string) => {
    const periodInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.issueDate);
      return invDate.getMonth() === new Date().getMonth() - 1; // Previous month
    });
    
    const totalSales = periodInvoices.reduce((sum, inv) => sum + inv.subtotal, 0);
    const vatOnSales = periodInvoices.reduce((sum, inv) => sum + inv.taxAmount, 0);
    
    // Simulate purchases VAT
    const totalPurchases = totalSales * 0.4; // Assume 40% of sales as purchases
    const vatOnPurchases = totalPurchases * 0.16;
    
    return {
      totalSales,
      totalPurchases,
      vatOnSales,
      vatOnPurchases,
      netVat: vatOnSales - vatOnPurchases,
      withholdingVat: vatOnSales * 0.02, // 2% withholding VAT
      vatPayable: (vatOnSales - vatOnPurchases) - (vatOnSales * 0.02)
    };
  };

  // CRUD Operations with interrelated updates
  const addCustomer = (customer: any) => {
    const newCustomer = { 
      ...customer, 
      id: Date.now(), 
      balance: 0, 
      currency: 'KES',
      createdAt: new Date(),
      lastTransaction: null
    };
    setCustomers(prev => [...prev, newCustomer]);
    
    // Create opening balance journal entry if needed
    if (customer.openingBalance && customer.openingBalance !== 0) {
      const journalEntry = {
        id: Date.now(),
        date: new Date(),
        reference: `OB-CUST-${newCustomer.id}`,
        description: `Opening Balance - ${customer.name}`,
        totalDebit: customer.openingBalance > 0 ? customer.openingBalance : 0,
        totalCredit: customer.openingBalance < 0 ? Math.abs(customer.openingBalance) : 0,
        status: 'posted',
        createdBy: 'System',
        lines: [
          {
            id: Date.now().toString(),
            accountId: 4,
            accountCode: '1100',
            accountName: 'Accounts Receivable - Trade',
            debit: customer.openingBalance > 0 ? customer.openingBalance : 0,
            credit: customer.openingBalance < 0 ? Math.abs(customer.openingBalance) : 0,
            description: `Opening balance for ${customer.name}`
          }
        ]
      };
      addJournalEntry(journalEntry);
    }
  };

  const addInvoice = (invoice: any) => {
    const newInvoice = { 
      ...invoice, 
      id: Date.now(), 
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      currency: 'KES',
      status: 'draft',
      createdBy: 'Current User',
      sentAt: null,
      paidAt: null
    };
    setInvoices(prev => [...prev, newInvoice]);
    
    // Update customer balance
    const customer = customers.find(c => c.id === invoice.customerId);
    if (customer) {
      updateCustomer(invoice.customerId, { 
        balance: customer.balance + invoice.total,
        lastTransaction: new Date().toISOString().split('T')[0]
      });
    }
    
    // Create journal entry for invoice
    const journalEntry = {
      id: Date.now(),
      date: new Date(invoice.issueDate),
      reference: newInvoice.invoiceNumber,
      description: `Sales Invoice - ${invoice.customerName}`,
      totalDebit: invoice.total,
      totalCredit: invoice.total,
      status: 'posted',
      createdBy: 'Current User',
      lines: [
        {
          id: Date.now().toString(),
          accountId: 4,
          accountCode: '1100',
          accountName: 'Accounts Receivable - Trade',
          debit: invoice.total,
          credit: 0,
          description: `Invoice ${newInvoice.invoiceNumber}`
        },
        {
          id: (Date.now() + 1).toString(),
          accountId: 29,
          accountCode: '4000',
          accountName: 'Sales Revenue - Software Services',
          debit: 0,
          credit: invoice.subtotal,
          description: 'Sales revenue'
        },
        {
          id: (Date.now() + 2).toString(),
          accountId: 17,
          accountCode: '2100',
          accountName: 'VAT Output (Payable)',
          debit: 0,
          credit: invoice.taxAmount,
          description: '16% VAT on sales'
        }
      ]
    };
    addJournalEntry(journalEntry);
  };

  const sendInvoice = (id: number) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { 
        ...invoice, 
        status: 'sent', 
        sentAt: new Date() 
      } : invoice
    ));
  };

  const convertEstimateToInvoice = (id: number) => {
    const estimate = estimates.find(e => e.id === id);
    if (estimate) {
      const customer = customers.find(c => c.name === estimate.customer);
      const invoice = {
        customerId: customer?.id || 1,
        customerName: estimate.customer,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        subtotal: estimate.subtotal,
        taxAmount: estimate.taxAmount,
        total: estimate.total,
        lines: estimate.items.map((item: any) => ({
          id: Date.now().toString(),
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: 0,
          taxRate: 16,
          amount: item.amount
        })),
        notes: `Converted from estimate ${estimate.estimateNumber}`,
        terms: 'Payment due within 30 days'
      };
      addInvoice(invoice);
      updateEstimate(id, { status: 'converted' });
    }
  };

  const addJournalEntry = (entry: any) => {
    const newEntry = { 
      ...entry, 
      id: Date.now(),
      createdBy: entry.createdBy || 'Current User',
      createdAt: new Date()
    };
    setJournalEntries(prev => [...prev, newEntry]);
    updateAccountBalances();
  };

  const updateAccountBalances = () => {
    const balanceUpdates: { [key: number]: number } = {};
    
    // Calculate balances from journal entries
    journalEntries.forEach(entry => {
      if (entry.status === 'posted') {
        entry.lines.forEach((line: any) => {
          if (!balanceUpdates[line.accountId]) {
            const account = accounts.find(a => a.id === line.accountId);
            balanceUpdates[line.accountId] = account?.balance || 0;
          }
          
          // Apply accounting equation rules
          const account = accounts.find(a => a.id === line.accountId);
          if (account) {
            if (account.type === 'Asset' || account.type === 'Expense') {
              balanceUpdates[line.accountId] += line.debit - line.credit;
            } else {
              balanceUpdates[line.accountId] += line.credit - line.debit;
            }
          }
        });
      }
    });
    
    setAccounts(prev => prev.map(account => ({
      ...account,
      balance: balanceUpdates[account.id] !== undefined ? balanceUpdates[account.id] : account.balance
    })));
  };

  const generateReport = (reportType: string, parameters: any) => {
    switch (reportType) {
      case 'profit_loss':
        const revenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + Math.abs(a.balance), 0);
        const expenses = accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
        const costOfSales = accounts.filter(a => a.subType === 'Cost of Sales').reduce((sum, a) => sum + a.balance, 0);
        const operatingExpenses = accounts.filter(a => a.subType === 'Operating Expense').reduce((sum, a) => sum + a.balance, 0);
        
        return {
          revenue,
          costOfSales,
          grossProfit: revenue - costOfSales,
          operatingExpenses,
          netIncome: revenue - expenses,
          grossMargin: revenue > 0 ? ((revenue - costOfSales) / revenue) * 100 : 0,
          netMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0
        };
        
      case 'balance_sheet':
        const currentAssets = accounts.filter(a => a.type === 'Asset' && a.subType === 'Current Asset').reduce((sum, a) => sum + a.balance, 0);
        const fixedAssets = accounts.filter(a => a.type === 'Asset' && a.subType === 'Fixed Asset').reduce((sum, a) => sum + a.balance, 0);
        const currentLiabilities = Math.abs(accounts.filter(a => a.type === 'Liability' && a.subType === 'Current Liability').reduce((sum, a) => sum + a.balance, 0));
        const longTermLiabilities = Math.abs(accounts.filter(a => a.type === 'Liability' && a.subType === 'Long-term Liability').reduce((sum, a) => sum + a.balance, 0));
        const equity = accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + Math.abs(a.balance), 0);
        
        return {
          currentAssets,
          fixedAssets,
          totalAssets: currentAssets + fixedAssets,
          currentLiabilities,
          longTermLiabilities,
          totalLiabilities: currentLiabilities + longTermLiabilities,
          equity,
          totalEquity: equity,
          workingCapital: currentAssets - currentLiabilities,
          currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0
        };
        
      case 'cash_flow':
        const operatingCashFlow = 1250000.00;
        const investingCashFlow = -485000.00;
        const financingCashFlow = 125000.00;
        
        return {
          operatingActivities: operatingCashFlow,
          investingActivities: investingCashFlow,
          financingActivities: financingCashFlow,
          netCashFlow: operatingCashFlow + investingCashFlow + financingCashFlow,
          beginningCash: 2500000.00,
          endingCash: 2500000.00 + (operatingCashFlow + investingCashFlow + financingCashFlow)
        };
        
      case 'ar_aging':
        return customers.filter(c => c.balance > 0).map(customer => {
          const customerInvoices = invoices.filter(inv => inv.customerId === customer.id && inv.status !== 'paid');
          const total = customer.balance;
          
          return {
            customer: customer.name,
            total,
            current: total * 0.6,
            days30: total * 0.25,
            days60: total * 0.1,
            days90: total * 0.05,
            invoiceCount: customerInvoices.length
          };
        });
        
      case 'ap_aging':
        return vendors.filter(v => v.balance < 0).map(vendor => ({
          vendor: vendor.name,
          total: Math.abs(vendor.balance),
          current: Math.abs(vendor.balance) * 0.7,
          days30: Math.abs(vendor.balance) * 0.2,
          days60: Math.abs(vendor.balance) * 0.08,
          days90: Math.abs(vendor.balance) * 0.02
        }));
        
      case 'trial_balance':
        return accounts.map(account => ({
          code: account.code,
          name: account.name,
          debit: account.balance > 0 ? account.balance : 0,
          credit: account.balance < 0 ? Math.abs(account.balance) : 0,
          type: account.type
        }));
        
      case 'vat_return':
        return calculateVATReturn(parameters.period);
        
      default:
        return {};
    }
  };

  const exportData = (type: string, format: string) => {
    let data: any[] = [];
    let filename = '';
    
    switch (type) {
      case 'profit_loss':
        const plData = generateReport('profit_loss', {});
        data = [
          { Item: 'Total Revenue', Amount: plData.revenue },
          { Item: 'Cost of Sales', Amount: plData.costOfSales },
          { Item: 'Gross Profit', Amount: plData.grossProfit },
          { Item: 'Operating Expenses', Amount: plData.operatingExpenses },
          { Item: 'Net Income', Amount: plData.netIncome }
        ];
        filename = 'profit_loss_statement';
        break;
        
      case 'balance_sheet':
        const bsData = generateReport('balance_sheet', {});
        data = [
          { Item: 'Current Assets', Amount: bsData.currentAssets },
          { Item: 'Fixed Assets', Amount: bsData.fixedAssets },
          { Item: 'Total Assets', Amount: bsData.totalAssets },
          { Item: 'Current Liabilities', Amount: bsData.currentLiabilities },
          { Item: 'Long-term Liabilities', Amount: bsData.longTermLiabilities },
          { Item: 'Total Equity', Amount: bsData.totalEquity }
        ];
        filename = 'balance_sheet';
        break;
        
      case 'customers':
        data = customers.map(c => ({
          Name: c.name,
          Email: c.email,
          Phone: c.phone,
          Balance: c.balance,
          'Credit Limit': c.creditLimit,
          'Payment Terms': c.paymentTerms,
          'PIN Number': c.pinNumber,
          Status: c.status
        }));
        filename = 'customers_list';
        break;
        
      case 'vendors':
        data = vendors.map(v => ({
          Name: v.name,
          Email: v.email,
          Phone: v.phone,
          Balance: Math.abs(v.balance),
          'Payment Terms': v.paymentTerms,
          'PIN Number': v.pinNumber,
          Status: v.status
        }));
        filename = 'vendors_list';
        break;
        
      case 'invoices':
        data = invoices.map(inv => ({
          'Invoice Number': inv.invoiceNumber,
          Customer: inv.customerName,
          'Issue Date': inv.issueDate.toISOString().split('T')[0],
          'Due Date': inv.dueDate.toISOString().split('T')[0],
          'Subtotal (KES)': inv.subtotal,
          'VAT (KES)': inv.taxAmount,
          'Total (KES)': inv.total,
          Status: inv.status
        }));
        filename = 'invoices_list';
        break;
        
      case 'trial_balance':
        const tbData = generateReport('trial_balance', {});
        data = tbData.map((account: any) => ({
          'Account Code': account.code,
          'Account Name': account.name,
          'Debit (KES)': account.debit,
          'Credit (KES)': account.credit,
          Type: account.type
        }));
        filename = 'trial_balance';
        break;
        
      default:
        data = [];
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      downloadFile(csv, `${filename}.csv`, 'text/csv');
    } else if (format === 'excel') {
      // Simulate Excel export
      alert(`Exporting ${filename} to Excel format...\n\nFile will be downloaded as: ${filename}.xlsx`);
      // In real implementation, use libraries like xlsx or exceljs
    } else if (format === 'pdf') {
      // Simulate PDF export
      const pdfContent = generatePDFContent(data, type);
      alert(`Generating ${filename} PDF report...\n\n${pdfContent}`);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generatePDFContent = (data: any[], type: string) => {
    const companyHeader = `
COMPANY NAME LTD
P.O. Box 12345, Nairobi, Kenya
PIN: P051123456A | VAT: VAT051123456A
Tel: +254 722 123 456 | Email: info@company.co.ke

${type.toUpperCase().replace('_', ' ')} REPORT
Generated on: ${new Date().toLocaleDateString()}
Currency: Kenya Shillings (KES)
`;

    const dataRows = data.map(row => 
      Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(' | ')
    ).join('\n');

    return `${companyHeader}\n\n${dataRows}`;
  };

  const downloadDocument = (type: string, id: number) => {
    let document: any = null;
    let filename = '';
    
    switch (type) {
      case 'invoice':
        document = invoices.find(inv => inv.id === id);
        filename = `Invoice_${document?.invoiceNumber}.pdf`;
        break;
      case 'estimate':
        document = estimates.find(est => est.id === id);
        filename = `Estimate_${document?.estimateNumber}.pdf`;
        break;
      default:
        return;
    }
    
    if (document) {
      const pdfContent = generateDocumentPDF(document, type);
      alert(`Downloading ${filename}...\n\n${pdfContent}`);
    }
  };

  const generateDocumentPDF = (document: any, type: string) => {
    const companyHeader = `
COMPANY NAME LTD
P.O. Box 12345, Nairobi, Kenya
PIN: P051123456A | VAT: VAT051123456A
Tel: +254 722 123 456 | Email: info@company.co.ke
`;

    if (type === 'invoice') {
      return `${companyHeader}

INVOICE: ${document.invoiceNumber}
Date: ${document.issueDate.toISOString().split('T')[0]}
Due Date: ${document.dueDate.toISOString().split('T')[0]}

Bill To:
${document.customerName}

Items:
${document.lines.map((line: any) => 
  `${line.description} - Qty: ${line.quantity} @ KES ${line.unitPrice.toLocaleString()} = KES ${line.amount.toLocaleString()}`
).join('\n')}

Subtotal: KES ${document.subtotal.toLocaleString()}
VAT (16%): KES ${document.taxAmount.toLocaleString()}
Total: KES ${document.total.toLocaleString()}

${document.terms}`;
    } else if (type === 'estimate') {
      return `${companyHeader}

ESTIMATE: ${document.estimateNumber}
Date: ${document.issueDate}
Valid Until: ${document.expiryDate}

Prepared For:
${document.customer}

Items:
${document.items.map((item: any) => 
  `${item.description} - Qty: ${item.quantity} @ KES ${item.unitPrice.toLocaleString()} = KES ${item.amount.toLocaleString()}`
).join('\n')}

Subtotal: KES ${document.subtotal.toLocaleString()}
VAT (16%): KES ${document.taxAmount.toLocaleString()}
Total: KES ${document.total.toLocaleString()}

${document.terms}`;
    }
    return '';
  };

  const processPayroll = (id: number) => {
    const payroll = payrollRuns.find(p => p.id === id);
    if (payroll && payroll.status === 'draft') {
      // Calculate payroll for all employees
      const processedEntries = employees.map(emp => {
        const grossPay = emp.salary;
        const paye = calculatePayeTax(grossPay);
        const nssf = calculateNSSF(grossPay);
        const nhif = calculateNHIF(grossPay);
        const netPay = grossPay - paye - nssf - nhif;
        
        return {
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          grossPay,
          paye,
          nssf,
          nhif,
          netPay,
          hoursWorked: 176, // Standard monthly hours
          overtimeHours: 0
        };
      });
      
      const totals = processedEntries.reduce((acc, entry) => ({
        totalGross: acc.totalGross + entry.grossPay,
        totalPaye: acc.totalPaye + entry.paye,
        totalNssf: acc.totalNssf + entry.nssf,
        totalNhif: acc.totalNhif + entry.nhif,
        totalNet: acc.totalNet + entry.netPay
      }), { totalGross: 0, totalPaye: 0, totalNssf: 0, totalNhif: 0, totalNet: 0 });
      
      updatePayrollRun(id, {
        ...totals,
        entries: processedEntries,
        status: 'processed',
        employeeCount: employees.length
      });
      
      // Create journal entry for payroll
      const journalEntry = {
        id: Date.now(),
        date: new Date(payroll.payDate),
        reference: `PAY-${payroll.payPeriod.replace(' ', '-')}`,
        description: `Payroll - ${payroll.payPeriod}`,
        totalDebit: totals.totalGross,
        totalCredit: totals.totalGross,
        status: 'posted',
        createdBy: 'Payroll System',
        lines: [
          {
            id: Date.now().toString(),
            accountId: 36,
            accountCode: '6000',
            accountName: 'Salaries and Wages',
            debit: totals.totalGross,
            credit: 0,
            description: 'Gross salaries'
          },
          {
            id: (Date.now() + 1).toString(),
            accountId: 19,
            accountCode: '2200',
            accountName: 'PAYE Payable',
            debit: 0,
            credit: totals.totalPaye,
            description: 'Employee income tax'
          },
          {
            id: (Date.now() + 2).toString(),
            accountId: 20,
            accountCode: '2210',
            accountName: 'NSSF Payable',
            debit: 0,
            credit: totals.totalNssf,
            description: 'NSSF contributions'
          },
          {
            id: (Date.now() + 3).toString(),
            accountId: 21,
            accountCode: '2220',
            accountName: 'NHIF Payable',
            debit: 0,
            credit: totals.totalNhif,
            description: 'NHIF contributions'
          },
          {
            id: (Date.now() + 4).toString(),
            accountId: 1,
            accountCode: '1000',
            accountName: 'Cash at Bank - KCB',
            debit: 0,
            credit: totals.totalNet,
            description: 'Net salary payments'
          }
        ]
      };
      addJournalEntry(journalEntry);
    }
  };

  const fileTaxReturn = (id: number) => {
    setTaxReturns(prev => prev.map(ret => 
      ret.id === id ? { 
        ...ret, 
        status: 'filed', 
        filedDate: new Date().toISOString().split('T')[0],
        filedBy: 'Current User'
      } : ret
    ));
  };

  const calculateFinancialSummary = () => {
    const totalRevenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + Math.abs(a.balance), 0);
    const totalExpenses = accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
    const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + Math.max(0, a.balance), 0);
    const totalLiabilities = Math.abs(accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0));
    const totalEquity = accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + Math.abs(a.balance), 0);
    
    return {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      totalAssets,
      totalLiabilities,
      totalEquity,
      workingCapital: totalAssets - totalLiabilities,
      currentRatio: totalLiabilities > 0 ? totalAssets / totalLiabilities : 0,
      grossMargin: totalRevenue > 0 ? ((totalRevenue - (totalExpenses * 0.4)) / totalRevenue) * 100 : 0,
      netMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0
    };
  };

  const value = {
    customers,
    addCustomer,
    updateCustomer: (id: number, customerData: any) => {
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...customerData } : customer
      ));
    },
    deleteCustomer: (id: number) => {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    },
    vendors,
    addVendor: (vendor: any) => {
      const newVendor = { ...vendor, id: Date.now(), balance: 0, currency: 'KES' };
      setVendors(prev => [...prev, newVendor]);
    },
    updateVendor: (id: number, vendor: any) => setVendors(prev => prev.map(v => v.id === id ? { ...v, ...vendor } : v)),
    deleteVendor: (id: number) => setVendors(prev => prev.filter(v => v.id !== id)),
    invoices,
    addInvoice,
    updateInvoice: (id: number, invoice: any) => setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...invoice } : inv)),
    deleteInvoice: (id: number) => setInvoices(prev => prev.filter(inv => inv.id !== id)),
    sendInvoice,
    estimates,
    addEstimate: (estimate: any) => {
      const newEstimate = { 
        ...estimate, 
        id: Date.now(), 
        estimateNumber: `EST-${String(estimates.length + 1).padStart(3, '0')}`,
        status: 'draft'
      };
      setEstimates(prev => [...prev, newEstimate]);
    },
    updateEstimate: (id: number, estimate: any) => setEstimates(prev => prev.map(est => est.id === id ? { ...est, ...estimate } : est)),
    deleteEstimate: (id: number) => setEstimates(prev => prev.filter(est => est.id !== id)),
    sendEstimate: (id: number) => setEstimates(prev => prev.map(est => est.id === id ? { ...est, status: 'sent' } : est)),
    convertEstimateToInvoice,
    accounts,
    journalEntries,
    addAccount: (account: any) => setAccounts(prev => [...prev, { ...account, id: Date.now(), balance: 0, isActive: true }]),
    updateAccount: (id: number, account: any) => setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...account } : acc)),
    deleteAccount: (id: number) => setAccounts(prev => prev.filter(acc => acc.id !== id)),
    addJournalEntry,
    updateJournalEntry: (id: number, entry: any) => setJournalEntries(prev => prev.map(je => je.id === id ? { ...je, ...entry } : je)),
    deleteJournalEntry: (id: number) => setJournalEntries(prev => prev.filter(je => je.id !== id)),
    postJournalEntry: (id: number) => {
      setJournalEntries(prev => prev.map(je => je.id === id ? { ...je, status: 'posted' } : je));
      updateAccountBalances();
    },
    reverseJournalEntry: (id: number) => {
      setJournalEntries(prev => prev.map(je => je.id === id ? { ...je, status: 'reversed' } : je));
      updateAccountBalances();
    },
    employees,
    addEmployee: (employee: any) => setEmployees(prev => [...prev, { ...employee, id: Date.now(), employeeNumber: `EMP-${String(employees.length + 1).padStart(3, '0')}` }]),
    updateEmployee: (id: number, employee: any) => setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employee } : emp)),
    deleteEmployee: (id: number) => setEmployees(prev => prev.filter(emp => emp.id !== id)),
    projects,
    addProject: (project: any) => setProjects(prev => [...prev, { ...project, id: Date.now(), actualCost: 0, hoursLogged: 0, progress: 0 }]),
    updateProject: (id: number, project: any) => setProjects(prev => prev.map(proj => proj.id === id ? { ...proj, ...project } : proj)),
    deleteProject: (id: number) => setProjects(prev => prev.filter(proj => proj.id !== id)),
    inventoryItems,
    addInventoryItem: (item: any) => setInventoryItems(prev => [...prev, { ...item, id: Date.now(), status: 'in_stock' }]),
    updateInventoryItem: (id: number, item: any) => setInventoryItems(prev => prev.map(itm => itm.id === id ? { ...itm, ...item } : itm)),
    deleteInventoryItem: (id: number) => setInventoryItems(prev => prev.filter(itm => itm.id !== id)),
    adjustInventory: (id: number, adjustment: any) => {
      setInventoryItems(prev => prev.map(item => 
        item.id === id ? { 
          ...item, 
          quantityOnHand: item.quantityOnHand + adjustment.quantity,
          lastUpdated: new Date().toISOString().split('T')[0]
        } : item
      ));
    },
    payrollRuns,
    addPayrollRun: (payroll: any) => setPayrollRuns(prev => [...prev, { ...payroll, id: Date.now(), status: 'draft' }]),
    updatePayrollRun: (id: number, payroll: any) => setPayrollRuns(prev => prev.map(pr => pr.id === id ? { ...pr, ...payroll } : pr)),
    deletePayrollRun: (id: number) => setPayrollRuns(prev => prev.filter(pr => pr.id !== id)),
    processPayroll,
    taxReturns,
    addTaxReturn: (taxReturn: any) => setTaxReturns(prev => [...prev, { ...taxReturn, id: Date.now(), status: 'draft' }]),
    updateTaxReturn: (id: number, taxReturn: any) => setTaxReturns(prev => prev.map(tr => tr.id === id ? { ...tr, ...taxReturn } : tr)),
    deleteTaxReturn: (id: number) => setTaxReturns(prev => prev.filter(tr => tr.id !== id)),
    fileTaxReturn,
    budgets,
    addBudget: (budget: any) => setBudgets(prev => [...prev, { ...budget, id: Date.now(), status: 'draft' }]),
    updateBudget: (id: number, budget: any) => setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...budget } : b)),
    deleteBudget: (id: number) => setBudgets(prev => prev.filter(b => b.id !== id)),
    cashFlowEntries,
    addCashFlowEntry: (entry: any) => setCashFlowEntries(prev => [...prev, { ...entry, id: Date.now() }]),
    updateCashFlowEntry: (id: number, entry: any) => setCashFlowEntries(prev => prev.map(e => e.id === id ? { ...e, ...entry } : e)),
    deleteCashFlowEntry: (id: number) => setCashFlowEntries(prev => prev.filter(e => e.id !== id)),
    generateReport,
    exportData,
    downloadDocument,
    calculateFinancialSummary,
    getAccountBalance: (accountId: number) => accounts.find(a => a.id === accountId)?.balance || 0,
    updateAccountBalances,
    calculateVATReturn,
    calculatePayeTax,
    calculateNSSF,
    calculateNHIF
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}