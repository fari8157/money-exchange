import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MoneyAddForm from './MoneyAddForm';
import MoneyTransferForm from './MoneyTransferForm';
import ProfitLossReport from './ProfitLossReport';

import { calculateProfitLoss } from '../utils/calculations';

export default function CurrencyApp() {
  const [transactions] = useLocalStorage('transactions', []);
  const [funds] = useLocalStorage('funds', {});
  
  const { buyRates } = calculateProfitLoss(transactions);
  
  // Format currency balances for display
  const balances = Object.entries(funds).map(([currency, amount]) => {
    return {
      currency,
      amount,
      buyRate: buyRates[currency] || 'Not set'
    };
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Currency Exchange Agent Dashboard</h1>
      
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Current Balances</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Current Buy Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {balances.map(({ currency, amount, buyRate }) => (
                <tr key={currency}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{currency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(amount).toFixed(2)} {currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof buyRate === 'number' ? buyRate.toFixed(4) : buyRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
        <MoneyAddForm />
      </div>
      
      <div className="mb-6">
        <MoneyTransferForm />
      </div>
      
      <div className="mb-6">
        <ProfitLossReport />
      </div>
    </div>
  );
}