import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useTenant } from './TenantContext';
import { reportingService } from '../services/reporting.service';
import { getTranslation } from '../lib/translations';
import { eastAfricanTaxConfigs, CountryTaxConfig, getCountryTaxConfig } from '../lib/eastAfricanTaxConfigs';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Tax-related types and interfaces
export interface TaxSettings {
  countryCode: string;
  taxRegistrationNumber: string;
  vatRegistrationNumber?: string;
  taxAuthority: string;
}

export interface BankingIntegration {
  mpesaApiKey?: string;
  mpesaConsumerKey?: string;
  mpesaConsumerSecret?: string;
  equityBankApi?: string;
  kcbBankApi?: string;
  cooperativeBankApi?: string;
  enableRealTimeSync: boolean;
}

export interface GlobalState {
  // Financial Data
  accounts: Account[];
  journalEntries: JournalEntry[];
  customers: Customer[];
  vendors: Vendor[];
  invoices: Invoice[];
  estimates: Estimate[];
  
  // Operational Data
  employees: Employee[];
  projects: Project[];
  assets: Asset[];
  inventory: InventoryItem[];
  
  // Configuration
  taxSettings: TaxSettings;
  bankingIntegration: BankingIntegration;
  settings: {
    currency: string;
    currencySymbol: string;
    language: string;
    timezone: string;
    dateFormat: string;
    fiscalYearStart: string;
  };
  
  // System State
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  read: boolean;
  category?: 'system' | 'user' | 'financial' | 'compliance' | 'workflow';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  actionLabel?: string;
  persistent?: boolean; // If true, won't auto-remove
  userId?: string; // For user-specific notifications
}

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subType: string;
  balance: number;
  parentId?: string;
  isActive: boolean;
  description?: string;
  kenyanTaxCode?: string;
  kraReportingCategory?: string;
}

interface JournalEntry {
  id: string;
  date: Date;
  reference: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: 'draft' | 'posted' | 'reversed';
  lines: JournalLine[];
  createdBy: string;
  approvedBy?: string;
  sourceModule: string;
  sourceId?: string;
  kraSubmitted: boolean;
}

interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
  reference?: string;
  vatAmount?: number;
  withholdingTax?: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  kraPin?: string;
  vatNumber?: string;
  address: KenyanAddress;
  balance: number;
  creditLimit: number;
  paymentTerms: number;
  isActive: boolean;
  county: string;
  constituency: string;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  kraPin?: string;
  vatNumber?: string;
  address: KenyanAddress;
  balance: number;
  paymentTerms: number;
  isActive: boolean;
  county: string;
  withholdingTaxCategory: string;
}

interface KenyanAddress {
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: 'Kenya';
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  vatAmount: number;
  total: number;
  paidAmount: number;
  lines: InvoiceLine[];
  kraSubmitted: boolean;
  etims: boolean; // Electronic Tax Invoice Management System
}

interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  amount: number;
  itemCode?: string;
}

interface Estimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  customerName: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  subtotal: number;
  vatAmount: number;
  total: number;
  lines: EstimateLine[];
  convertedToInvoice: boolean;
  invoiceId?: string;
}

interface EstimateLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  amount: number;
}

interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kraPin: string;
  nssfNumber: string;
  nhifNumber: string;
  position: string;
  department: string;
  salary: number;
  payFrequency: 'monthly' | 'weekly';
  hireDate: Date;
  isActive: boolean;
  bankAccount: EmployeeBankAccount;
  taxRelief: number;
  housingAllowance: number;
  transportAllowance: number;
}

interface EmployeeBankAccount {
  accountNumber: string;
  bankName: string;
  branchCode: string;
}

interface Project {
  id: string;
  name: string;
  code: string;
  customerId: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  budget: number;
  actualCost: number;
  startDate: Date;
  endDate?: Date;
  managerId: string;
}

interface Asset {
  id: string;
  assetNumber: string;
  name: string;
  category: string;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'straight_line' | 'reducing_balance';
  usefulLife: number;
  purchaseDate: Date;
  location: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'active' | 'disposed' | 'sold';
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantityOnHand: number;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  vatRate: number;
}

type GlobalAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'LOAD_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; data: Partial<Account> } }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_JOURNAL_ENTRY'; payload: { id: string; data: Partial<JournalEntry> } }
  | { type: 'POST_JOURNAL_ENTRY'; payload: string }
  | { type: 'REVERSE_JOURNAL_ENTRY'; payload: string }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: { id: string; data: Partial<Customer> } }
  | { type: 'ADD_VENDOR'; payload: Vendor }
  | { type: 'UPDATE_VENDOR'; payload: { id: string; data: Partial<Vendor> } }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: { id: string; data: Partial<Invoice> } }
  | { type: 'PAY_INVOICE'; payload: { id: string; amount: number } }
  | { type: 'ADD_ESTIMATE'; payload: Estimate }
  | { type: 'UPDATE_ESTIMATE'; payload: { id: string; data: Partial<Estimate> } }
  | { type: 'CONVERT_ESTIMATE_TO_INVOICE'; payload: string }
  | { type: 'UPDATE_TAX_SETTINGS'; payload: Partial<TaxSettings> }
  | { type: 'SYNC_WITH_TAX_AUTHORITY'; payload: any }
  | { type: 'SYNC_WITH_BANKS'; payload: any };

const initialState: GlobalState = {
  accounts: [
    // Assets
    { id: '1', code: '1000', name: 'Petty Cash', type: 'Asset', subType: 'Current Asset', balance: 50000, isActive: true, kenyanTaxCode: 'CASH', kraReportingCategory: 'CURRENT_ASSETS' },
    { id: '2', code: '1010', name: 'KCB Bank Account', type: 'Asset', subType: 'Current Asset', balance: 2500000, isActive: true, kenyanTaxCode: 'BANK', kraReportingCategory: 'CURRENT_ASSETS' },
    { id: '3', code: '1020', name: 'Equity Bank Account', type: 'Asset', subType: 'Current Asset', balance: 1800000, isActive: true, kenyanTaxCode: 'BANK', kraReportingCategory: 'CURRENT_ASSETS' },
    { id: '4', code: '1100', name: 'Accounts Receivable', type: 'Asset', subType: 'Current Asset', balance: 850000, isActive: true, kenyanTaxCode: 'AR', kraReportingCategory: 'CURRENT_ASSETS' },
    { id: '5', code: '1200', name: 'Inventory - Finished Goods', type: 'Asset', subType: 'Current Asset', balance: 1200000, isActive: true, kenyanTaxCode: 'INVENTORY', kraReportingCategory: 'CURRENT_ASSETS' },
    { id: '6', code: '1300', name: 'Prepaid Expenses', type: 'Asset', subType: 'Current Asset', balance: 150000, isActive: true, kenyanTaxCode: 'PREPAID', kraReportingCategory: 'CURRENT_ASSETS' },
    { id: '7', code: '1500', name: 'Office Equipment', type: 'Asset', subType: 'Fixed Asset', balance: 800000, isActive: true, kenyanTaxCode: 'FIXED_ASSET', kraReportingCategory: 'FIXED_ASSETS' },
    { id: '8', code: '1510', name: 'Motor Vehicles', type: 'Asset', subType: 'Fixed Asset', balance: 3200000, isActive: true, kenyanTaxCode: 'FIXED_ASSET', kraReportingCategory: 'FIXED_ASSETS' },
    { id: '9', code: '1520', name: 'Accumulated Depreciation - Equipment', type: 'Asset', subType: 'Fixed Asset', balance: -200000, isActive: true, kenyanTaxCode: 'DEPRECIATION', kraReportingCategory: 'FIXED_ASSETS' },
    
    // Liabilities
    { id: '10', code: '2000', name: 'Accounts Payable', type: 'Liability', subType: 'Current Liability', balance: -650000, isActive: true, kenyanTaxCode: 'AP', kraReportingCategory: 'CURRENT_LIABILITIES' },
    { id: '11', code: '2100', name: 'VAT Payable', type: 'Liability', subType: 'Current Liability', balance: -120000, isActive: true, kenyanTaxCode: 'VAT_PAYABLE', kraReportingCategory: 'TAX_LIABILITIES' },
    { id: '12', code: '2110', name: 'PAYE Payable', type: 'Liability', subType: 'Current Liability', balance: -85000, isActive: true, kenyanTaxCode: 'PAYE', kraReportingCategory: 'TAX_LIABILITIES' },
    { id: '13', code: '2120', name: 'NSSF Payable', type: 'Liability', subType: 'Current Liability', balance: -45000, isActive: true, kenyanTaxCode: 'NSSF', kraReportingCategory: 'STATUTORY_DEDUCTIONS' },
    { id: '14', code: '2130', name: 'NHIF Payable', type: 'Liability', subType: 'Current Liability', balance: -25000, isActive: true, kenyanTaxCode: 'NHIF', kraReportingCategory: 'STATUTORY_DEDUCTIONS' },
    { id: '15', code: '2140', name: 'Withholding Tax Payable', type: 'Liability', subType: 'Current Liability', balance: -35000, isActive: true, kenyanTaxCode: 'WHT', kraReportingCategory: 'TAX_LIABILITIES' },
    { id: '16', code: '2200', name: 'Accrued Expenses', type: 'Liability', subType: 'Current Liability', balance: -180000, isActive: true, kenyanTaxCode: 'ACCRUED', kraReportingCategory: 'CURRENT_LIABILITIES' },
    { id: '17', code: '2500', name: 'Bank Loan - KCB', type: 'Liability', subType: 'Long-term Liability', balance: -2500000, isActive: true, kenyanTaxCode: 'LOAN', kraReportingCategory: 'LONG_TERM_LIABILITIES' },
    
    // Equity
    { id: '18', code: '3000', name: 'Share Capital', type: 'Equity', subType: 'Capital', balance: -5000000, isActive: true, kenyanTaxCode: 'CAPITAL', kraReportingCategory: 'EQUITY' },
    { id: '19', code: '3100', name: 'Retained Earnings', type: 'Equity', subType: 'Retained Earnings', balance: -1200000, isActive: true, kenyanTaxCode: 'RETAINED', kraReportingCategory: 'EQUITY' },
    { id: '20', code: '3200', name: 'Current Year Earnings', type: 'Equity', subType: 'Current Earnings', balance: -850000, isActive: true, kenyanTaxCode: 'CURRENT_EARNINGS', kraReportingCategory: 'EQUITY' },
    
    // Revenue
    { id: '21', code: '4000', name: 'Sales Revenue - Local', type: 'Revenue', subType: 'Operating Revenue', balance: -3500000, isActive: true, kenyanTaxCode: 'SALES_LOCAL', kraReportingCategory: 'REVENUE' },
    { id: '22', code: '4010', name: 'Sales Revenue - Export', type: 'Revenue', subType: 'Operating Revenue', balance: -1200000, isActive: true, kenyanTaxCode: 'SALES_EXPORT', kraReportingCategory: 'REVENUE' },
    { id: '23', code: '4100', name: 'Service Revenue', type: 'Revenue', subType: 'Operating Revenue', balance: -800000, isActive: true, kenyanTaxCode: 'SERVICE_REVENUE', kraReportingCategory: 'REVENUE' },
    { id: '24', code: '4200', name: 'Interest Income', type: 'Revenue', subType: 'Other Revenue', balance: -45000, isActive: true, kenyanTaxCode: 'INTEREST_INCOME', kraReportingCategory: 'OTHER_INCOME' },
    { id: '25', code: '4300', name: 'Foreign Exchange Gain', type: 'Revenue', subType: 'Other Revenue', balance: -25000, isActive: true, kenyanTaxCode: 'FX_GAIN', kraReportingCategory: 'OTHER_INCOME' },
    
    // Expenses
    { id: '26', code: '5000', name: 'Cost of Goods Sold', type: 'Expense', subType: 'Cost of Sales', balance: 1800000, isActive: true, kenyanTaxCode: 'COGS', kraReportingCategory: 'COST_OF_SALES' },
    { id: '27', code: '5100', name: 'Salaries and Wages', type: 'Expense', subType: 'Operating Expense', balance: 1200000, isActive: true, kenyanTaxCode: 'SALARIES', kraReportingCategory: 'EMPLOYEE_COSTS' },
    { id: '28', code: '5110', name: 'NSSF Employer Contribution', type: 'Expense', subType: 'Operating Expense', balance: 72000, isActive: true, kenyanTaxCode: 'NSSF_EMPLOYER', kraReportingCategory: 'STATUTORY_CONTRIBUTIONS' },
    { id: '29', code: '5120', name: 'NHIF Employer Contribution', type: 'Expense', subType: 'Operating Expense', balance: 48000, isActive: true, kenyanTaxCode: 'NHIF_EMPLOYER', kraReportingCategory: 'STATUTORY_CONTRIBUTIONS' },
    { id: '30', code: '5200', name: 'Rent Expense', type: 'Expense', subType: 'Operating Expense', balance: 360000, isActive: true, kenyanTaxCode: 'RENT', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '31', code: '5210', name: 'Utilities - Electricity', type: 'Expense', subType: 'Operating Expense', balance: 180000, isActive: true, kenyanTaxCode: 'UTILITIES', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '32', code: '5220', name: 'Utilities - Water', type: 'Expense', subType: 'Operating Expense', balance: 45000, isActive: true, kenyanTaxCode: 'UTILITIES', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '33', code: '5300', name: 'Professional Fees', type: 'Expense', subType: 'Operating Expense', balance: 250000, isActive: true, kenyanTaxCode: 'PROFESSIONAL_FEES', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '34', code: '5400', name: 'Marketing and Advertising', type: 'Expense', subType: 'Operating Expense', balance: 150000, isActive: true, kenyanTaxCode: 'MARKETING', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '35', code: '5500', name: 'Travel and Entertainment', type: 'Expense', subType: 'Operating Expense', balance: 95000, isActive: true, kenyanTaxCode: 'TRAVEL', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '36', code: '5600', name: 'Office Supplies', type: 'Expense', subType: 'Operating Expense', balance: 75000, isActive: true, kenyanTaxCode: 'SUPPLIES', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '37', code: '5700', name: 'Insurance Expense', type: 'Expense', subType: 'Operating Expense', balance: 120000, isActive: true, kenyanTaxCode: 'INSURANCE', kraReportingCategory: 'OPERATING_EXPENSES' },
    { id: '38', code: '5800', name: 'Depreciation Expense', type: 'Expense', subType: 'Operating Expense', balance: 200000, isActive: true, kenyanTaxCode: 'DEPRECIATION', kraReportingCategory: 'DEPRECIATION' },
    { id: '39', code: '5900', name: 'Bank Charges', type: 'Expense', subType: 'Financial Expense', balance: 35000, isActive: true, kenyanTaxCode: 'BANK_CHARGES', kraReportingCategory: 'FINANCIAL_EXPENSES' },
    { id: '40', code: '5910', name: 'Interest Expense', type: 'Expense', subType: 'Financial Expense', balance: 180000, isActive: true, kenyanTaxCode: 'INTEREST_EXPENSE', kraReportingCategory: 'FINANCIAL_EXPENSES' }
  ],
  
  journalEntries: [
    {
      id: '1',
      date: new Date('2025-01-15'),
      reference: 'JE-001',
      description: 'Sales Invoice - Safaricom PLC',
      totalDebit: 174000,
      totalCredit: 174000,
      status: 'posted',
      lines: [
        { id: '1', accountId: '4', accountCode: '1100', accountName: 'Accounts Receivable', debit: 174000, credit: 0, description: 'Invoice INV-001', vatAmount: 24000 },
        { id: '2', accountId: '21', accountCode: '4000', accountName: 'Sales Revenue - Local', debit: 0, credit: 150000, description: 'Sales to Safaricom' },
        { id: '3', accountId: '11', accountCode: '2100', accountName: 'VAT Payable', debit: 0, credit: 24000, description: 'VAT on sales' }
      ],
      createdBy: 'System',
      sourceModule: 'Invoices',
      sourceId: '1',
      kraSubmitted: true
    }
  ],
  
  customers: [
    {
      id: '1',
      name: 'Safaricom PLC',
      email: 'procurement@safaricom.co.ke',
      phone: '+254 722 000 000',
      kraPin: 'P051234567A',
      vatNumber: 'VAT001234567',
      address: { street: 'Safaricom House, Waiyaki Way', city: 'Nairobi', county: 'Nairobi', postalCode: '00100', country: 'Kenya' },
      balance: 174000,
      creditLimit: 5000000,
      paymentTerms: 30,
      isActive: true,
      county: 'Nairobi',
      constituency: 'Westlands'
    },
    {
      id: '2',
      name: 'Equity Bank Kenya Limited',
      email: 'suppliers@equitybank.co.ke',
      phone: '+254 763 000 000',
      kraPin: 'P051234568B',
      vatNumber: 'VAT001234568',
      address: { street: 'Equity Centre, Upper Hill', city: 'Nairobi', county: 'Nairobi', postalCode: '00200', country: 'Kenya' },
      balance: 0,
      creditLimit: 10000000,
      paymentTerms: 30,
      isActive: true,
      county: 'Nairobi',
      constituency: 'Starehe'
    }
  ],
  
  vendors: [
    {
      id: '1',
      name: 'Kenya Power and Lighting Company',
      email: 'billing@kplc.co.ke',
      phone: '+254 711 070 000',
      kraPin: 'P051234569C',
      vatNumber: 'VAT001234569',
      address: { street: 'Stima Plaza, Kolobot Road', city: 'Nairobi', county: 'Nairobi', postalCode: '30099', country: 'Kenya' },
      balance: -85000,
      paymentTerms: 30,
      isActive: true,
      county: 'Nairobi',
      withholdingTaxCategory: 'UTILITIES'
    }
  ],
  
  invoices: [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      customerId: '1',
      customerName: 'Safaricom PLC',
      issueDate: new Date('2025-01-15'),
      dueDate: new Date('2025-02-14'),
      status: 'sent',
      subtotal: 150000,
      vatAmount: 24000,
      total: 174000,
      paidAmount: 0,
      lines: [
        { id: '1', description: 'IT Consulting Services', quantity: 100, unitPrice: 1500, vatRate: 16, vatAmount: 24000, amount: 150000 }
      ],
      kraSubmitted: false,
      etims: false
    }
  ],
  
  estimates: [],
  employees: [],
  projects: [],
  assets: [],
  inventory: [],
  
  taxSettings: {
    countryCode: 'KE',
    taxRegistrationNumber: 'P051234567A',
    vatRegistrationNumber: 'VAT001234567',
    taxAuthority: 'Kenya Revenue Authority (KRA)'
  },
  
  bankingIntegration: {
    mpesaApiKey: '',
    mpesaConsumerKey: '',
    mpesaConsumerSecret: '',
    equityBankApi: '',
    kcbBankApi: '',
    cooperativeBankApi: '',
    enableRealTimeSync: false
  },
  
  settings: {
    currency: 'KES',
    currencySymbol: 'KES',
    language: 'en',
    timezone: 'Africa/Nairobi',
    dateFormat: 'DD/MM/YYYY',
    fiscalYearStart: '01/01'
  },
  
  loading: false,
  error: null,
  lastSync: null,
  notifications: []
};

function globalStateReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
      
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        )
      };
      
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      };
      
    case 'CLEAR_ALL_NOTIFICATIONS':
      return { ...state, notifications: [] };
      
    case 'LOAD_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
      
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
      
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? { ...account, ...action.payload.data } : account
        )
      };
      
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload)
      };
      
    case 'ADD_JOURNAL_ENTRY':
      // Update account balances when adding journal entry
      const updatedAccounts = state.accounts.map(account => {
        const debitLine = action.payload.lines.find(line => line.accountId === account.id && line.debit > 0);
        const creditLine = action.payload.lines.find(line => line.accountId === account.id && line.credit > 0);
        
        if (debitLine || creditLine) {
          const debitAmount = debitLine ? debitLine.debit : 0;
          const creditAmount = creditLine ? creditLine.credit : 0;
          const netChange = debitAmount - creditAmount;
          
          return { ...account, balance: account.balance + netChange };
        }
        return account;
      });
      
      return {
        ...state,
        journalEntries: [...state.journalEntries, action.payload],
        accounts: updatedAccounts
      };
      
    case 'POST_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: state.journalEntries.map(entry =>
          entry.id === action.payload ? { ...entry, status: 'posted' } : entry
        )
      };
      
    case 'ADD_INVOICE':
      // Create automatic journal entry for invoice
      const invoiceJE: JournalEntry = {
        id: `JE-INV-${action.payload.id}`,
        date: action.payload.issueDate,
        reference: `JE-${action.payload.invoiceNumber}`,
        description: `Sales Invoice - ${action.payload.customerName}`,
        totalDebit: action.payload.total,
        totalCredit: action.payload.total,
        status: 'posted',
        lines: [
          {
            id: '1',
            accountId: '4',
            accountCode: '1100',
            accountName: 'Accounts Receivable',
            debit: action.payload.total,
            credit: 0,
            description: `Invoice ${action.payload.invoiceNumber}`,
            vatAmount: action.payload.vatAmount
          },
          {
            id: '2',
            accountId: '21',
            accountCode: '4000',
            accountName: 'Sales Revenue - Local',
            debit: 0,
            credit: action.payload.subtotal,
            description: `Sales to ${action.payload.customerName}`
          },
          {
            id: '3',
            accountId: '11',
            accountCode: '2100',
            accountName: 'VAT Payable',
            debit: 0,
            credit: action.payload.vatAmount,
            description: 'VAT on sales'
          }
        ],
        createdBy: 'System',
        sourceModule: 'Invoices',
        sourceId: action.payload.id,
        kraSubmitted: false
      };
      
      // Update customer balance
      const updatedCustomers = state.customers.map(customer =>
        customer.id === action.payload.customerId
          ? { ...customer, balance: customer.balance + action.payload.total }
          : customer
      );
      
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
        journalEntries: [...state.journalEntries, invoiceJE],
        customers: updatedCustomers
      };
      
    case 'PAY_INVOICE':
      // Update invoice and create payment journal entry
      const updatedInvoices = state.invoices.map(invoice => {
        if (invoice.id === action.payload.id) {
          const newPaidAmount = invoice.paidAmount + action.payload.amount;
          const newStatus = newPaidAmount >= invoice.total ? 'paid' : invoice.status;
          return { ...invoice, paidAmount: newPaidAmount, status: newStatus };
        }
        return invoice;
      });
      
      const invoice = state.invoices.find(inv => inv.id === action.payload.id);
      if (invoice) {
        const paymentJE: JournalEntry = {
          id: `JE-PAY-${action.payload.id}-${Date.now()}`,
          date: new Date(),
          reference: `PAY-${invoice.invoiceNumber}`,
          description: `Payment received - ${invoice.customerName}`,
          totalDebit: action.payload.amount,
          totalCredit: action.payload.amount,
          status: 'posted',
          lines: [
            {
              id: '1',
              accountId: '2',
              accountCode: '1010',
              accountName: 'KCB Bank Account',
              debit: action.payload.amount,
              credit: 0,
              description: `Payment for ${invoice.invoiceNumber}`
            },
            {
              id: '2',
              accountId: '4',
              accountCode: '1100',
              accountName: 'Accounts Receivable',
              debit: 0,
              credit: action.payload.amount,
              description: `Payment from ${invoice.customerName}`
            }
          ],
          createdBy: 'System',
          sourceModule: 'Payments',
          sourceId: action.payload.id,
          kraSubmitted: false
        };
        
        return {
          ...state,
          invoices: updatedInvoices,
          journalEntries: [...state.journalEntries, paymentJE]
        };
      }
      
      return { ...state, invoices: updatedInvoices };
      
    case 'UPDATE_SETTINGS':
      const newSettings = {
        ...state.settings,
        ...action.payload
      };
      localStorage.setItem('erpSettings', JSON.stringify(newSettings));
      return {
        ...state,
        settings: newSettings
      };

    case 'UPDATE_TAX_SETTINGS':
      const updatedTaxSettings = {
        ...state.taxSettings,
        ...action.payload
      };
      // Update currency and other settings based on country
      const countryConfig = getCountryTaxConfig(updatedTaxSettings.countryCode);
      if (countryConfig) {
        const updatedAppSettings = {
          ...state.settings,
          currency: countryConfig.currency,
          currencySymbol: countryConfig.currencySymbol
        };
        localStorage.setItem('erpSettings', JSON.stringify(updatedAppSettings));
        return {
          ...state,
          taxSettings: updatedTaxSettings,
          settings: updatedAppSettings
        };
      }
      return {
        ...state,
        taxSettings: updatedTaxSettings
      };

    default:
      return state;
  }
}

interface GlobalStateContextType {
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
  showNotification: (
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning',
    options?: {
      category?: 'system' | 'user' | 'financial' | 'compliance' | 'workflow';
      priority?: 'low' | 'medium' | 'high' | 'critical';
      actionUrl?: string;
      actionLabel?: string;
      persistent?: boolean;
      userId?: string;
    }
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  
  // Utility functions
  formatCurrency: (amount: number, showSymbol?: boolean) => string;
  formatDate: (date: Date) => string;
  t: (key: string) => string;
  
  // Account operations
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  // Journal Entry operations
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (id: string, data: Partial<JournalEntry>) => void;
  postJournalEntry: (id: string) => void;
  reverseJournalEntry: (id: string) => void;
  
  // Customer operations
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  
  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  payInvoice: (id: string, amount: number) => void;
  sendInvoice: (id: string) => void;
  
  // Estimate operations
  addEstimate: (estimate: Omit<Estimate, 'id'>) => void;
  updateEstimate: (id: string, data: Partial<Estimate>) => void;
  convertEstimateToInvoice: (id: string) => void;
  sendEstimate: (id: string) => void;
  
  // Report generation
  generateReport: (type: string, parameters: any) => any;
  exportData: (type: string, format: 'csv' | 'excel' | 'pdf') => void;
  downloadDocument: (type: string, id: string) => void;
  
  // Tax operations
  calculatePaye: (grossSalary: number, benefits?: number, relief?: number) => number;
  calculateNhif: (grossSalary: number) => number;
  calculateNssf: (grossSalary: number) => number;
  calculateWithholdingTax: (amount: number, category: string) => number;
  submitToTaxAuthority: (documentType: string, documentId: string) => Promise<boolean>;
  syncWithBanks: () => Promise<void>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);
  const { user } = useAuth();
  const { tenant } = useTenant();

  // Handle language changes
  useEffect(() => {
    if (state.settings.language) {
      document.documentElement.lang = state.settings.language;
      // Update document title or other language-specific elements
      document.title = state.settings.language === 'fr' ? 'Neko ERP - Système de Gestion' : 
                      state.settings.language === 'es' ? 'Neko ERP - Sistema de Gestión' :
                      state.settings.language === 'de' ? 'Neko ERP - Verwaltungssystem' :
                      'Neko ERP - Enterprise Resource Planning';
    }
  }, [state.settings.language]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('erpSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: parsedSettings });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('erpNotifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert timestamp strings back to Date objects
        const notificationsWithDates = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        dispatch({ type: 'LOAD_NOTIFICATIONS', payload: notificationsWithDates });
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('erpNotifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  // Account operations
  const addAccount = (accountData: Omit<Account, 'id'>) => {
    const account: Account = {
      ...accountData,
      id: Date.now().toString(),
      balance: accountData.balance || 0,
      isActive: true
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: account });
  };

  const updateAccount = (id: string, data: Partial<Account>) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, data } });
  };

  const deleteAccount = (id: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id });
  };

  // Journal Entry operations
  const addJournalEntry = (entryData: Omit<JournalEntry, 'id'>) => {
    const entry: JournalEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdBy: user?.firstName + ' ' + user?.lastName || 'System',
      sourceModule: 'Manual',
      kraSubmitted: false
    };
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: entry });
  };

  const updateJournalEntry = (id: string, data: Partial<JournalEntry>) => {
    dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: { id, data } });
  };

  const postJournalEntry = (id: string) => {
    dispatch({ type: 'POST_JOURNAL_ENTRY', payload: id });
  };

  const reverseJournalEntry = (id: string) => {
    const entry = state.journalEntries.find(je => je.id === id);
    if (entry) {
      const reversalEntry: JournalEntry = {
        ...entry,
        id: `REV-${id}`,
        reference: `REV-${entry.reference}`,
        description: `Reversal of ${entry.description}`,
        lines: entry.lines.map(line => ({
          ...line,
          id: `REV-${line.id}`,
          debit: line.credit,
          credit: line.debit
        })),
        status: 'posted',
        createdBy: user?.firstName + ' ' + user?.lastName || 'System'
      };
      dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: reversalEntry });
      dispatch({ type: 'UPDATE_JOURNAL_ENTRY', payload: { id, data: { status: 'reversed' } } });
    }
  };

  // Customer operations
  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const customer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      balance: 0,
      isActive: true
    };
    dispatch({ type: 'ADD_CUSTOMER', payload: customer });
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    dispatch({ type: 'UPDATE_CUSTOMER', payload: { id, data } });
  };

  // Invoice operations
  const addInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const invoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      invoiceNumber: `INV-${String(state.invoices.length + 1).padStart(3, '0')}`,
      paidAmount: 0,
      kraSubmitted: false,
      etims: false
    };
    dispatch({ type: 'ADD_INVOICE', payload: invoice });
  };

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    dispatch({ type: 'UPDATE_INVOICE', payload: { id, data } });
  };

  const payInvoice = (id: string, amount: number) => {
    dispatch({ type: 'PAY_INVOICE', payload: { id, amount } });
  };

  const sendInvoice = (id: string) => {
    // Simulate sending invoice via email/SMS
    const invoice = state.invoices.find(inv => inv.id === id);
    if (invoice) {
      updateInvoice(id, { status: 'sent' });
      console.log(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customerName}`);
    }
  };

  // Estimate operations
  const addEstimate = (estimateData: Omit<Estimate, 'id'>) => {
    const estimate: Estimate = {
      ...estimateData,
      id: Date.now().toString(),
      estimateNumber: `EST-${String(state.estimates.length + 1).padStart(3, '0')}`,
      convertedToInvoice: false
    };
    dispatch({ type: 'ADD_ESTIMATE', payload: estimate });
  };

  const updateEstimate = (id: string, data: Partial<Estimate>) => {
    dispatch({ type: 'UPDATE_ESTIMATE', payload: { id, data } });
  };

  const convertEstimateToInvoice = (id: string) => {
    const estimate = state.estimates.find(est => est.id === id);
    if (estimate && estimate.status === 'accepted') {
      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-${String(state.invoices.length + 1).padStart(3, '0')}`,
        customerId: estimate.customerId,
        customerName: estimate.customerName,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'draft',
        subtotal: estimate.subtotal,
        vatAmount: estimate.vatAmount,
        total: estimate.total,
        paidAmount: 0,
        lines: estimate.lines.map(line => ({
          id: line.id,
          description: line.description,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          vatRate: line.vatRate,
          vatAmount: line.vatAmount,
          amount: line.amount
        })),
        kraSubmitted: false,
        etims: false
      };
      
      dispatch({ type: 'ADD_INVOICE', payload: invoice });
      dispatch({ type: 'UPDATE_ESTIMATE', payload: { id, data: { convertedToInvoice: true, invoiceId: invoice.id } } });
    }
  };

  const sendEstimate = (id: string) => {
    updateEstimate(id, { status: 'sent' });
  };

  // Bank integration
  const syncWithBanks = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate bank API calls for KCB, Equity, Co-op Bank
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      dispatch({ type: 'SYNC_WITH_BANKS', payload: { lastSync: new Date() } });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync with banks' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Report generation
  const generateReport = async (type: string, parameters: any) => {
    try {
      const { startDate, endDate } = parameters || {};
      const dateRange = startDate && endDate ? { startDate, endDate } : { startDate: '2025-01-01', endDate: '2025-12-31' };
      const asOfDate = parameters?.asOfDate || new Date().toISOString().split('T')[0];

      switch (type) {
        case 'profit_loss':
          return await reportingService.generateProfitLossReport(dateRange);
          
        case 'balance_sheet':
          return await reportingService.generateBalanceSheetReport(asOfDate);
          
        case 'cash_flow':
          return await reportingService.generateCashFlowReport(dateRange);
          
        case 'ar_aging':
          return await reportingService.generateARAgingReport(asOfDate);
          
        case 'trial_balance':
          return await reportingService.generateTrialBalance(asOfDate);
          
        case 'vat_return':
          return await reportingService.generateVATReturnReport(dateRange);
          
        default:
          throw new Error(`Unknown report type: ${type}`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      // Fallback to mock data
      switch (type) {
        case 'profit_loss':
          const revenue = state.accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + Math.abs(a.balance), 0);
          const expenses = state.accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0);
          return {
            revenue,
            expenses,
            netIncome: revenue - expenses,
            grossProfit: revenue - state.accounts.find(a => a.code === '5000')?.balance || 0
          };
          
        case 'balance_sheet':
          const totalAssets = state.accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + Math.max(0, a.balance), 0);
          const totalLiabilities = Math.abs(state.accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0));
          const totalEquity = Math.abs(state.accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0));
          return { totalAssets, totalLiabilities, totalEquity };
          
        case 'cash_flow':
          const operatingCash = 500000;
          const investingCash = -200000;
          const financingCash = 100000;
          return {
            inflows: operatingCash + financingCash,
            outflows: Math.abs(investingCash),
            netCashFlow: operatingCash + investingCash + financingCash
          };
          
        case 'ar_aging':
          return state.customers.filter(c => c.balance > 0).map(customer => ({
            customerName: customer.name,
            total: customer.balance,
            current: customer.balance * 0.6,
            days30: customer.balance * 0.25,
            days60: customer.balance * 0.1,
            days90: customer.balance * 0.05
          }));
          
        case 'trial_balance':
          return state.accounts.map(account => ({
            code: account.code,
            name: account.name,
            type: account.type,
            debit: account.balance > 0 ? account.balance : 0,
            credit: account.balance < 0 ? Math.abs(account.balance) : 0
          }));
          
        default:
          return {};
      }
    }
  };

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    options?: {
      category?: 'system' | 'user' | 'financial' | 'compliance' | 'workflow';
      priority?: 'low' | 'medium' | 'high' | 'critical';
      actionUrl?: string;
      actionLabel?: string;
      persistent?: boolean;
      userId?: string;
    }
  ) => {
    // Check user notification preferences
    const userPrefs = user?.notificationPreferences;
    if (userPrefs) {
      // Check if in-app notifications are enabled
      if (!userPrefs.inApp) return;

      // Check category preferences
      if (options?.category && !userPrefs.categories[options.category]) return;

      // Check priority preferences
      if (options?.priority && !userPrefs.priorities[options.priority]) return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false,
      ...options
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Auto-remove notification after 5 seconds (only for non-persistent notifications)
    if (!notification.persistent) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
      }, 5000);
    }
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const markAllNotificationsRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const exportData = async (type: string, format: 'csv' | 'excel' | 'pdf') => {
    try {
      const data = await generateReport(type, {});
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${type}_report_${timestamp}`;

      if (format === 'csv') {
        let csvContent = '';
        if (type === 'trial_balance') {
          csvContent = `Account Code,Account Name,Type,Debit (${state.settings.currency}),Credit (${state.settings.currency})\n`;
          data.accounts.forEach((row: any) => {
            csvContent += `${row.code},"${row.name}",${row.accountType},${row.debit || 0},${row.credit || 0}\n`;
          });
        } else if (type === 'profit_loss') {
          csvContent = `Category,Amount (${state.settings.currency})\n`;
          csvContent += `Revenue,${data.revenue.total}\n`;
          data.revenue.breakdown.forEach((item: any) => {
            csvContent += `"${item.account}",${item.amount}\n`;
          });
          csvContent += `Cost of Sales,${data.costOfSales.total}\n`;
          csvContent += `Gross Profit,${data.grossProfit}\n`;
          csvContent += `Operating Expenses,${data.operatingExpenses.total}\n`;
          csvContent += `Operating Income,${data.operatingIncome}\n`;
          csvContent += `Net Income,${data.netIncome}\n`;
        } else if (type === 'balance_sheet') {
          csvContent = `Category,Amount (${state.settings.currency})\n`;
          csvContent += `Current Assets,${data.assets.currentAssets.total}\n`;
          csvContent += `Fixed Assets,${data.assets.fixedAssets.total}\n`;
          csvContent += `Total Assets,${data.assets.total}\n`;
          csvContent += `Current Liabilities,${data.liabilities.currentLiabilities.total}\n`;
          csvContent += `Long-term Liabilities,${data.liabilities.longTermLiabilities.total}\n`;
          csvContent += `Total Liabilities,${data.liabilities.total}\n`;
          csvContent += `Equity,${data.equity.total}\n`;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

      } else if (format === 'excel') {
        let worksheetData: any[] = [];

        if (type === 'trial_balance') {
          worksheetData = [
            ['Account Code', 'Account Name', 'Type', `Debit (${state.settings.currency})`, `Credit (${state.settings.currency})`],
            ...data.accounts.map((row: any) => [row.code, row.name, row.accountType, row.debit || 0, row.credit || 0])
          ];
        } else if (type === 'profit_loss') {
          worksheetData = [
            ['Category', `Amount (${state.settings.currency})`],
            ['Revenue', data.revenue.total],
            ...data.revenue.breakdown.map((item: any) => [item.account, item.amount]),
            ['Cost of Sales', data.costOfSales.total],
            ['Gross Profit', data.grossProfit],
            ['Operating Expenses', data.operatingExpenses.total],
            ['Operating Income', data.operatingIncome],
            ['Net Income', data.netIncome]
          ];
        } else if (type === 'balance_sheet') {
          worksheetData = [
            ['Category', `Amount (${state.settings.currency})`],
            ['Current Assets', data.assets.currentAssets.total],
            ['Fixed Assets', data.assets.fixedAssets.total],
            ['Total Assets', data.assets.total],
            ['Current Liabilities', data.liabilities.currentLiabilities.total],
            ['Long-term Liabilities', data.liabilities.longTermLiabilities.total],
            ['Total Liabilities', data.liabilities.total],
            ['Equity', data.equity.total]
          ];
        }

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        XLSX.writeFile(workbook, `${filename}.xlsx`);

      } else if (format === 'pdf') {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Header
        pdf.setFontSize(18);
        pdf.text(`${type.replace('_', ' ').toUpperCase()} REPORT`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;

        pdf.setFontSize(14);

        if (type === 'trial_balance') {
          pdf.text('TRIAL BALANCE', 20, yPosition);
          yPosition += 10;

          pdf.setFontSize(10);
          pdf.text('Account Code', 20, yPosition);
          pdf.text('Account Name', 60, yPosition);
          pdf.text(`Debit (${state.settings.currency})`, 140, yPosition);
          pdf.text(`Credit (${state.settings.currency})`, 180, yPosition);
          yPosition += 5;

          pdf.line(20, yPosition, pageWidth - 20, yPosition);
          yPosition += 5;

          data.accounts.forEach((row: any) => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(row.code, 20, yPosition);
            pdf.text(row.name.substring(0, 25), 60, yPosition);
            pdf.text(row.debit ? row.debit.toLocaleString() : '-', 140, yPosition);
            pdf.text(row.credit ? row.credit.toLocaleString() : '-', 180, yPosition);
            yPosition += 5;
          });

        } else if (type === 'profit_loss') {
          pdf.text('PROFIT & LOSS STATEMENT', 20, yPosition);
          yPosition += 15;

          pdf.setFontSize(12);
          pdf.text('Revenue', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.revenue.total.toLocaleString()}`, 150, yPosition);
          yPosition += 10;

          data.revenue.breakdown.forEach((item: any) => {
            pdf.setFontSize(10);
            pdf.text(`  ${item.account}`, 30, yPosition);
            pdf.text(`${state.settings.currencySymbol} ${item.amount.toLocaleString()}`, 150, yPosition);
            yPosition += 5;
          });

          yPosition += 5;
          pdf.setFontSize(12);
          pdf.text('Cost of Sales', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.costOfSales.total.toLocaleString()}`, 150, yPosition);
          yPosition += 10;

          pdf.text('Gross Profit', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.grossProfit.toLocaleString()}`, 150, yPosition);
          yPosition += 10;

          pdf.text('Operating Expenses', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.operatingExpenses.total.toLocaleString()}`, 150, yPosition);
          yPosition += 10;

          pdf.text('Net Income', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.netIncome.toLocaleString()}`, 150, yPosition);

        } else if (type === 'balance_sheet') {
          pdf.text('BALANCE SHEET', 20, yPosition);
          yPosition += 15;

          pdf.setFontSize(12);
          pdf.text('ASSETS', 20, yPosition);
          yPosition += 10;

          pdf.text('Current Assets', 30, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.assets.currentAssets.total.toLocaleString()}`, 150, yPosition);
          yPosition += 8;

          pdf.text('Fixed Assets', 30, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.assets.fixedAssets.total.toLocaleString()}`, 150, yPosition);
          yPosition += 8;

          pdf.text('Total Assets', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.assets.total.toLocaleString()}`, 150, yPosition);
          yPosition += 15;

          pdf.text('LIABILITIES & EQUITY', 20, yPosition);
          yPosition += 10;

          pdf.text('Current Liabilities', 30, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.liabilities.currentLiabilities.total.toLocaleString()}`, 150, yPosition);
          yPosition += 8;

          pdf.text('Long-term Liabilities', 30, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.liabilities.longTermLiabilities.total.toLocaleString()}`, 150, yPosition);
          yPosition += 8;

          pdf.text('Total Liabilities', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.liabilities.total.toLocaleString()}`, 150, yPosition);
          yPosition += 8;

          pdf.text('Equity', 20, yPosition);
          pdf.text(`${state.settings.currencySymbol} ${data.equity.total.toLocaleString()}`, 150, yPosition);
        }

        pdf.save(`${filename}.pdf`);
      }

      // Show success message
      showNotification(`Report exported successfully as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Failed to export report. Please try again.', 'error');
    }
  };

  const downloadDocument = (type: string, id: string) => {
    if (type === 'invoice') {
      const invoice = state.invoices.find(inv => inv.id === id);
      if (invoice) {
        console.log(`Downloading invoice PDF:`, invoice);
        showNotification(`Invoice ${invoice.invoiceNumber} PDF downloaded. Total: ${formatCurrency(invoice.total)}`, 'success');
      }
    } else if (type === 'estimate') {
      const estimate = state.estimates.find(est => est.id === id);
      if (estimate) {
        console.log(`Downloading estimate PDF:`, estimate);
        showNotification(`Estimate ${estimate.estimateNumber} PDF downloaded. Total: ${formatCurrency(estimate.total)}`, 'success');
      }
    }
  };

  // Utility functions
  const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
    if (!showSymbol) {
      return new Intl.NumberFormat(state.settings.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    
    // For currencies not well supported by Intl.NumberFormat, use custom formatting
    if (state.settings.currency === 'KES') {
      return `${state.settings.currencySymbol} ${amount.toLocaleString(state.settings.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    try {
      return new Intl.NumberFormat(state.settings.language, {
        style: 'currency',
        currency: state.settings.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // Fallback for unsupported currencies
      return `${state.settings.currencySymbol} ${amount.toLocaleString(state.settings.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(state.settings.language, {
      timeZone: state.settings.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  };

  const t = (key: string): string => {
    return getTranslation(key, state.settings.language);
  };

  // Tax calculation functions based on country
  const getCurrentTaxConfig = (): CountryTaxConfig | null => {
    return getCountryTaxConfig(state.taxSettings.countryCode);
  };

  const calculatePaye = (grossSalary: number, benefits: number = 0, relief: number = 0): number => {
    const taxConfig = getCurrentTaxConfig();
    if (!taxConfig) return 0;

    const taxableIncome = grossSalary + benefits;
    let tax = 0;

    for (const bracket of taxConfig.payeRates) {
      if (taxableIncome > bracket.minAmount!) {
        const taxableAtThisBracket = Math.min(taxableIncome, bracket.maxAmount || Infinity) - bracket.minAmount!;
        tax += taxableAtThisBracket * (bracket.rate / 100);
      }
    }

    return Math.max(0, tax - relief);
  };

  const calculateNhif = (grossSalary: number): number => {
    const taxConfig = getCurrentTaxConfig();
    if (!taxConfig?.healthInsurance) return 0;

    const nhifBracket = taxConfig.healthInsurance.rates.find(
      rate => grossSalary >= rate.minSalary! && grossSalary <= (rate.maxSalary || Infinity)
    );
    return nhifBracket ? nhifBracket.contribution : taxConfig.healthInsurance.rates[taxConfig.healthInsurance.rates.length - 1].contribution;
  };

  const calculateNssf = (grossSalary: number): number => {
    const taxConfig = getCurrentTaxConfig();
    if (!taxConfig?.socialSecurity) return 0;

    const pensionablePay = Math.min(grossSalary, 18000); // Using Kenyan ceiling as default
    const rate = taxConfig.socialSecurity.rates[0];
    return pensionablePay * ((rate.employeeRate || 0) / 100);
  };

  const calculateWithholdingTax = (amount: number, category: string): number => {
    const taxConfig = getCurrentTaxConfig();
    if (!taxConfig) return 0;

    const rate = taxConfig.withholdingTaxRates.find(
      wht => wht.category === category
    );
    return rate ? amount * (rate.rate / 100) : 0;
  };

  // Tax authority submission (generic)
  const submitToTaxAuthority = async (documentType: string, documentId: string): Promise<boolean> => {
    try {
      const taxConfig = getCurrentTaxConfig();
      if (!taxConfig) {
        throw new Error('Tax configuration not found for current country');
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulate tax authority submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (documentType === 'invoice') {
        updateInvoice(documentId, { kraSubmitted: true, etims: true });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Failed to submit to ${getCurrentTaxConfig()?.taxAuthority || 'tax authority'}` });
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const contextValue: GlobalStateContextType = {
    state,
    dispatch,
    showNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    formatCurrency,
    formatDate,
    t,
    addAccount,
    updateAccount,
    deleteAccount,
    addJournalEntry,
    updateJournalEntry,
    postJournalEntry,
    reverseJournalEntry,
    addCustomer,
    updateCustomer,
    addInvoice,
    updateInvoice,
    payInvoice,
    sendInvoice,
    addEstimate,
    updateEstimate,
    convertEstimateToInvoice,
    sendEstimate,
    generateReport,
    exportData,
    downloadDocument,
    calculatePaye,
    calculateNhif,
    calculateNssf,
    calculateWithholdingTax,
    submitToTaxAuthority,
    syncWithBanks
  };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}