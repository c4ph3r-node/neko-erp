import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../UI/Button';

interface BudgetFormProps {
  budget?: any;
  onSubmit: (budget: any) => void;
  onCancel: () => void;
}

export default function BudgetForm({ budget, onSubmit, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: budget?.name || '',
    period: budget?.period || '',
    startDate: budget?.startDate || new Date().toISOString().split('T')[0],
    endDate: budget?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: budget?.description || '',
    categories: budget?.categories || [
      { name: 'Revenue', budgeted: 0, actual: 0, variance: 0 },
      { name: 'Cost of Goods Sold', budgeted: 0, actual: 0, variance: 0 },
      { name: 'Operating Expenses', budgeted: 0, actual: 0, variance: 0 }
    ]
  });

  const handleCategoryChange = (index: number, field: string, value: any) => {
    const newCategories = [...formData.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    
    if (field === 'budgeted') {
      newCategories[index].variance = newCategories[index].budgeted - newCategories[index].actual;
    }
    
    setFormData(prev => ({ ...prev, categories: newCategories }));
  };

  const addCategory = () => {
    const newCategory = { name: '', budgeted: 0, actual: 0, variance: 0 };
    setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const removeCategory = (index: number) => {
    if (formData.categories.length > 1) {
      setFormData(prev => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }));
    }
  };

  const calculateTotals = () => {
    const totalBudget = formData.categories.reduce((sum, cat) => sum + cat.budgeted, 0);
    const totalActual = formData.categories.reduce((sum, cat) => sum + cat.actual, 0);
    const totalVariance = totalBudget - totalActual;
    return { totalBudget, totalActual, totalVariance };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalBudget, totalActual, totalVariance } = calculateTotals();
    
    onSubmit({
      ...formData,
      totalBudget,
      actualSpent: totalActual,
      variance: totalVariance,
      variancePercent: totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0,
      status: 'draft'
    });
  };

  const { totalBudget, totalActual, totalVariance } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Annual Budget 2025"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
          <input
            type="text"
            required
            value={formData.period}
            onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 2025, Q1 2025"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Budget description and objectives"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Budget Categories</h3>
          <Button type="button" onClick={addCategory} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budgeted Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actual Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.categories.map((category, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Category name"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={category.budgeted}
                      onChange={(e) => handleCategoryChange(index, 'budgeted', parseFloat(e.target.value) || 0)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={category.actual}
                      onChange={(e) => handleCategoryChange(index, 'actual', parseFloat(e.target.value) || 0)}
                      className="w-32 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      disabled={formData.categories.length === 1}
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
              <span className="text-gray-600">Total Budgeted:</span>
              <span className="font-medium">${totalBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Actual:</span>
              <span className="font-medium">${totalActual.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Variance:</span>
              <span className={getVarianceColor(totalVariance)}>
                ${Math.abs(totalVariance).toFixed(2)} {totalVariance >= 0 ? 'Under' : 'Over'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{budget ? 'Update Budget' : 'Create Budget'}</Button>
      </div>
    </form>
  );
}