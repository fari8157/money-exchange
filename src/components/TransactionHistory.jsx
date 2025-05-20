import { useLocalStorage } from '../hooks/useLocalStorage';

export default function TransactionHistory() {
  const [transactions] = useLocalStorage('transactions', []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...transactions].reverse().map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.type === 'add' ? 'Deposit' : 'Transfer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.type === 'add' ? (
                      `Added ${transaction.amount} ${transaction.currency} at rate ${transaction.rate}`
                    ) : (
                      `Converted ${transaction.amount} ${transaction.fromCurrency} to ${transaction.convertedAmount.toFixed(2)} ${transaction.toCurrency} at rate ${transaction.rate}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.type === 'add' ? (
                      <span className="text-green-600">+{transaction.amount} {transaction.currency}</span>
                    ) : (
                      <>
                        <span className="text-red-600">-{transaction.amount} {transaction.fromCurrency}</span>
                        <br />
                        <span className="text-green-600">+{transaction.convertedAmount.toFixed(2)} {transaction.toCurrency}</span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}