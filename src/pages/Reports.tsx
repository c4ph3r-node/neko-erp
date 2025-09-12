import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, DollarSign, FileText, BarChart3, Eye, Building2, Calculator, Printer } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useGlobalState } from '../contexts/GlobalStateContext';

const reportCategories = [
  {
    title: 'Financial Reports',
    reports: [
      { name: 'Profit & Loss Statement', description: 'Revenue and expenses for a period', icon: TrendingUp, type: 'profit_loss' },
      { name: 'Balance Sheet', description: 'Assets, liabilities, and equity snapshot', icon: DollarSign, type: 'balance_sheet' },
      { name: 'Cash Flow Statement', description: 'Cash inflows and outflows', icon: FileText, type: 'cash_flow' },
      { name: 'Trial Balance', description: 'Account balances verification', icon: FileText, type: 'trial_balance' }
    ]
  },
  {
    title: 'Customer Reports',
    reports: [
      { name: 'Accounts Receivable Aging', description: 'Outstanding customer balances by age', icon: FileText, type: 'ar_aging' },
      { name: 'Customer Statement', description: 'Transaction summary for customers', icon: FileText, type: 'customer_statement' },
      { name: 'Sales by Customer', description: 'Revenue breakdown by customer', icon: TrendingUp, type: 'sales_by_customer' }
    ]
  },
  {
    title: 'Vendor Reports',
    reports: [
      { name: 'Accounts Payable Aging', description: 'Outstanding vendor balances by age', icon: FileText, type: 'ap_aging' },
      { name: 'Vendor Statement', description: 'Transaction summary for vendors', icon: FileText, type: 'vendor_statement' },
      { name: 'Purchase by Vendor', description: 'Purchase breakdown by vendor', icon: TrendingUp, type: 'purchase_by_vendor' }
    ]
  },
  {
    title: 'Kenyan Tax Reports',
    reports: [
      { name: 'VAT Return Report', description: 'VAT calculation and filing report', icon: Building2, type: 'vat_return' },
      { name: 'PAYE Report', description: 'Employee tax deductions report', icon: Calculator, type: 'paye_report' },
      { name: 'Withholding Tax Report', description: 'WHT deductions and payments', icon: DollarSign, type: 'wht_report' },
      { name: 'KRA Compliance Report', description: 'Overall tax compliance status', icon: Building2, type: 'kra_compliance' }
    ]
  }
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const { generateReport, exportData, state } = useGlobalState();

  const handleGenerateReport = (reportType: string) => {
    const parameters = { 
      period: selectedPeriod,
      dateFrom: customDateFrom,
      dateTo: customDateTo
    };
    
    const reportData = generateReport(reportType, parameters);
    
    switch (reportType) {
      case 'profit_loss':
        alert(`Profit & Loss Statement Generated:\n\nRevenue: KES ${reportData.revenue.toLocaleString()}\nExpenses: KES ${reportData.expenses.toLocaleString()}\nGross Profit: KES ${reportData.grossProfit.toLocaleString()}\nNet Income: KES ${reportData.netIncome.toLocaleString()}\n\nReport covers ${selectedPeriod} period.`);
        break;
        
      case 'balance_sheet':
        alert(`Balance Sheet Generated:\n\nTotal Assets: KES ${reportData.totalAssets.toLocaleString()}\nTotal Liabilities: KES ${reportData.totalLiabilities.toLocaleString()}\nTotal Equity: KES ${reportData.totalEquity.toLocaleString()}\n\nBalance Check: ${Math.abs(reportData.totalAssets - reportData.totalLiabilities - reportData.totalEquity) < 1 ? 'BALANCED' : 'OUT OF BALANCE'}`);
        break;
        
      case 'cash_flow':
        alert(`Cash Flow Statement Generated:\n\nOperating Cash Flow: KES ${reportData.inflows.toLocaleString()}\nInvesting Cash Flow: KES ${reportData.outflows.toLocaleString()}\nNet Cash Flow: KES ${reportData.netCashFlow.toLocaleString()}\n\nPeriod: ${selectedPeriod}`);
        break;
        
      case 'ar_aging':
        const totalAR = reportData.reduce((sum: number, item: any) => sum + item.total, 0);
        alert(`AR Aging Report Generated:\n\nTotal Outstanding: KES ${totalAR.toLocaleString()}\nCustomers with Outstanding: ${reportData.length}\nCurrent: KES ${reportData.reduce((sum: number, item: any) => sum + item.current, 0).toLocaleString()}\n30+ Days: KES ${reportData.reduce((sum: number, item: any) => sum + item.days30, 0).toLocaleString()}`);
        break;
        
      case 'trial_balance':
        const totalDebits = reportData.reduce((sum: number, acc: any) => sum + acc.debit, 0);
        const totalCredits = reportData.reduce((sum: number, acc: any) => sum + acc.credit, 0);
        alert(`Trial Balance Generated:\n\nTotal Accounts: ${reportData.length}\nTotal Debits: KES ${totalDebits.toLocaleString()}\nTotal Credits: KES ${totalCredits.toLocaleString()}\nStatus: ${Math.abs(totalDebits - totalCredits) < 1 ? 'BALANCED' : 'OUT OF BALANCE'}`);
        break;
        
      case 'vat_return':
        const vatData = {
          totalSales: state.accounts.find(a => a.code === '4000')?.balance || 0,
          vatOnSales: Math.abs(state.accounts.find(a => a.code === '4000')?.balance || 0) * 0.16,
          totalPurchases: state.accounts.find(a => a.code === '5000')?.balance || 0,
          vatOnPurchases: (state.accounts.find(a => a.code === '5000')?.balance || 0) * 0.16,
        };
        vatData.netVat = vatData.vatOnSales - vatData.vatOnPurchases;
        alert(`VAT Return Report:\n\nTotal Sales: KES ${Math.abs(vatData.totalSales).toLocaleString()}\nVAT on Sales: KES ${vatData.vatOnSales.toLocaleString()}\nTotal Purchases: KES ${vatData.totalPurchases.toLocaleString()}\nVAT on Purchases: KES ${vatData.vatOnPurchases.toLocaleString()}\nNet VAT Payable: KES ${vatData.netVat.toLocaleString()}`);
        break;
        
      default:
        alert(`${reportType.replace('_', ' ').toUpperCase()} report generated successfully!`);
    }
  };

  const handleDownloadReport = (reportType: string, format: 'csv' | 'excel' | 'pdf') => {
    exportData(reportType, format);
  };

  const handleViewReport = (reportType: string) => {
    const reportData = generateReport(reportType, { period: selectedPeriod });
    console.log(`Viewing ${reportType} report:`, reportData);
    
    // Show detailed report view
    if (reportType === 'trial_balance') {
      const details = reportData.map((acc: any) => 
        `${acc.code} - ${acc.name}: Dr ${acc.debit.toLocaleString()} Cr ${acc.credit.toLocaleString()}`
      ).join('\n');
      alert(`Trial Balance Details:\n\n${details}`);
    } else {
      handleGenerateReport(reportType);
    }
  };

  const handlePrintReport = (reportType: string) => {
    console.log(`Printing ${reportType} report`);
    alert(`${reportType.replace('_', ' ').toUpperCase()} report sent to printer. In a real system, this would open the print dialog.`);
  };

  const handleEmailReport = (reportType: string) => {
    console.log(`Emailing ${reportType} report`);
    alert(`${reportType.replace('_', ' ').toUpperCase()} report will be emailed. In a real system, this would open an email composition dialog.`);
  };

  const handleScheduleReport = (reportType: string) => {
    console.log(`Scheduling ${reportType} report`);
    alert(`Report scheduling for ${reportType.replace('_', ' ').toUpperCase()} will be configured. This would open a scheduling dialog in a real system.`);
  };

  // Calculate financial summary from real data
  const financialSummary = {
    totalRevenue: Math.abs(state.accounts.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0)),
    totalExpenses: state.accounts.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0),
    totalAssets: state.accounts.filter(a => a.type === 'Asset').reduce((sum, a) => sum + Math.max(0, a.balance), 0),
    totalLiabilities: Math.abs(state.accounts.filter(a => a.type === 'Liability').reduce((sum, a) => sum + a.balance, 0)),
    totalEquity: Math.abs(state.accounts.filter(a => a.type === 'Equity').reduce((sum, a) => sum + a.balance, 0))
  };

  financialSummary.netIncome = financialSummary.totalRevenue - financialSummary.totalExpenses;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive financial and business reports with real-time data</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              setShowCustomDate(e.target.value === 'custom');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="current-quarter">Current Quarter</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="current-year">Current Year</option>
            <option value="last-year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          {showCustomDate && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">KES {financialSummary.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">KES {financialSummary.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-600 transform rotate-180" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className={`text-2xl font-bold mt-1 ${financialSummary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KES {Math.abs(financialSummary.netIncome).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="space-y-8">
        {reportCategories.map((category) => (
          <div key={category.title}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.reports.map((report) => (
                <Card key={report.name}>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <report.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{report.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" onClick={() => handleViewReport(report.type)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleGenerateReport(report.type)}>
                          Generate
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDownloadReport(report.type, 'pdf')}>
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDownloadReport(report.type, 'excel')}>
                          <FileText className="w-4 h-4 mr-1" />
                          Excel
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handlePrintReport(report.type)}>
                          <Printer className="w-4 h-4 mr-1" />
                          Print
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleEmailReport(report.type)}>
                          <Calendar className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Financial Overview */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Financial Overview</h2>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={() => handleDownloadReport('financial_summary', 'pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleScheduleReport('financial_summary')}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Assets & Liabilities</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Assets</span>
                <span className="font-medium">KES {financialSummary.totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Liabilities</span>
                <span className="font-medium">KES {financialSummary.totalLiabilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-900">Owner's Equity</span>
                <span className="font-bold text-green-600">KES {financialSummary.totalEquity.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Profitability Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Revenue</span>
                <span className="font-medium">KES {financialSummary.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses</span>
                <span className="font-medium">KES {financialSummary.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Margin</span>
                <span className="font-medium">
                  {financialSummary.totalRevenue > 0 ? 
                    ((financialSummary.totalRevenue - (state.accounts.find(a => a.code === '5000')?.balance || 0)) / financialSummary.totalRevenue * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-900">Net Profit Margin</span>
                <span className={`font-bold ${financialSummary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {financialSummary.totalRevenue > 0 ? 
                    (financialSummary.netIncome / financialSummary.totalRevenue * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Kenyan Tax Summary */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Kenyan Tax Summary</h2>
          <Button variant="secondary" onClick={() => console.log('Opening KRA dashboard')}>
            <Building2 className="w-4 h-4 mr-2" />
            KRA Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-600">VAT Collected</p>
            <p className="text-2xl font-bold text-blue-900">
              KES {(Math.abs(state.accounts.find(a => a.code === '2100')?.balance || 0)).toLocaleString()}
            </p>
            <Button size="sm" className="mt-2" onClick={() => handleGenerateReport('vat_return')}>
              View VAT Return
            </Button>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-600">PAYE Deducted</p>
            <p className="text-2xl font-bold text-green-900">
              KES {(Math.abs(state.accounts.find(a => a.code === '2110')?.balance || 0)).toLocaleString()}
            </p>
            <Button size="sm" className="mt-2" onClick={() => handleGenerateReport('paye_report')}>
              View PAYE Report
            </Button>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-600">WHT Deducted</p>
            <p className="text-2xl font-bold text-purple-900">
              KES {(Math.abs(state.accounts.find(a => a.code === '2140')?.balance || 0)).toLocaleString()}
            </p>
            <Button size="sm" className="mt-2" onClick={() => handleGenerateReport('wht_report')}>
              View WHT Report
            </Button>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-orange-600">Statutory Deductions</p>
            <p className="text-2xl font-bold text-orange-900">
              KES {(Math.abs(state.accounts.find(a => a.code === '2120')?.balance || 0) + Math.abs(state.accounts.find(a => a.code === '2130')?.balance || 0)).toLocaleString()}
            </p>
            <Button size="sm" className="mt-2" onClick={() => console.log('Statutory deductions report')}>
              View Details
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Actions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Report Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button onClick={() => handleDownloadReport('trial_balance', 'excel')} className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Export Trial Balance
          </Button>
          <Button onClick={() => handleDownloadReport('profit_loss', 'pdf')} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            P&L Statement PDF
          </Button>
          <Button onClick={() => handleDownloadReport('balance_sheet', 'pdf')} className="w-full">
            <BarChart3 className="w-4 h-4 mr-2" />
            Balance Sheet PDF
          </Button>
          <Button onClick={() => handleDownloadReport('ar_aging', 'excel')} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            AR Aging Excel
          </Button>
        </div>
      </Card>
    </div>
  );
}