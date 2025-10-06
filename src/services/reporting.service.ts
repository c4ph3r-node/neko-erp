import { supabase } from '../lib/supabase';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ProfitLossReport {
  period: DateRange;
  revenue: {
    total: number;
    breakdown: Array<{ account: string; amount: number }>;
  };
  costOfSales: {
    total: number;
    breakdown: Array<{ account: string; amount: number }>;
  };
  grossProfit: number;
  grossMargin: number;
  operatingExpenses: {
    total: number;
    breakdown: Array<{ category: string; amount: number }>;
  };
  operatingIncome: number;
  operatingMargin: number;
  otherIncome: number;
  otherExpenses: number;
  netIncome: number;
  netMargin: number;
}

interface BalanceSheetReport {
  asOfDate: string;
  assets: {
    currentAssets: {
      total: number;
      breakdown: Array<{ account: string; balance: number }>;
    };
    fixedAssets: {
      total: number;
      breakdown: Array<{ account: string; balance: number }>;
    };
    total: number;
  };
  liabilities: {
    currentLiabilities: {
      total: number;
      breakdown: Array<{ account: string; balance: number }>;
    };
    longTermLiabilities: {
      total: number;
      breakdown: Array<{ account: string; balance: number }>;
    };
    total: number;
  };
  equity: {
    total: number;
    breakdown: Array<{ account: string; balance: number }>;
  };
  totalLiabilitiesAndEquity: number;
}

interface CashFlowReport {
  period: DateRange;
  operatingActivities: {
    netIncome: number;
    adjustments: Array<{ item: string; amount: number }>;
    changeInAR: number;
    changeInAP: number;
    changeInInventory: number;
    total: number;
  };
  investingActivities: {
    assetPurchases: number;
    assetSales: number;
    total: number;
  };
  financingActivities: {
    loanProceeds: number;
    loanRepayments: number;
    dividends: number;
    total: number;
  };
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

interface ARAgingReport {
  asOfDate: string;
  customers: Array<{
    customerName: string;
    totalBalance: number;
    current: number;
    days1_30: number;
    days31_60: number;
    days61_90: number;
    over90: number;
  }>;
  totals: {
    totalBalance: number;
    current: number;
    days1_30: number;
    days31_60: number;
    days61_90: number;
    over90: number;
  };
}

interface VATReturnReport {
  period: DateRange;
  outputVAT: {
    totalSales: number;
    vatOnSales: number;
    breakdown: Array<{ description: string; sales: number; vat: number }>;
  };
  inputVAT: {
    totalPurchases: number;
    vatOnPurchases: number;
    breakdown: Array<{ description: string; purchases: number; vat: number }>;
  };
  netVAT: number;
  withholdingVAT: number;
  vatPayable: number;
  paymentDueDate: string;
}

class ReportingService {
  async generateProfitLossReport(dateRange: DateRange): Promise<ProfitLossReport> {
    const { data: accounts } = await supabase
      .from('chart_of_accounts')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .in('account_type', ['Revenue', 'Expense']);

    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select(`
        *,
        journal_entry_lines(
          *,
          account:chart_of_accounts(*)
        )
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('status', 'posted')
      .gte('entry_date', dateRange.startDate)
      .lte('entry_date', dateRange.endDate);

    const revenueAccounts = accounts?.filter(a => a.account_type === 'Revenue') || [];
    const expenseAccounts = accounts?.filter(a => a.account_type === 'Expense') || [];

    const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance || 0), 0);
    const revenueBreakdown = revenueAccounts.map(acc => ({
      account: `${acc.code} - ${acc.name}`,
      amount: Math.abs(acc.balance || 0)
    }));

    const costOfSalesAccounts = expenseAccounts.filter(a => a.account_subtype === 'Cost of Sales');
    const totalCostOfSales = costOfSalesAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const cosBreakdown = costOfSalesAccounts.map(acc => ({
      account: `${acc.code} - ${acc.name}`,
      amount: acc.balance || 0
    }));

    const operatingExpenseAccounts = expenseAccounts.filter(a => a.account_subtype === 'Operating Expense');
    const totalOperatingExpenses = operatingExpenseAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    const expensesByCategory = operatingExpenseAccounts.reduce((acc: any, account) => {
      const category = account.name.split(' ')[0];
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += account.balance || 0;
      return acc;
    }, {});

    const opexBreakdown = Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount: amount as number
    }));

    const grossProfit = totalRevenue - totalCostOfSales;
    const operatingIncome = grossProfit - totalOperatingExpenses;
    const netIncome = operatingIncome;

    return {
      period: dateRange,
      revenue: {
        total: totalRevenue,
        breakdown: revenueBreakdown
      },
      costOfSales: {
        total: totalCostOfSales,
        breakdown: cosBreakdown
      },
      grossProfit,
      grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
      operatingExpenses: {
        total: totalOperatingExpenses,
        breakdown: opexBreakdown
      },
      operatingIncome,
      operatingMargin: totalRevenue > 0 ? (operatingIncome / totalRevenue) * 100 : 0,
      otherIncome: 0,
      otherExpenses: 0,
      netIncome,
      netMargin: totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0
    };
  }

  async generateBalanceSheetReport(asOfDate: string): Promise<BalanceSheetReport> {
    const { data: accounts } = await supabase
      .from('chart_of_accounts')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .eq('is_active', true);

    const assets = accounts?.filter(a => a.account_type === 'Asset') || [];
    const liabilities = accounts?.filter(a => a.account_type === 'Liability') || [];
    const equity = accounts?.filter(a => a.account_type === 'Equity') || [];

    const currentAssets = assets.filter(a => a.account_subtype === 'Current Asset');
    const fixedAssets = assets.filter(a => a.account_subtype === 'Fixed Asset');

    const currentLiabilities = liabilities.filter(a => a.account_subtype === 'Current Liability');
    const longTermLiabilities = liabilities.filter(a => a.account_subtype === 'Long-term Liability');

    const totalCurrentAssets = currentAssets.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const totalFixedAssets = fixedAssets.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const totalCurrentLiabilities = Math.abs(currentLiabilities.reduce((sum, acc) => sum + (acc.balance || 0), 0));
    const totalLongTermLiabilities = Math.abs(longTermLiabilities.reduce((sum, acc) => sum + (acc.balance || 0), 0));
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

    const totalEquity = Math.abs(equity.reduce((sum, acc) => sum + (acc.balance || 0), 0));

    return {
      asOfDate,
      assets: {
        currentAssets: {
          total: totalCurrentAssets,
          breakdown: currentAssets.map(acc => ({
            account: `${acc.code} - ${acc.name}`,
            balance: acc.balance || 0
          }))
        },
        fixedAssets: {
          total: totalFixedAssets,
          breakdown: fixedAssets.map(acc => ({
            account: `${acc.code} - ${acc.name}`,
            balance: acc.balance || 0
          }))
        },
        total: totalAssets
      },
      liabilities: {
        currentLiabilities: {
          total: totalCurrentLiabilities,
          breakdown: currentLiabilities.map(acc => ({
            account: `${acc.code} - ${acc.name}`,
            balance: Math.abs(acc.balance || 0)
          }))
        },
        longTermLiabilities: {
          total: totalLongTermLiabilities,
          breakdown: longTermLiabilities.map(acc => ({
            account: `${acc.code} - ${acc.name}`,
            balance: Math.abs(acc.balance || 0)
          }))
        },
        total: totalLiabilities
      },
      equity: {
        total: totalEquity,
        breakdown: equity.map(acc => ({
          account: `${acc.code} - ${acc.name}`,
          balance: Math.abs(acc.balance || 0)
        }))
      },
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity
    };
  }

  async generateCashFlowReport(dateRange: DateRange): Promise<CashFlowReport> {
    const plReport = await this.generateProfitLossReport(dateRange);

    const { data: arAccount } = await supabase
      .from('chart_of_accounts')
      .select('balance')
      .eq('tenant_id', TENANT_ID)
      .eq('code', '1100')
      .single();

    const { data: apAccount } = await supabase
      .from('chart_of_accounts')
      .select('balance')
      .eq('tenant_id', TENANT_ID)
      .eq('code', '2000')
      .single();

    const { data: inventoryAccounts } = await supabase
      .from('chart_of_accounts')
      .select('balance')
      .eq('tenant_id', TENANT_ID)
      .like('code', '12%');

    const changeInAR = -(arAccount?.balance || 0);
    const changeInAP = apAccount?.balance || 0;
    const changeInInventory = -(inventoryAccounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0);

    const operatingCashFlow = plReport.netIncome + changeInAR + changeInAP + changeInInventory;

    const { data: cashAccount } = await supabase
      .from('chart_of_accounts')
      .select('balance')
      .eq('tenant_id', TENANT_ID)
      .eq('code', '1000')
      .single();

    return {
      period: dateRange,
      operatingActivities: {
        netIncome: plReport.netIncome,
        adjustments: [
          { item: 'Depreciation', amount: 0 }
        ],
        changeInAR,
        changeInAP,
        changeInInventory,
        total: operatingCashFlow
      },
      investingActivities: {
        assetPurchases: 0,
        assetSales: 0,
        total: 0
      },
      financingActivities: {
        loanProceeds: 0,
        loanRepayments: 0,
        dividends: 0,
        total: 0
      },
      netCashFlow: operatingCashFlow,
      beginningCash: (cashAccount?.balance || 0) - operatingCashFlow,
      endingCash: cashAccount?.balance || 0
    };
  }

  async generateARAgingReport(asOfDate: string): Promise<ARAgingReport> {
    const { data: invoices } = await supabase
      .from('invoices')
      .select(`
        *,
        customer:customers(id, name)
      `)
      .eq('tenant_id', TENANT_ID)
      .in('status', ['sent', 'partially_paid', 'overdue'])
      .lte('issue_date', asOfDate);

    const customerAging = new Map<string, any>();

    const today = new Date(asOfDate);

    invoices?.forEach(invoice => {
      const customerName = invoice.customer?.name || 'Unknown';
      const balance = invoice.balance || 0;
      const issueDate = new Date(invoice.issue_date);
      const daysOverdue = Math.floor((today.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (!customerAging.has(customerName)) {
        customerAging.set(customerName, {
          customerName,
          totalBalance: 0,
          current: 0,
          days1_30: 0,
          days31_60: 0,
          days61_90: 0,
          over90: 0
        });
      }

      const aging = customerAging.get(customerName);
      aging.totalBalance += balance;

      if (daysOverdue <= 0) {
        aging.current += balance;
      } else if (daysOverdue <= 30) {
        aging.days1_30 += balance;
      } else if (daysOverdue <= 60) {
        aging.days31_60 += balance;
      } else if (daysOverdue <= 90) {
        aging.days61_90 += balance;
      } else {
        aging.over90 += balance;
      }
    });

    const customers = Array.from(customerAging.values());

    const totals = customers.reduce((acc, customer) => ({
      totalBalance: acc.totalBalance + customer.totalBalance,
      current: acc.current + customer.current,
      days1_30: acc.days1_30 + customer.days1_30,
      days31_60: acc.days31_60 + customer.days31_60,
      days61_90: acc.days61_90 + customer.days61_90,
      over90: acc.over90 + customer.over90
    }), {
      totalBalance: 0,
      current: 0,
      days1_30: 0,
      days31_60: 0,
      days61_90: 0,
      over90: 0
    });

    return {
      asOfDate,
      customers,
      totals
    };
  }

  async generateVATReturnReport(dateRange: DateRange): Promise<VATReturnReport> {
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .in('status', ['sent', 'partially_paid', 'paid'])
      .gte('issue_date', dateRange.startDate)
      .lte('issue_date', dateRange.endDate);

    const { data: journalEntries } = await supabase
      .from('journal_entries')
      .select(`
        *,
        journal_entry_lines(
          *,
          account:chart_of_accounts(code, name)
        )
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('status', 'posted')
      .gte('entry_date', dateRange.startDate)
      .lte('entry_date', dateRange.endDate);

    const totalSales = invoices?.reduce((sum, inv) => sum + (inv.subtotal || 0), 0) || 0;
    const vatOnSales = invoices?.reduce((sum, inv) => sum + (inv.tax_amount || 0), 0) || 0;

    let totalPurchases = 0;
    let vatOnPurchases = 0;

    journalEntries?.forEach(je => {
      je.journal_entry_lines?.forEach((line: any) => {
        if (line.account?.code === '1310') {
          vatOnPurchases += line.debit || 0;
        }
        if (line.account?.code?.startsWith('5') || line.account?.code?.startsWith('6')) {
          totalPurchases += line.debit || 0;
        }
      });
    });

    const netVAT = vatOnSales - vatOnPurchases;
    const withholdingVAT = vatOnSales * 0.02;
    const vatPayable = netVAT - withholdingVAT;

    const periodEnd = new Date(dateRange.endDate);
    const paymentDueDate = new Date(periodEnd.getFullYear(), periodEnd.getMonth() + 1, 20);

    return {
      period: dateRange,
      outputVAT: {
        totalSales,
        vatOnSales,
        breakdown: [
          { description: 'Standard rated sales (16%)', sales: totalSales, vat: vatOnSales }
        ]
      },
      inputVAT: {
        totalPurchases,
        vatOnPurchases,
        breakdown: [
          { description: 'Purchases with recoverable VAT', purchases: totalPurchases, vat: vatOnPurchases }
        ]
      },
      netVAT,
      withholdingVAT,
      vatPayable,
      paymentDueDate: paymentDueDate.toISOString().split('T')[0]
    };
  }

  async generateTrialBalance(asOfDate: string): Promise<any> {
    const { data: accounts } = await supabase
      .from('chart_of_accounts')
      .select('*')
      .eq('tenant_id', TENANT_ID)
      .eq('is_active', true)
      .order('code');

    const trialBalance = accounts?.map(acc => ({
      code: acc.code,
      name: acc.name,
      accountType: acc.account_type,
      debit: acc.balance > 0 ? acc.balance : 0,
      credit: acc.balance < 0 ? Math.abs(acc.balance) : 0
    })) || [];

    const totalDebits = trialBalance.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredits = trialBalance.reduce((sum, acc) => sum + acc.credit, 0);

    return {
      asOfDate,
      accounts: trialBalance,
      totals: {
        debit: totalDebits,
        credit: totalCredits,
        difference: totalDebits - totalCredits
      }
    };
  }
}

export const reportingService = new ReportingService();
