import { Link } from 'react-router-dom';

export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/transactions" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
              Transactions
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={onLogout}
              className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}