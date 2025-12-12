import { Link } from 'react-router-dom';
import AuthenticatedHeader from '../../components/layout/AuthenticatedHeader';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader />

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <p className="text-gray-600 mb-8">Chào mừng bạn đến với TryOn! Quản lý hồ sơ và thông tin của bạn tại đây.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Link
                to="/profile"
                className="block p-6 bg-white border-2 border-gray-200 rounded-lg shadow hover:shadow-lg hover:border-indigo-500 transition-all"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-10 w-10 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Hồ sơ của tôi</h3>
                    <p className="text-sm text-gray-500 mt-1">Xem và cập nhật thông tin cá nhân, chiều cao, cân nặng và ảnh toàn thân</p>
                  </div>
                </div>
              </Link>

              {/* Placeholder for future features */}
              <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg opacity-60">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-500">Tính năng sắp có</h3>
                    <p className="text-sm text-gray-400 mt-1">Đang phát triển</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
