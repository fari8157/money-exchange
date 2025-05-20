import MoneyTransferForm from '../components/MoneyTransferForm';

export default function TransferPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Transfer Money</h1>
      <MoneyTransferForm />
    </div>
  );
}