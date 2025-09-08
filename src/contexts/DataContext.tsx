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
  
  // Report Generation
  generateReport: (reportType: string, parameters: any) => any;
  exportData: (type: string, format: string) => void;
  downloadDocument: (type: string, id: number) => void;
  
  // Financial Calculations
  calculateFinancialSummary: () => any;
  getAccountBalance: (accountId: number) => number;
  updateAccountBalances: () => void;
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
  // Kenyan-specific initial data
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
      lastTransaction: '2025-01-15'
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
      lastTransaction: '2025-01-14'
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
      lastTransaction: '2025-01-14'
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
      lastTransaction: '2025-01-13'
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
      terms: 'Standard payment terms apply'
    }
  ]);

  const [estimates, setEstimates] = useState([
    {
      id: 1,
      estimateNumber: 'EST-001',
      customer: 'Equity Bank Kenya',
      issueDate: '2025-01-12',
      expiryDate: '2025-02-11',
      status: 'sent',
      subtotal: 89500.00,
      taxAmount: 14320.00, // 16% VAT
      total: 103820.00,
      description: 'Banking system integration',
      items: [
        { description: 'System Integration', quantity: 1, unitPrice: 89500.00, amount: 89500.00 }
      ]
    }
  ]);

  const [accounts, setAccounts] = useState([
    { id: 1, code: '1000', name: 'Cash and Bank', type: 'Asset', balance: 2500000.00, isActive: true },
    { id: 2, code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 214500.00, isActive: true },
    { id: 3, code: '1200', name: 'Inventory', type: 'Asset', balance: 450000.00, isActive: true },
    { id: 4, code: '1300', name: 'Prepaid Expenses', type: 'Asset', balance: 75000.00, isActive: true },
    { id: 5, code: '1400', name: 'Fixed Assets', type: 'Asset', balance: 1200000.00, isActive: true },
    { id: 6, code: '2000', name: 'Accounts Payable', type: 'Liability', balance: -57500.00, isActive: true },
    { id: 7, code: '2100', name: 'VAT Payable', type: 'Liability', balance: -34320.00, isActive: true },
    { id: 8, code: '2200', name: 'PAYE Payable', type: 'Liability', balance: -125000.00, isActive: true },
    { id: 9, code: '2300', name: 'NSSF Payable', type: 'Liability', balance: -36000.00, isActive: true },
    { id: 10, code: '2400', name: 'NHIF Payable', type: 'Liability', balance: -24000.00, isActive: true },
    { id: 11, code: '3000', name: 'Share Capital', type: 'Equity', balance: 1000000.00, isActive: true },
    { id: 12, code: '3100', name: 'Retained Earnings', type: 'Equity', balance: 850000.00, isActive: true },
    { id: 13, code: '4000', name: 'Sales Revenue', type: 'Revenue', balance: 3250000.00, isActive: true },
    { id: 14, code: '4100', name: 'Service Revenue', type: 'Revenue', balance: 1800000.00, isActive: true },
    { id: 15, code: '5000', name: 'Cost of Goods Sold', type: 'Expense', balance: 1625000.00, isActive: true },
    { id: 16, code: '6000', name: 'Salaries and Wages', type: 'Expense', balance: 1200000.00, isActive: true },
    { id: 17, code: '6100', name: 'Rent Expense', type: 'Expense', balance: 240000.00, isActive: true },
    { id: 18, code: '6200', name: 'Utilities', type: 'Expense', balance: 120000.00, isActive: true },
    { id: 19, code: '6300', name: 'Professional Fees', type: 'Expense', balance: 180000.00, isActive: true },
    { id: 20, code: '6400', name: 'Marketing Expenses', type: 'Expense', balance: 95000.00, isActive: true }
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
      lines: [
        { accountId: 2, accountCode: '1100', accountName: 'Accounts Receivable', debit: 145000.00, credit: 0 },
        { accountId: 13, accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 125000.00 },
        { accountId: 7, accountCode: '2100', accountName: 'VAT Payable', debit: 0, credit: 20000.00 }
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
      }
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
      budgetedHours: 1000
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
      status: 'in_stock',
      supplier: 'Simba Corp Kenya'
    }
  ]);

  // CRUD Operations
  const addCustomer = (customer: any) => {
    const newCustomer = { ...customer, id: Date.now(), balance: 0, currency: 'KES' };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: number, customerData: any) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...customerData } : customer
    ));
  };

  const deleteCustomer = (id: number) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const addInvoice = (invoice: any) => {
    const newInvoice = { 
      ...invoice, 
      id: Date.now(), 
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      currency: 'KES'
    };
    setInvoices(prev => [...prev, newInvoice]);
    
    // Update customer balance
    updateCustomer(invoice.customerId, { 
      balance: customers.find(c => c.id === invoice.customerId)?.balance + invoice.total 
    });
    
    // Create journal entry
    const journalEntry = {
      id: Date.now(),
      date: new Date(),
      reference: newInvoice.invoiceNumber,
      description: `Sales Invoice - ${invoice.customerName}`,
      totalDebit: invoice.total,
      totalCredit: invoice.total,
      status: 'posted',
      lines: [
        { accountId: 2, accountCode: '1100', accountName: 'Accounts Receivable', debit: invoice.total, credit: 0 },
        { accountId: 13, accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: invoice.subtotal },
        { accountId: 7, accountCode: '2100', accountName: 'VAT Payable', debit: 0, credit: invoice.taxAmount }
      ]
    };
    setJournalEntries(prev => [...prev, journalEntry]);
    updateAccountBalances();
  };

  const sendInvoice = (id: number) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id ? { ...invoice, status: 'sent', sentAt: new Date() } : invoice
    ));
  };

  const convertEstimateToInvoice = (id: number) => {
    const estimate = estimates.find(e => e.id === id);
    if (estimate) {
      const invoice = {
        customerId: customers.find(c => c.name === estimate.customer)?.id || 1,
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
        notes: 'Converted from estimate ' + estimate.estimateNumber,
        terms: 'Payment due within 30 days'
      };
      addInvoice(invoice);
      updateEstimate(id, { status: 'converted' });
    }
  };

  const updateAccountBalances = () => {
    // Recalculate account balances based on journal entries
    const balances: { [key: number]: number } = {};
    
    journalEntries.forEach(entry => {
      if (entry.status === 'posted') {
        entry.lines.forEach((line: any) => {
          if (!balances[line.accountId]) balances[line.accountId] = 0;
          balances[line.accountId] += line.debit - line.credit;
        });
      }
    });
    
    setAccounts(prev => prev.map(account => ({
      ...account,
      balance: balances[account.id] || account.balance
    })));
  };

  const generateReport = (reportType: string, parameters: any) => {
    switch (reportType) {
      case 'profit_loss':
        const revenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
        const expenses = accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
        return {
          revenue,
          expenses,
          netIncome: revenue - expenses,
          grossProfit: revenue * 0.6,
          operatingExpenses: expenses * 0.8
        };
        
      case 'balance_sheet':
        const assets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
        const liabilities = Math.abs(accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0));
        const equity = accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0);
        return {
          totalAssets: assets,
          totalLiabilities: liabilities,
          equity: equity,
          currentAssets: assets * 0.7,
          fixedAssets: assets * 0.3,
          currentLiabilities: liabilities * 0.6,
          longTermLiabilities: liabilities * 0.4
        };
        
      case 'cash_flow':
        const operatingCashFlow = 450000.00;
        const investingCashFlow = -125000.00;
        const financingCashFlow = 75000.00;
        return {
          inflows: operatingCashFlow + financingCashFlow,
          outflows: Math.abs(investingCashFlow),
          netCashFlow: operatingCashFlow + investingCashFlow + financingCashFlow,
          operatingActivities: operatingCashFlow,
          investingActivities: investingCashFlow,
          financingActivities: financingCashFlow
        };
        
      case 'ar_aging':
        return customers.filter(c => c.balance > 0).map(customer => ({
          customer: customer.name,
          total: customer.balance,
          current: customer.balance * 0.6,
          days30: customer.balance * 0.25,
          days60: customer.balance * 0.1,
          days90: customer.balance * 0.05
        }));
        
      default:
        return {};
    }
  };

  const exportData = (type: string, format: string) => {
    let data: any[] = [];
    let filename = '';
    
    switch (type) {
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
      case 'accounts':
        data = accounts;
        filename = 'chart_of_accounts';
        break;
      default:
        data = [];
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      downloadFile(csv, `${filename}.csv`, 'text/csv');
    } else if (format === 'excel') {
      // Simulate Excel export
      alert(`Exporting ${filename} to Excel format...`);
    } else if (format === 'pdf') {
      // Simulate PDF export
      alert(`Generating ${filename} PDF report...`);
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
      // Simulate PDF generation and download
      const pdfContent = generatePDFContent(document, type);
      alert(`Downloading ${filename}...\n\nDocument Details:\n${pdfContent}`);
    }
  };

  const generatePDFContent = (document: any, type: string) => {
    if (type === 'invoice') {
      return `Invoice: ${document.invoiceNumber}
Customer: ${document.customerName}
Date: ${document.issueDate}
Amount: KES ${document.total.toLocaleString()}
Status: ${document.status}`;
    } else if (type === 'estimate') {
      return `Estimate: ${document.estimateNumber}
Customer: ${document.customer}
Date: ${document.issueDate}
Amount: KES ${document.total.toLocaleString()}
Status: ${document.status}`;
    }
    return '';
  };

  const calculateFinancialSummary = () => {
    const totalRevenue = accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0);
    const totalExpenses = accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
    const totalAssets = accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = Math.abs(accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0));
    const totalEquity = accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0);
    
    return {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      totalAssets,
      totalLiabilities,
      totalEquity,
      workingCapital: totalAssets - totalLiabilities,
      currentRatio: totalLiabilities > 0 ? totalAssets / totalLiabilities : 0
    };
  };

  const value = {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    vendors,
    addVendor: (vendor: any) => setVendors(prev => [...prev, { ...vendor, id: Date.now(), currency: 'KES' }]),
    updateVendor: (id: number, vendor: any) => setVendors(prev => prev.map(v => v.id === id ? { ...v, ...vendor } : v)),
    deleteVendor: (id: number) => setVendors(prev => prev.filter(v => v.id !== id)),
    invoices,
    addInvoice,
    updateInvoice: (id: number, invoice: any) => setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...invoice } : inv)),
    deleteInvoice: (id: number) => setInvoices(prev => prev.filter(inv => inv.id !== id)),
    sendInvoice,
    estimates,
    addEstimate: (estimate: any) => setEstimates(prev => [...prev, { ...estimate, id: Date.now(), estimateNumber: `EST-${String(estimates.length + 1).padStart(3, '0')}` }]),
    updateEstimate: (id: number, estimate: any) => setEstimates(prev => prev.map(est => est.id === id ? { ...est, ...estimate } : est)),
    deleteEstimate: (id: number) => setEstimates(prev => prev.filter(est => est.id !== id)),
    sendEstimate: (id: number) => setEstimates(prev => prev.map(est => est.id === id ? { ...est, status: 'sent' } : est)),
    convertEstimateToInvoice,
    accounts,
    journalEntries,
    addAccount: (account: any) => setAccounts(prev => [...prev, { ...account, id: Date.now() }]),
    updateAccount: (id: number, account: any) => setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...account } : acc)),
    deleteAccount: (id: number) => setAccounts(prev => prev.filter(acc => acc.id !== id)),
    addJournalEntry: (entry: any) => {
      const newEntry = { ...entry, id: Date.now() };
      setJournalEntries(prev => [...prev, newEntry]);
      updateAccountBalances();
    },
    employees,
    addEmployee: (employee: any) => setEmployees(prev => [...prev, { ...employee, id: Date.now(), employeeNumber: `EMP-${String(employees.length + 1).padStart(3, '0')}` }]),
    updateEmployee: (id: number, employee: any) => setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employee } : emp)),
    deleteEmployee: (id: number) => setEmployees(prev => prev.filter(emp => emp.id !== id)),
    projects,
    addProject: (project: any) => setProjects(prev => [...prev, { ...project, id: Date.now() }]),
    updateProject: (id: number, project: any) => setProjects(prev => prev.map(proj => proj.id === id ? { ...proj, ...project } : proj)),
    deleteProject: (id: number) => setProjects(prev => prev.filter(proj => proj.id !== id)),
    inventoryItems,
    addInventoryItem: (item: any) => setInventoryItems(prev => [...prev, { ...item, id: Date.now() }]),
    updateInventoryItem: (id: number, item: any) => setInventoryItems(prev => prev.map(itm => itm.id === id ? { ...itm, ...item } : itm)),
    deleteInventoryItem: (id: number) => setInventoryItems(prev => prev.filter(itm => itm.id !== id)),
    generateReport,
    exportData,
    downloadDocument,
    calculateFinancialSummary,
    getAccountBalance: (accountId: number) => accounts.find(a => a.id === accountId)?.balance || 0,
    updateAccountBalances
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}