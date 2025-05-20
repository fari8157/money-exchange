import Dashboard from '../components/Dashboard';
import ProfitLossReport from '../components/ProfitLossReport';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Dashboard />
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Summary</h2>
          <ProfitLossReport simplified />
        </div>
      </div>
    </div>
  );
}