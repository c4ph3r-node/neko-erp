import { supabase } from '../lib/supabase';
import { databaseService } from './database.service';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface InvoiceWorkflowResult {
  invoice: any;
  journalEntry: any;
  customerBalance: number;
}

interface PaymentWorkflowResult {
  payment: any;
  journalEntry: any;
  allocations: any[];
  updatedInvoices: any[];
}

interface PayrollWorkflowResult {
  payrollRun: any;
  payrollEntries: any[];
  journalEntry: any;
  taxLiabilities: {
    paye: number;
    nssf: number;
    nhif: number;
  };
}

class WorkflowService {
  private async getNextSequenceNumber(prefix: string): Promise<string> {
    const { data, error } = await supabase
      .from(prefix === 'INV' ? 'invoices' : prefix === 'PAY' ? 'payments' : 'journal_entries')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    const count = data?.length || 0;
    const nextNumber = count + 1;
    return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
  }

  async createInvoiceWithAccounting(invoiceData: {
    customer_id: string;
    issue_date: string;
    due_date: string;
    lines: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      tax_rate: number;
    }>;
    notes?: string;
    terms?: string;
  }): Promise<InvoiceWorkflowResult> {
    const invoiceNumber = await this.getNextSequenceNumber('INV');

    const subtotal = invoiceData.lines.reduce((sum, line) => {
      return sum + (line.quantity * line.unit_price);
    }, 0);

    const taxAmount = invoiceData.lines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.unit_price;
      return sum + (lineTotal * (line.tax_rate / 100));
    }, 0);

    const total = subtotal + taxAmount;

    const invoice = {
      tenant_id: TENANT_ID,
      invoice_number: invoiceNumber,
      customer_id: invoiceData.customer_id,
      issue_date: invoiceData.issue_date,
      due_date: invoiceData.due_date,
      status: 'draft',
      subtotal: subtotal,
      tax_amount: taxAmount,
      discount_amount: 0,
      total: total,
      paid_amount: 0,
      balance: total,
      currency: 'KES',
      notes: invoiceData.notes || '',
      terms: invoiceData.terms || 'Payment due within 30 days'
    };

    const { data: createdInvoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    const invoiceLines = invoiceData.lines.map((line, index) => ({
      invoice_id: createdInvoice.id,
      line_number: index + 1,
      description: line.description,
      quantity: line.quantity,
      unit_price: line.unit_price,
      discount_percentage: 0,
      tax_rate: line.tax_rate,
      line_total: line.quantity * line.unit_price
    }));

    const { error: linesError } = await supabase
      .from('invoice_lines')
      .insert(invoiceLines);

    if (linesError) throw linesError;

    const arAccountId = await this.getAccountByCode('1100');
    const revenueAccountId = await this.getAccountByCode('4000');
    const vatOutputAccountId = await this.getAccountByCode('2100');

    const journalEntryNumber = await this.getNextSequenceNumber('JE');

    const journalEntry = {
      tenant_id: TENANT_ID,
      entry_number: journalEntryNumber,
      entry_date: invoiceData.issue_date,
      reference: invoiceNumber,
      description: `Sales Invoice - ${invoiceNumber}`,
      status: 'posted',
      total_debit: total,
      total_credit: total,
      posted_at: new Date().toISOString()
    };

    const { data: createdJE, error: jeError } = await supabase
      .from('journal_entries')
      .insert([journalEntry])
      .select()
      .single();

    if (jeError) throw jeError;

    const journalLines = [
      {
        journal_entry_id: createdJE.id,
        account_id: arAccountId,
        description: `Invoice ${invoiceNumber}`,
        debit: total,
        credit: 0,
        line_number: 1
      },
      {
        journal_entry_id: createdJE.id,
        account_id: revenueAccountId,
        description: 'Revenue recognition',
        debit: 0,
        credit: subtotal,
        line_number: 2
      },
      {
        journal_entry_id: createdJE.id,
        account_id: vatOutputAccountId,
        description: '16% VAT on sales',
        debit: 0,
        credit: taxAmount,
        line_number: 3
      }
    ];

    const { error: linesJEError } = await supabase
      .from('journal_entry_lines')
      .insert(journalLines);

    if (linesJEError) throw linesJEError;

    await supabase
      .from('invoices')
      .update({ journal_entry_id: createdJE.id })
      .eq('id', createdInvoice.id);

    const { data: customer } = await supabase
      .from('customers')
      .select('current_balance')
      .eq('id', invoiceData.customer_id)
      .single();

    const newBalance = (customer?.current_balance || 0) + total;

    await supabase
      .from('customers')
      .update({
        current_balance: newBalance,
        last_transaction_date: invoiceData.issue_date
      })
      .eq('id', invoiceData.customer_id);

    await this.updateAccountBalance(arAccountId, total);
    await this.updateAccountBalance(revenueAccountId, -subtotal);
    await this.updateAccountBalance(vatOutputAccountId, -taxAmount);

    return {
      invoice: createdInvoice,
      journalEntry: createdJE,
      customerBalance: newBalance
    };
  }

  async processCustomerPayment(paymentData: {
    customer_id: string;
    amount: number;
    payment_date: string;
    payment_method: string;
    reference_number?: string;
    invoice_allocations: Array<{
      invoice_id: string;
      amount: number;
    }>;
  }): Promise<PaymentWorkflowResult> {
    const paymentNumber = await this.getNextSequenceNumber('PAY');

    const payment = {
      tenant_id: TENANT_ID,
      payment_number: paymentNumber,
      payment_date: paymentData.payment_date,
      payment_type: 'customer',
      customer_id: paymentData.customer_id,
      amount: paymentData.amount,
      payment_method: paymentData.payment_method,
      reference_number: paymentData.reference_number || ''
    };

    const { data: createdPayment, error: paymentError } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();

    if (paymentError) throw paymentError;

    const allocations = [];
    const updatedInvoices = [];

    for (const allocation of paymentData.invoice_allocations) {
      const { data: alloc, error: allocError } = await supabase
        .from('payment_allocations')
        .insert([{
          payment_id: createdPayment.id,
          invoice_id: allocation.invoice_id,
          allocated_amount: allocation.amount
        }])
        .select()
        .single();

      if (allocError) throw allocError;
      allocations.push(alloc);

      const { data: invoice } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', allocation.invoice_id)
        .single();

      if (invoice) {
        const newPaidAmount = (invoice.paid_amount || 0) + allocation.amount;
        const newBalance = invoice.total - newPaidAmount;
        const newStatus = newBalance <= 0 ? 'paid' : 'partially_paid';

        await supabase
          .from('invoices')
          .update({
            paid_amount: newPaidAmount,
            balance: newBalance,
            status: newStatus,
            paid_at: newBalance <= 0 ? paymentData.payment_date : null
          })
          .eq('id', allocation.invoice_id);

        updatedInvoices.push({
          ...invoice,
          paid_amount: newPaidAmount,
          balance: newBalance,
          status: newStatus
        });
      }
    }

    const cashAccountId = await this.getAccountByCode('1000');
    const arAccountId = await this.getAccountByCode('1100');

    const journalEntryNumber = await this.getNextSequenceNumber('JE');

    const journalEntry = {
      tenant_id: TENANT_ID,
      entry_number: journalEntryNumber,
      entry_date: paymentData.payment_date,
      reference: paymentNumber,
      description: `Customer Payment - ${paymentNumber}`,
      status: 'posted',
      total_debit: paymentData.amount,
      total_credit: paymentData.amount,
      posted_at: new Date().toISOString()
    };

    const { data: createdJE, error: jeError } = await supabase
      .from('journal_entries')
      .insert([journalEntry])
      .select()
      .single();

    if (jeError) throw jeError;

    const journalLines = [
      {
        journal_entry_id: createdJE.id,
        account_id: cashAccountId,
        description: `Payment received - ${paymentNumber}`,
        debit: paymentData.amount,
        credit: 0,
        line_number: 1
      },
      {
        journal_entry_id: createdJE.id,
        account_id: arAccountId,
        description: 'Payment against receivables',
        debit: 0,
        credit: paymentData.amount,
        line_number: 2
      }
    ];

    await supabase
      .from('journal_entry_lines')
      .insert(journalLines);

    await supabase
      .from('payments')
      .update({ journal_entry_id: createdJE.id })
      .eq('id', createdPayment.id);

    const { data: customer } = await supabase
      .from('customers')
      .select('current_balance')
      .eq('id', paymentData.customer_id)
      .single();

    const newBalance = (customer?.current_balance || 0) - paymentData.amount;

    await supabase
      .from('customers')
      .update({
        current_balance: newBalance,
        last_transaction_date: paymentData.payment_date
      })
      .eq('id', paymentData.customer_id);

    await this.updateAccountBalance(cashAccountId, paymentData.amount);
    await this.updateAccountBalance(arAccountId, -paymentData.amount);

    return {
      payment: createdPayment,
      journalEntry: createdJE,
      allocations,
      updatedInvoices
    };
  }

  async processPayrollRun(payrollData: {
    pay_period_start: string;
    pay_period_end: string;
    pay_date: string;
    employee_ids?: string[];
  }): Promise<PayrollWorkflowResult> {
    const { data: employees } = await supabase
      .from('employees')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .eq('status', 'active')
      .in('id', payrollData.employee_ids || []);

    if (!employees || employees.length === 0) {
      throw new Error('No active employees found');
    }

    const payrollRun = {
      tenant_id: TENANT_ID,
      pay_period_start: payrollData.pay_period_start,
      pay_period_end: payrollData.pay_period_end,
      pay_date: payrollData.pay_date,
      status: 'processing',
      employee_count: employees.length
    };

    const { data: createdPayrollRun, error: prError } = await supabase
      .from('payroll_runs')
      .insert([payrollRun])
      .select()
      .single();

    if (prError) throw prError;

    let totalGross = 0;
    let totalPaye = 0;
    let totalNssf = 0;
    let totalNhif = 0;
    let totalNet = 0;

    const payrollEntries = [];

    for (const employee of employees) {
      const grossPay = employee.salary || 0;
      const paye = await databaseService.calculatePayeTax(grossPay);
      const nssf = await databaseService.calculateNSSF(grossPay);
      const nhif = await databaseService.calculateNHIF(grossPay);
      const netPay = grossPay - paye - nssf - nhif;

      const entry = {
        payroll_run_id: createdPayrollRun.id,
        employee_id: employee.id,
        gross_pay: grossPay,
        basic_pay: grossPay,
        allowances: 0,
        overtime_pay: 0,
        deductions: paye + nssf + nhif,
        paye: paye,
        nssf: nssf,
        nhif: nhif,
        other_deductions: 0,
        net_pay: netPay,
        hours_worked: 176,
        overtime_hours: 0
      };

      payrollEntries.push(entry);

      totalGross += grossPay;
      totalPaye += paye;
      totalNssf += nssf;
      totalNhif += nhif;
      totalNet += netPay;
    }

    const { error: entriesError } = await supabase
      .from('payroll_entries')
      .insert(payrollEntries);

    if (entriesError) throw entriesError;

    await supabase
      .from('payroll_runs')
      .update({
        total_gross: totalGross,
        total_deductions: totalPaye + totalNssf + totalNhif,
        total_paye: totalPaye,
        total_nssf: totalNssf,
        total_nhif: totalNhif,
        total_net: totalNet,
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('id', createdPayrollRun.id);

    const salaryExpenseAccountId = await this.getAccountByCode('6000');
    const payePayableAccountId = await this.getAccountByCode('2200');
    const nssfPayableAccountId = await this.getAccountByCode('2210');
    const nhifPayableAccountId = await this.getAccountByCode('2220');
    const cashAccountId = await this.getAccountByCode('1000');

    const journalEntryNumber = await this.getNextSequenceNumber('JE');

    const journalEntry = {
      tenant_id: TENANT_ID,
      entry_number: journalEntryNumber,
      entry_date: payrollData.pay_date,
      reference: `PAYROLL-${payrollData.pay_period_start}`,
      description: `Payroll for period ${payrollData.pay_period_start} to ${payrollData.pay_period_end}`,
      status: 'posted',
      total_debit: totalGross,
      total_credit: totalGross,
      posted_at: new Date().toISOString()
    };

    const { data: createdJE, error: jeError } = await supabase
      .from('journal_entries')
      .insert([journalEntry])
      .select()
      .single();

    if (jeError) throw jeError;

    const journalLines = [
      {
        journal_entry_id: createdJE.id,
        account_id: salaryExpenseAccountId,
        description: 'Gross salaries',
        debit: totalGross,
        credit: 0,
        line_number: 1
      },
      {
        journal_entry_id: createdJE.id,
        account_id: payePayableAccountId,
        description: 'PAYE withholding',
        debit: 0,
        credit: totalPaye,
        line_number: 2
      },
      {
        journal_entry_id: createdJE.id,
        account_id: nssfPayableAccountId,
        description: 'NSSF contributions',
        debit: 0,
        credit: totalNssf,
        line_number: 3
      },
      {
        journal_entry_id: createdJE.id,
        account_id: nhifPayableAccountId,
        description: 'NHIF contributions',
        debit: 0,
        credit: totalNhif,
        line_number: 4
      },
      {
        journal_entry_id: createdJE.id,
        account_id: cashAccountId,
        description: 'Net salary payments',
        debit: 0,
        credit: totalNet,
        line_number: 5
      }
    ];

    await supabase
      .from('journal_entry_lines')
      .insert(journalLines);

    await supabase
      .from('payroll_runs')
      .update({ journal_entry_id: createdJE.id })
      .eq('id', createdPayrollRun.id);

    await this.updateAccountBalance(salaryExpenseAccountId, totalGross);
    await this.updateAccountBalance(payePayableAccountId, -totalPaye);
    await this.updateAccountBalance(nssfPayableAccountId, -totalNssf);
    await this.updateAccountBalance(nhifPayableAccountId, -totalNhif);
    await this.updateAccountBalance(cashAccountId, -totalNet);

    return {
      payrollRun: createdPayrollRun,
      payrollEntries,
      journalEntry: createdJE,
      taxLiabilities: {
        paye: totalPaye,
        nssf: totalNssf,
        nhif: totalNhif
      }
    };
  }

  async createPurchaseWithAccounting(purchaseData: {
    vendor_id: string;
    purchase_date: string;
    lines: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      account_code: string;
    }>;
    reference?: string;
  }): Promise<any> {
    const subtotal = purchaseData.lines.reduce((sum, line) => {
      return sum + (line.quantity * line.unit_price);
    }, 0);

    const vatAmount = subtotal * 0.16;
    const total = subtotal + vatAmount;

    const apAccountId = await this.getAccountByCode('2000');
    const vatInputAccountId = await this.getAccountByCode('1310');

    const journalEntryNumber = await this.getNextSequenceNumber('JE');

    const journalEntry = {
      tenant_id: TENANT_ID,
      entry_number: journalEntryNumber,
      entry_date: purchaseData.purchase_date,
      reference: purchaseData.reference || 'PURCHASE',
      description: `Purchase from vendor`,
      status: 'posted',
      total_debit: total,
      total_credit: total,
      posted_at: new Date().toISOString()
    };

    const { data: createdJE, error: jeError } = await supabase
      .from('journal_entries')
      .insert([journalEntry])
      .select()
      .single();

    if (jeError) throw jeError;

    const journalLines = [];
    let lineNumber = 1;

    for (const line of purchaseData.lines) {
      const accountId = await this.getAccountByCode(line.account_code);
      const lineTotal = line.quantity * line.unit_price;

      journalLines.push({
        journal_entry_id: createdJE.id,
        account_id: accountId,
        description: line.description,
        debit: lineTotal,
        credit: 0,
        line_number: lineNumber++
      });

      await this.updateAccountBalance(accountId, lineTotal);
    }

    journalLines.push({
      journal_entry_id: createdJE.id,
      account_id: vatInputAccountId,
      description: '16% VAT on purchases',
      debit: vatAmount,
      credit: 0,
      line_number: lineNumber++
    });

    journalLines.push({
      journal_entry_id: createdJE.id,
      account_id: apAccountId,
      description: 'Accounts payable',
      debit: 0,
      credit: total,
      line_number: lineNumber
    });

    await supabase
      .from('journal_entry_lines')
      .insert(journalLines);

    await this.updateAccountBalance(vatInputAccountId, vatAmount);
    await this.updateAccountBalance(apAccountId, -total);

    const { data: vendor } = await supabase
      .from('vendors')
      .select('current_balance')
      .eq('id', purchaseData.vendor_id)
      .single();

    const newBalance = (vendor?.current_balance || 0) - total;

    await supabase
      .from('vendors')
      .update({
        current_balance: newBalance,
        last_transaction_date: purchaseData.purchase_date
      })
      .eq('id', purchaseData.vendor_id);

    return {
      journalEntry: createdJE,
      total,
      vendorBalance: newBalance
    };
  }

  private async getAccountByCode(code: string): Promise<string> {
    const { data, error } = await supabase
      .from('chart_of_accounts')
      .select('id')
      .eq('tenant_id', TENANT_ID)
      .eq('code', code)
      .single();

    if (error || !data) throw new Error(`Account with code ${code} not found`);
    return data.id;
  }

  private async updateAccountBalance(accountId: string, amount: number): Promise<void> {
    const { data: account } = await supabase
      .from('chart_of_accounts')
      .select('balance, account_type')
      .eq('id', accountId)
      .single();

    if (!account) return;

    let newBalance = account.balance || 0;

    if (['Asset', 'Expense'].includes(account.account_type)) {
      newBalance += amount;
    } else {
      newBalance -= amount;
    }

    await supabase
      .from('chart_of_accounts')
      .update({ balance: newBalance })
      .eq('id', accountId);
  }
}

export const workflowService = new WorkflowService();
