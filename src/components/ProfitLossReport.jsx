import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateProfitLoss } from '../utils/calculations';

export default function ProfitLossReport() {
  const [transactions] = useLocalStorage('transactions', []);
  
  // Calculate profit/loss data
  const { transferTransactions, totalProfitLoss } = calculateProfitLoss(transactions);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Total Profit</h2>
        <div className={`text-3xl font-bold ${
          totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} Units
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transferTransactions.map((transfer) => (
              <tr key={transfer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transfer.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transfer.fromCurrency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transfer.toCurrency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transfer.amount.toFixed(2)} {transfer.fromCurrency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transfer.buyRate.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transfer.transferRate.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transfer.profitLossPerUnit.toFixed(4)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  transfer.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transfer.totalProfitLoss >= 0 ? '+' : ''}{transfer.totalProfitLoss.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Simple explanation of the calculation */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-medium mb-2">How Profit is Calculated:</h3>
        <p className="text-sm text-gray-600">
          When you buy currency at a higher rate (e.g., 20) and transfer it at a lower rate (e.g., 18), 
          the difference (2) multiplied by the amount is your profit.
        </p>
      </div>
    </div>
  );
}