import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function MoneyTransferForm() {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);
  const [funds, setFunds] = useLocalStorage('funds', {});
  const [formData, setFormData] = useState({
    fromCurrency: 'AED',
    toCurrency: 'INR',
    amount: '',
    rate: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [availableFunds, setAvailableFunds] = useState(0);

  useEffect(() => {
    if (formData.fromCurrency) {
      setAvailableFunds(funds[formData.fromCurrency] || 0);
    }
  }, [formData.fromCurrency, funds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const rate = parseFloat(formData.rate);

    if (amount > availableFunds) {
      alert('Insufficient funds');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      type: 'transfer',
      ...formData,
      amount,
      rate,
      convertedAmount: amount * rate,
      timestamp: new Date().toISOString(),
    };

    // Update transactions
    setTransactions([...transactions, newTransaction]);

    // Update funds
    setFunds(prev => ({
      ...prev,
      [formData.fromCurrency]: (prev[formData.fromCurrency] || 0) - amount,
      [formData.toCurrency]: (prev[formData.toCurrency] || 0) + (amount * rate),
    }));

    // Reset form
    setFormData({
      fromCurrency: 'AED',
      toCurrency: 'INR',
      amount: '',
      rate: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transfer Money</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">From Currency</label>
            <select
              name="fromCurrency"
              value={formData.fromCurrency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="AED">AED (Dirham)</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Available: {availableFunds.toFixed(2)} {formData.fromCurrency}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">To Currency</label>
            <select
              name="toCurrency"
              value={formData.toCurrency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Amount to Transfer</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              step="0.01"
              max={availableFunds}
              required
            />
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Transfer Money
        </button>
      </form>
    </div>
  );
}