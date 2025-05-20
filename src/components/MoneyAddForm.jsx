import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function MoneyAddForm() {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [funds, setFunds] = useLocalStorage('funds', {});
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    rate: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now(),
      type: 'add',
      ...formData,
      amount: parseFloat(formData.amount),
      rate: parseFloat(formData.rate),
      timestamp: new Date().toISOString(),
    };

    // Update transactions
    setTransactions([...transactions, newTransaction]);

    // Update funds
    const currency = formData.currency;
    const amount = parseFloat(formData.amount);
    setFunds(prev => ({
      ...prev,
      [currency]: (prev[currency] || 0) + amount,
    }));

    // Reset form
    setFormData({
      amount: '',
      currency: 'USD',
      rate: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Money</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="AED">AED (Dirham)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Exchange Rate</label>
            <input
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              step="0.0001"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add Money
        </button>
      </form>
    </div>
  );
}