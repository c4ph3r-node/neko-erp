import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../UI/Button';

interface LineItem {
  id?: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

interface PurchaseOrderFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function PurchaseOrderForm({ initialData, onSubmit, onCancel }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState(initialData || {
    po_number: '',
    vendor_id: '',
    po_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    required_by_date: '',
    status: 'draft',
    approval_status: 'pending',
    currency: 'KES',
    payment_terms: 'net_30',
    shipping_method: 'standard',
    notes: '',
    internal_notes: ''
  });

  const [lineItems, setLineItems] = useState<LineItem[]>(initialData?.lines || [
    { description: '', quantity: 1, unit_price: 0, tax_rate: 16 }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      [field]: field.includes('price') || field.includes('quantity') || field.includes('rate') ? parseFloat(value) || 0 : value
    };
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0, tax_rate: 16 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateLineTotal = (item: LineItem) => {
    const subtotal = item.quantity * item.unit_price;
    const tax = subtotal * (item.tax_rate / 100);
    return subtotal + tax;
  };

  const totals = {
    subtotal: lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0),
    tax: lineItems.reduce((sum, item) => {
      const subtotal = item.quantity * item.unit_price;
      return sum + (subtotal * (item.tax_rate / 100));
    }, 0),
    total: lineItems.reduce((sum, item) => sum + calculateLineTotal(item), 0)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      subtotal: totals.subtotal,
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
          <label className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
          <input
            type="text"
            name="po_number"
            value={formData.po_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
          <select
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Vendor</option>
            <option value="vend-1">Vendor 1</option>
            <option value="vend-2">Vendor 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PO Date</label>
          <input
            type="date"
            name="po_date"
            value={formData.po_date}
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

      {/* Status & Terms */}
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
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="sent">Sent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
          <select
            name="payment_terms"
            value={formData.payment_terms}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="net_30">Net 30</option>
            <option value="net_60">Net 60</option>
            <option value="cod">COD</option>
            <option value="advance">Advance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
          <select
            name="shipping_method"
            value={formData.shipping_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="pickup">Pickup</option>
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
                  placeholder="Tax %"
                  value={item.tax_rate}
                  onChange={(e) => handleLineChange(index, 'tax_rate', e.target.value)}
                  step="0.01"
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between md:col-span-2">
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
          Save PO
        </Button>
      </div>
    </form>
  );
}
