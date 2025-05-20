import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddMoneyPage from './pages/AddMoneyPage';
import TransferPage from './pages/TransferPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import Sidebar from './components/Sidebar';
import { logout, getCurrentUser } from './utils/auth';

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (window.location.pathname === '/login') {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Sidebar onLogout={handleLogout} />}
      <main className={`${user ? 'ml-64' : ''} min-h-screen`}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/add-money" element={user ? <AddMoneyPage /> : <Navigate to="/login" />} />
          <Route path="/transfer" element={user ? <TransferPage /> : <Navigate to="/login" />} />
          <Route path="/transactions" element={user ? <TransactionsPage /> : <Navigate to="/login" />} />
          <Route path="/reports" element={user ? <ReportsPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}