import TransactionHistory from '../components/TransactionHistory';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <TransactionHistory />
      </div>
    </div>
  );
}