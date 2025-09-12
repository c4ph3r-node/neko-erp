import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../UI/Button';
import { useGlobalState } from '../../contexts/GlobalStateContext';

interface InvoiceFormProps {
  invoice?: any;
  onSubmit: (invoice: any) => void;
  onCancel: () => void;
}

export default function InvoiceForm({ invoice, onSubmit, onCancel }: InvoiceFormProps) {
  const { state } = useGlobalState();
  
  const [formData, setFormData] = useState({
    customerId: invoice?.customerId || '',
    customerName: invoice?.customerName || '',
    issueDate: invoice?.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: invoice?.notes || '',
    terms: invoice?.terms || 'Payment due within 30 days. Late payments subject to 2% monthly interest.',
    lines: invoice?.lines || [{ 
      id: '1', 
      description: '', 
      quantity: 1, 
      unitPrice: 0, 
      vatRate: 16, 
      vatAmount: 0, 
      amount: 0 
    }]
  });

  const handleLineChange = (index: number, field: string, value: any) => {
    const newLines = [...formData.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    // Recalculate amounts for Kenyan VAT system
    if (field === 'quantity' || field === 'unitPrice' || field === 'vatRate') {
      const line = newLines[index];
      const subtotal = line.quantity * line.unitPrice;
      line.vatAmount = subtotal * (line.vatRate / 100);
      line.amount = subtotal; // Amount before VAT in Kenya
    }
    
    setFormData(prev => ({ ...prev, lines: newLines }));
  };

  const addLine = () => {
    const newLine = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 16, // Standard Kenyan VAT rate
      vatAmount: 0,
      amount: 0
    };
    setFormData(prev => ({ ...prev, lines: [...prev.lines, newLine] }));
  };

  const removeLine = (index: number) => {
    if (formData.lines.length > 1) {
      setFormData(prev => ({ ...prev, lines: prev.lines.filter((_, i) => i !== index) }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.lines.reduce((sum, line) => sum + line.amount, 0);
    const vatAmount = formData.lines.reduce((sum, line) => sum + line.vatAmount, 0);
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  };

  const handleCustomerChange = (customerName: string) => {
    const customer = state.customers.find(c => c.name === customerName);
    setFormData(prev => ({
      ...prev,
      customerName,
      customerId: customer?.id || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { subtotal, vatAmount, total } = calculateTotals();
    
    if (total <= 0) {
      alert('Invoice total must be greater than zero');
      return;
    }
    
    onSubmit({
      ...formData,
      issueDate: new Date(formData.issueDate),
      dueDate: new Date(formData.dueDate),
      subtotal,
      vatAmount,
      total,
      status: 'draft'
    });
  };

  const { subtotal, vatAmount, total } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name *
          </label>
          <select
            required
            value={formData.customerName}
            onChange={(e) => handleCustomerChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Customer</option>
            {state.customers.map(customer => (
              <option key={customer.id} value={customer.name}>
                {customer.name} - {customer.county}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Date *
          </label>
          <input
            type="date"
            required
            value={formData.issueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Due Date *
        </label>
        <input
          type="date"
          required
          value={formData.dueDate}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
          <Button type="button" onClick={addLine} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price (KES)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">VAT %</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">VAT Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total (KES)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Item description"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.unitPrice}
                      onChange={(e) => handleLineChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={line.vatRate}
                      onChange={(e) => handleLineChange(index, 'vatRate', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={16}>16% (Standard)</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {line.vatAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {(line.amount + line.vatAmount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={formData.lines.length === 1}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT (16%):</span>
              <span className="font-medium">KES {vatAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Additional notes for the customer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms & Conditions
          </label>
          <textarea
            rows={3}
            value={formData.terms}
            onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Kenyan Tax Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-700">VAT Rate:</p>
            <p className="font-semibold text-blue-900">16% (Standard Rate)</p>
          </div>
          <div>
            <p className="text-blue-700">KRA Compliance:</p>
            <p className="font-semibold text-blue-900">eTIMS Integration Ready</p>
          </div>
          <div>
            <p className="text-blue-700">Currency:</p>
            <p className="font-semibold text-blue-900">Kenya Shillings (KES)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}