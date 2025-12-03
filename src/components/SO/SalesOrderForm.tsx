import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../UI/Button';

interface LineItem {
  id?: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  tax_rate: number;
}

interface SalesOrderFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function SalesOrderForm({ initialData, onSubmit, onCancel }: SalesOrderFormProps) {
  const [formData, setFormData] = useState(initialData || {
    order_number: '',
    customer_id: '',
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    status: 'draft',
    payment_status: 'unpaid',
    fulfillment_status: 'pending',
    currency: 'KES',
    notes: '',
    internal_notes: ''
  });

  const [lineItems, setLineItems] = useState<LineItem[]>(initialData?.lines || [
    { description: '', quantity: 1, unit_price: 0, discount_percentage: 0, tax_rate: 16 }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'customer_id' || name === 'status' ? value : value
    }));
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: field.includes('price') || field.includes('quantity') || field.includes('percentage') || field.includes('rate') ? parseFloat(value) || 0 : value };
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0, discount_percentage: 0, tax_rate: 16 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateLineTotal = (item: LineItem) => {
    const subtotal = item.quantity * item.unit_price;
    const discount = subtotal * (item.discount_percentage / 100);
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * (item.tax_rate / 100);
    return afterDiscount + tax;
  };

  const totals = {
    subtotal: lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0),
    discounts: lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price * (item.discount_percentage / 100)), 0),
    tax: lineItems.reduce((sum, item) => {
      const afterDiscount = (item.quantity * item.unit_price) * (1 - item.discount_percentage / 100);
      return sum + (afterDiscount * (item.tax_rate / 100));
    }, 0),
    total: lineItems.reduce((sum, item) => sum + calculateLineTotal(item), 0)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      subtotal: totals.subtotal,
      discount_amount: totals.discounts,
      tax_amount: totals.tax,
      total: totals.total,
      lines: lineItems
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
          <input
            type="text"
            name="order_number"
            value={formData.order_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Customer</option>
            <option value="cust-1">Customer 1</option>
            <option value="cust-2">Customer 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
          <input
            type="date"
            name="order_date"
            value={formData.order_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
          <input
            type="date"
            name="delivery_date"
            value={formData.delivery_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="KES">KES</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
          <Button type="button" onClick={addLineItem} size="sm" variant="secondary">
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </Button>
        </div>

        <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
          {lineItems.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded border border-gray-200 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => handleLineChange(index, 'unit_price', e.target.value)}
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={item.discount_percentage}
                  onChange={(e) => handleLineChange(index, 'discount_percentage', e.target.value)}
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Tax %"
                  value={item.tax_rate}
                  onChange={(e) => handleLineChange(index, 'tax_rate', e.target.value)}
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between">
                  <span className="font-medium">${calculateLineTotal(item).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-right">
        <div className="flex justify-end gap-8">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-end gap-8">
          <span className="text-gray-600">Discounts:</span>
          <span className="font-medium">${totals.discounts.toFixed(2)}</span>
        </div>
        <div className="flex justify-end gap-8">
          <span className="text-gray-600">Tax:</span>
          <span className="font-medium">${totals.tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-end gap-8">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg">${totals.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
          <textarea
            name="internal_notes"
            value={formData.internal_notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" onClick={onCancel} variant="secondary" className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Save Order
        </Button>
      </div>
    </form>
  );
}
