import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiSend, FiList, FiPieChart } from 'react-icons/fi';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/add-money', icon: <FiDollarSign />, label: 'Add Money' },
    { path: '/transfer', icon: <FiSend />, label: 'Transfer' },
    { path: '/transactions', icon: <FiList />, label: 'Transactions' },
    { path: '/reports', icon: <FiPieChart />, label: 'Reports' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-blue-800 text-white shadow-lg">
      <div className="p-4 text-xl font-bold border-b border-blue-700">
        Money Exchange
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg hover:bg-blue-700 transition-colors ${
                  location.pathname === item.path ? 'bg-blue-600' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
        >
          <span className="mr-2">Logout</span>
        </button>
      </div>
    </div>
  );
}