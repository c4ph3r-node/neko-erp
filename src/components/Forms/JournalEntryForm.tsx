import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../UI/Button';

interface JournalEntryFormProps {
  journalEntry?: any;
  accounts: any[];
  onSubmit: (entry: any) => void;
  onCancel: () => void;
}

export default function JournalEntryForm({ journalEntry, accounts, onSubmit, onCancel }: JournalEntryFormProps) {
  const [formData, setFormData] = useState({
    date: journalEntry?.date ? new Date(journalEntry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    reference: journalEntry?.reference || '',
    description: journalEntry?.description || '',
    lines: journalEntry?.lines || [
      { id: '1', accountId: '', accountCode: '', accountName: '', debit: 0, credit: 0, description: '' },
      { id: '2', accountId: '', accountCode: '', accountName: '', debit: 0, credit: 0, description: '' }
    ]
  });

  const handleLineChange = (index: number, field: string, value: any) => {
    const newLines = [...formData.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    // Auto-populate account details when account is selected
    if (field === 'accountId') {
      const account = accounts.find(a => a.id === parseInt(value));
      if (account) {
        newLines[index].accountCode = account.code;
        newLines[index].accountName = account.name;
      }
    }
    
    setFormData(prev => ({ ...prev, lines: newLines }));
  };

  const addLine = () => {
    const newLine = {
      id: Date.now().toString(),
      accountId: '',
      accountCode: '',
      accountName: '',
      debit: 0,
      credit: 0,
      description: ''
    };
    setFormData(prev => ({ ...prev, lines: [...prev.lines, newLine] }));
  };

  const removeLine = (index: number) => {
    if (formData.lines.length > 2) {
      setFormData(prev => ({ ...prev, lines: prev.lines.filter((_, i) => i !== index) }));
    }
  };

  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = formData.lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);
    return { totalDebit, totalCredit };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalDebit, totalCredit } = calculateTotals();
    
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert('Journal entry is not balanced. Total debits must equal total credits.');
      return;
    }
    
    onSubmit({
      ...formData,
      date: new Date(formData.date),
      totalDebit,
      totalCredit,
      status: 'draft'
    });
  };

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reference *</label>
          <input
            type="text"
            required
            value={formData.reference}
            onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., JE-001"
          />
        </div>
        <div className="flex items-end">
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isBalanced ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isBalanced ? 'Balanced' : 'Out of Balance'}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <input
          type="text"
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Journal entry description"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Journal Lines</h3>
          <Button type="button" onClick={addLine} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Line
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit (KES)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit (KES)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className="px-4 py-3">
                    <select
                      value={line.accountId}
                      onChange={(e) => handleLineChange(index, 'accountId', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleLineChange(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Line description"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.debit}
                      onChange={(e) => handleLineChange(index, 'debit', parseFloat(e.target.value) || 0)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.credit}
                      onChange={(e) => handleLineChange(index, 'credit', parseFloat(e.target.value) || 0)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={formData.lines.length <= 2}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-right font-medium text-gray-900">
                  TOTALS:
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  KES {totalDebit.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  KES {totalCredit.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className={`w-4 h-4 rounded-full ${isBalanced ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active Account
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!isBalanced}>
          {journalEntry ? 'Update Entry' : 'Create Entry'}
        </Button>
      </div>
    </form>
  );
}