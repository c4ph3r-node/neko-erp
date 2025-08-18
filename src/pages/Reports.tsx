import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, DollarSign, FileText } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

const reportCategories = [
  {
    title: 'Financial Reports',
    reports: [
      { name: 'Profit & Loss Statement', description: 'Revenue and expenses for a period', icon: TrendingUp },
      { name: 'Balance Sheet', description: 'Assets, liabilities, and equity snapshot', icon: DollarSign },
      { name: 'Cash Flow Statement', description: 'Cash inflows and outflows', icon: FileText },
      { name: 'Trial Balance', description: 'Account balances verification', icon: FileText }
    ]
  },
  {
    title: 'Customer Reports',
    reports: [
      { name: 'Accounts Receivable Aging', description: 'Outstanding customer balances by age', icon: FileText },
      { name: 'Customer Statement', description: 'Transaction summary for customers', icon: FileText },
      { name: 'Sales by Customer', description: 'Revenue breakdown by customer', icon: TrendingUp }
    ]
  },
  {
    title: 'Vendor Reports',
    reports: [
      { name: 'Accounts Payable Aging', description: 'Outstanding vendor balances by age', icon: FileText },
      { name: 'Vendor Statement', description: 'Transaction summary for vendors', icon: FileText },
      { name: 'Purchase by Vendor', description: 'Purchase breakdown by vendor', icon: TrendingUp }
    ]
  }
];

const financialSummary = {
  totalRevenue: 180500.00,
  totalExpenses: 103600.00,
  netIncome: 76900.00,
  totalAssets: 194890.00,
  totalLiabilities: 43500.00,
  equity: 151390.00
};

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive financial and business reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="current-quarter">Current Quarter</option>
            <option value="current-year">Current Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Date Range
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${financialSummary.totalRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-red-600">${financialSummary.totalExpenses.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-blue-600">${financialSummary.netIncome.toLocaleString()}</p>
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
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          Generate
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Download className="w-4 h-4" />
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

      {/* Quick Reports */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Financial Overview</h2>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Assets & Liabilities</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Assets</span>
                <span className="font-medium">${financialSummary.totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Liabilities</span>
                <span className="font-medium">${financialSummary.totalLiabilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-900">Owner's Equity</span>
                <span className="font-bold text-green-600">${financialSummary.equity.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Profitability</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Margin</span>
                <span className="font-medium">58.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operating Margin</span>
                <span className="font-medium">42.6%</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium text-gray-900">Net Margin</span>
                <span className="font-bold text-green-600">42.6%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}