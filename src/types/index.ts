// Core Types for ERP Platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'accountant' | 'business_owner' | 'employee' | 'viewer';
  tenantId: string;
  avatar?: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  language: string;
  timezone: string;
}

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  subdomain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  settings: TenantSettings;
  isActive: boolean;
  createdAt: Date;
  subscriptionEnds?: Date;
}

export interface TenantSettings {
  currency: string;
  dateFormat: string;
  language: string;
  timezone: string;
  fiscalYearStart: string;
  taxSettings: TaxSettings;
  features: string[];
}

export interface TaxSettings {
  vatEnabled: boolean;
  vatRate: number;
  taxNumber?: string;
  withholdingTaxEnabled: boolean;
}

// Financial Types
export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subType: string;
  parentId?: string;
  balance: number;
  isActive: boolean;
  description?: string;
  taxCode?: string;
}

export interface JournalEntry {
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
  attachments?: string[];
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
  reference?: string;
}

// Customer & Vendor Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: Address;
  contactPerson?: string;
  creditLimit: number;
  paymentTerms: number; // days
  taxNumber?: string;
  currency: string;
  priceLevel?: string;
  isActive: boolean;
  balance: number;
  createdAt: Date;
  lastTransaction?: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: Address;
  contactPerson?: string;
  paymentTerms: number;
  taxNumber?: string;
  currency: string;
  isActive: boolean;
  balance: number;
  createdAt: Date;
  lastTransaction?: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  currency: string;
  lines: InvoiceLine[];
  notes?: string;
  terms?: string;
  recurring?: RecurringSettings;
  createdBy: string;
  sentAt?: Date;
  paidAt?: Date;
}

export interface InvoiceLine {
  id: string;
  itemId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  amount: number;
}

export interface RecurringSettings {
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number;
  endDate?: Date;
  nextDate: Date;
}

// Inventory Types
export interface Item {
  id: string;
  sku: string;
  name: string;
  description?: string;
  type: 'inventory' | 'service' | 'non_inventory';
  category: string;
  unitOfMeasure: string;
  costPrice: number;
  sellingPrice: number;
  taxRate: number;
  reorderLevel: number;
  reorderQuantity: number;
  isActive: boolean;
  trackInventory: boolean;
  serialTracking: boolean;
  batchTracking: boolean;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  warehouseId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  unitCost: number;
  totalCost: number;
  reference: string;
  date: Date;
  notes?: string;
  batchNumber?: string;
  serialNumbers?: string[];
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: Address;
  isActive: boolean;
  isDefault: boolean;
}

// Banking Types
export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'loan';
  currency: string;
  balance: number;
  isActive: boolean;
  isDefault: boolean;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: Date;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  status: 'cleared' | 'pending' | 'reconciled';
  category?: string;
  isReconciled: boolean;
  reconciledAt?: Date;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  customerId: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  budget: number;
  actualCost: number;
  billingType: 'fixed' | 'time_and_materials' | 'milestone';
  hourlyRate?: number;
  managerId: string;
  isActive: boolean;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  employeeId: string;
  taskId?: string;
  date: Date;
  hours: number;
  description: string;
  hourlyRate: number;
  billable: boolean;
  invoiced: boolean;
  approved: boolean;
}

// Employee & Payroll Types
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: Address;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
  payFrequency: 'weekly' | 'bi_weekly' | 'monthly';
  taxId: string;
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  isActive: boolean;
  managerId?: string;
}

export interface PayrollRun {
  id: string;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  payDate: Date;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  entries: PayrollEntry[];
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  grossPay: number;
  deductions: PayrollDeduction[];
  netPay: number;
  hoursWorked: number;
  overtimeHours: number;
}

export interface PayrollDeduction {
  type: 'tax' | 'insurance' | 'retirement' | 'other';
  name: string;
  amount: number;
  isEmployerContribution: boolean;
}

// Asset Types
export interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  category: string;
  description?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: 'straight_line' | 'declining_balance' | 'units_of_production';
  usefulLife: number; // years
  salvageValue: number;
  location: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'active' | 'disposed' | 'sold' | 'retired';
  serialNumber?: string;
  barcode?: string;
  warrantyExpiry?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
}

// Report Types
export interface ReportConfig {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  schedule?: ReportSchedule;
  recipients?: string[];
  format: 'pdf' | 'excel' | 'csv';
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
}

// Workflow Types
export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  triggerType: 'manual' | 'automatic';
  triggerConditions?: Record<string, any>;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'action' | 'condition';
  assigneeType: 'user' | 'role' | 'manager';
  assignee?: string;
  conditions?: Record<string, any>;
  actions?: Record<string, any>;
  order: number;
}

export interface WorkflowInstance {
  id: string;
  templateId: string;
  entityType: string;
  entityId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  currentStep: number;
  initiatedBy: string;
  initiatedAt: Date;
  completedAt?: Date;
  steps: WorkflowStepInstance[];
}

export interface WorkflowStepInstance {
  id: string;
  stepId: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  assignedTo: string;
  completedBy?: string;
  completedAt?: Date;
  comments?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Audit Types
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  tenantId: string;
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: Record<string, any>;
  permissions: string[];
}

export interface DashboardLayout {
  id: string;
  userId: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
}