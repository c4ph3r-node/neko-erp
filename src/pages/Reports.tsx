import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, DollarSign, FileText, BarChart3, Eye, Building2, Calculator, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const { generateReport, exportData, showNotification, state, formatCurrency } = useGlobalState();
  const navigate = useNavigate();

  const handleGenerateReport = async (reportType: string) => {
    const parameters = { 
      period: selectedPeriod,
      dateFrom: customDateFrom,
      dateTo: customDateTo
    };
    
    try {
      const reportData = await generateReport(reportType, parameters);
      setSelectedReport({ type: reportType, data: reportData, parameters });
    } catch (error) {
      console.error('Error generating report:', error);
      showNotification(`Error generating ${reportType.replace('_', ' ')} report. Please try again.`, 'error');
    }
  };

  const handleDownloadReport = (reportType: string, format: 'csv' | 'excel' | 'pdf') => {
    exportData(reportType, format);
  };

  const handleViewReport = (reportType: string) => {
    const reportData = generateReport(reportType, { period: selectedPeriod });
    showNotification(`Viewing ${reportType} report`, 'info');
    
    // Show detailed report view
    if (reportType === 'trial_balance') {
      const details = reportData.map((acc: any) => 
        `${acc.code} - ${acc.name}: Dr ${acc.debit.toLocaleString()} Cr ${acc.credit.toLocaleString()}`
      ).join(', ');
      showNotification(`Trial Balance Details: ${details}`, 'info');
    } else {
      handleGenerateReport(reportType);
    }
  };

  const handlePrintReport = (reportType: string) => {
    showNotification(`${reportType.replace('_', ' ').toUpperCase()} report sent to printer. In a real system, this would open the print dialog.`, 'info');
  };

  const handleEmailReport = (reportType: string) => {
    showNotification(`${reportType.replace('_', ' ').toUpperCase()} report will be emailed. In a real system, this would open an email composition dialog.`, 'info');
  };

  const handleScheduleReport = (reportType: string) => {
    showNotification(`Report scheduling for ${reportType.replace('_', ' ').toUpperCase()} will be configured. This would open a scheduling dialog in a real system.`, 'info');
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
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialSummary.totalRevenue)}</p>
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
              <p className="text-2xl font-bold text-red-600">{formatCurrency(financialSummary.totalExpenses)}</p>
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
                {formatCurrency(Math.abs(financialSummary.netIncome))}
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

      {/* Selected Report Display */}
      {selectedReport && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedReport.type.replace('_', ' ').toUpperCase()} Report
            </h2>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" onClick={() => handleDownloadReport(selectedReport.type, 'pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedReport(null)}>
                Close
              </Button>
            </div>
          </div>
          <ReportDisplay report={selectedReport} />
        </Card>
      )}

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
                <span className="font-medium">{formatCurrency(financialSummary.totalAssets)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Liabilities</span>
                <span className="font-medium">{formatCurrency(financialSummary.totalLiabilities)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-900">Owner's Equity</span>
                <span className="font-bold text-green-600">{formatCurrency(financialSummary.totalEquity)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Profitability Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Revenue</span>
                <span className="font-medium">{formatCurrency(financialSummary.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Expenses</span>
                <span className="font-medium">{formatCurrency(financialSummary.totalExpenses)}</span>
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
          <Button variant="secondary" onClick={() => navigate('/tax-compliance')}>
            <Building2 className="w-4 h-4 mr-2" />
            KRA Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-600">VAT Collected</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(Math.abs(state.accounts.find(a => a.code === '2100')?.balance || 0))}
            </p>
            <Button size="sm" className="mt-2" onClick={() => handleGenerateReport('vat_return')}>
              View VAT Return
            </Button>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-600">PAYE Deducted</p>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(Math.abs(state.accounts.find(a => a.code === '2110')?.balance || 0))}
            </p>
            <Button size="sm" className="mt-2" onClick={() => handleGenerateReport('paye_report')}>
              View PAYE Report
            </Button>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-600">WHT Deducted</p>
            <p className="text-2xl font-bold text-purple-900">
              {formatCurrency(Math.abs(state.accounts.find(a => a.code === '2140')?.balance || 0))}
            </p>
            <Button size="sm" className="mt-2" onClick={() => handleGenerateReport('wht_report')}>
              View WHT Report
            </Button>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm font-medium text-orange-600">Statutory Deductions</p>
            <p className="text-2xl font-bold text-orange-900">
              {formatCurrency(Math.abs(state.accounts.find(a => a.code === '2120')?.balance || 0) + Math.abs(state.accounts.find(a => a.code === '2130')?.balance || 0))}
            </p>
            <Button size="sm" className="mt-2" onClick={() => handleViewReport('statutory_deductions')}>
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

function ReportDisplay({ report }: { report: any }) {
  const { type, data } = report;

  switch (type) {
    case 'profit_loss':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Revenue</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-medium">{formatCurrency(data.revenue.total)}</span>
                </div>
                {data.revenue.breakdown.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between pl-4 text-sm">
                    <span className="text-gray-500">{item.account}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Expenses</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost of Sales</span>
                  <span className="font-medium">{formatCurrency(data.costOfSales.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Expenses</span>
                  <span className="font-medium">{formatCurrency(data.operatingExpenses.total)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Gross Profit</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(data.grossProfit)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Operating Income</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(data.operatingIncome)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Net Income</p>
                <p className={`text-xl font-bold ${data.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(data.netIncome)}
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case 'balance_sheet':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Assets</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Current Assets</span>
                  <span>{formatCurrency(data.assets.currentAssets.total)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Fixed Assets</span>
                  <span>{formatCurrency(data.assets.fixedAssets.total)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total Assets</span>
                  <span>{formatCurrency(data.assets.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Liabilities</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Current Liabilities</span>
                  <span>{formatCurrency(data.liabilities.currentLiabilities.total)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Long-term Liabilities</span>
                  <span>{formatCurrency(data.liabilities.longTermLiabilities.total)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total Liabilities</span>
                  <span>{formatCurrency(data.liabilities.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Equity</h3>
              <div className="space-y-2">
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Total Equity</span>
                  <span>{formatCurrency(data.equity.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'cash_flow':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Operating Activities</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Income</span>
                  <span className="font-medium">{formatCurrency(data.operatingActivities.netIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Change in AR</span>
                  <span className="font-medium">{formatCurrency(data.operatingActivities.changeInAR)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Change in Inventory</span>
                  <span className="font-medium">{formatCurrency(data.operatingActivities.changeInInventory)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold">
                  <span>Net Cash from Operations</span>
                  <span>{formatCurrency(data.operatingActivities.total)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Investing & Financing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investing Activities</span>
                  <span className="font-medium">{formatCurrency(data.investingActivities.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Financing Activities</span>
                  <span className="font-medium">{formatCurrency(data.financingActivities.total)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-bold text-green-600">
                  <span>Net Cash Flow</span>
                  <span>{formatCurrency(data.netCashFlow)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'ar_aging':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total AR</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(data.totals.totalBalance)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Current</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(data.totals.current)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">1-30 Days</p>
              <p className="text-xl font-bold text-yellow-600">{formatCurrency(data.totals.days1_30)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">31-90 Days</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(data.totals.days31_60 + data.totals.days61_90)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Over 90 Days</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(data.totals.over90)}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">1-30</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">31-60</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">61-90</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">90+</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.customers.map((customer: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">{formatCurrency(customer.totalBalance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(customer.current)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(customer.days1_30)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(customer.days31_60)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(customer.days61_90)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(customer.over90)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'trial_balance':
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.accounts.map((account: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{account.debit ? formatCurrency(account.debit) : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{account.credit ? formatCurrency(account.credit) : '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">Totals</td>
                <td className="px-6 py-4 text-sm font-bold text-right">{formatCurrency(data.totals.debit)}</td>
                <td className="px-6 py-4 text-sm font-bold text-right">{formatCurrency(data.totals.credit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      );

    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Report display not implemented for this type.</p>
          <pre className="mt-4 text-left bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
  }
}