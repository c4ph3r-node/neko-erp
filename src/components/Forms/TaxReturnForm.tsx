import React, { useState } from 'react';
import Button from '../UI/Button';

interface TaxReturnFormProps {
  taxReturn?: any;
  onSubmit: (returnData: any) => void;
  onCancel: () => void;
}

export default function TaxReturnForm({ taxReturn, onSubmit, onCancel }: TaxReturnFormProps) {
  const [formData, setFormData] = useState({
    returnType: taxReturn?.returnType || 'VAT Return',
    period: taxReturn?.period || '',
    startDate: taxReturn?.startDate || '',
    endDate: taxReturn?.endDate || '',
    dueDate: taxReturn?.dueDate || '',
    totalSales: taxReturn?.totalSales || 0,
    totalPurchases: taxReturn?.totalPurchases || 0,
    vatOnSales: taxReturn?.vatOnSales || 0,
    vatOnPurchases: taxReturn?.vatOnPurchases || 0,
    totalIncome: taxReturn?.totalIncome || 0,
    totalDeductions: taxReturn?.totalDeductions || 0,
    totalPayroll: taxReturn?.totalPayroll || 0,
    federalTax: taxReturn?.federalTax || 0,
    stateTax: taxReturn?.stateTax || 0,
    notes: taxReturn?.notes || ''
  });

  const calculateNetVat = () => {
    return formData.vatOnSales - formData.vatOnPurchases;
  };

  const calculateTaxableIncome = () => {
    return formData.totalIncome - formData.totalDeductions;
  };

  const calculateTotalTax = () => {
    return formData.federalTax + formData.stateTax;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedData = {
      ...formData,
      netVat: calculateNetVat(),
      taxableIncome: calculateTaxableIncome(),
      taxOwed: calculateTaxableIncome() * 0.25, // 25% tax rate
      totalTax: calculateTotalTax(),
      status: 'draft'
    };
    onSubmit(calculatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Return Type *</label>
          <select
            required
            value={formData.returnType}
            onChange={(e) => setFormData(prev => ({ ...prev, returnType: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="VAT Return">VAT Return</option>
            <option value="Income Tax">Income Tax</option>
            <option value="Payroll Tax">Payroll Tax</option>
            <option value="Sales Tax">Sales Tax</option>
            <option value="Corporate Tax">Corporate Tax</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
          <input
            type="text"
            required
            value={formData.period}
            onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Q1 2025, January 2025, 2024"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
          <input
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* VAT Return Fields */}
      {formData.returnType === 'VAT Return' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">VAT Calculation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Sales</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalSales}
                onChange={(e) => setFormData(prev => ({ ...prev, totalSales: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">VAT on Sales</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.vatOnSales}
                onChange={(e) => setFormData(prev => ({ ...prev, vatOnSales: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Purchases</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalPurchases}
                onChange={(e) => setFormData(prev => ({ ...prev, totalPurchases: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">VAT on Purchases</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.vatOnPurchases}
                onChange={(e) => setFormData(prev => ({ ...prev, vatOnPurchases: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Net VAT Payable: <span className="font-semibold">${calculateNetVat().toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Income Tax Fields */}
      {formData.returnType === 'Income Tax' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Income Tax Calculation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Income</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalIncome}
                onChange={(e) => setFormData(prev => ({ ...prev, totalIncome: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Deductions</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalDeductions}
                onChange={(e) => setFormData(prev => ({ ...prev, totalDeductions: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Taxable Income: <span className="font-semibold">${calculateTaxableIncome().toFixed(2)}</span>
            </p>
            <p className="text-sm text-blue-800">
              Estimated Tax (25%): <span className="font-semibold">${(calculateTaxableIncome() * 0.25).toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Payroll Tax Fields */}
      {formData.returnType === 'Payroll Tax' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Payroll Tax Calculation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Payroll</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.totalPayroll}
                onChange={(e) => setFormData(prev => ({ ...prev, totalPayroll: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Federal Tax</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.federalTax}
                onChange={(e) => setFormData(prev => ({ ...prev, federalTax: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State Tax</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.stateTax}
                onChange={(e) => setFormData(prev => ({ ...prev, stateTax: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Total Tax Owed: <span className="font-semibold">${calculateTotalTax().toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional notes for this tax return"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{taxReturn ? 'Update Tax Return' : 'Create Tax Return'}</Button>
      </div>
    </form>
  );
}