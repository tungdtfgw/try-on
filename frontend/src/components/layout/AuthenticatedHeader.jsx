import { Link, useNavigate } from 'react-router-dom';

const AuthenticatedHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            TryOn
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Hồ sơ
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium"
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
