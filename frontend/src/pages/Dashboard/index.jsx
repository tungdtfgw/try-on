import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedHeader from '../../components/layout/AuthenticatedHeader';
import { getAllCategories } from '../../services/categories_service';
import { getAllProducts } from '../../services/products_service';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';

/**
 * Decode JWT token to get user info
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const decoded = token ? decodeToken(token) : null;
  const isAdmin = decoded?.role === 'admin';

  const [stats, setStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const [categoriesResponse, productsResponse] = await Promise.all([
        getAllCategories(),
        getAllProducts({ limit: 1, offset: 0 })
      ]);

      setStats({
        totalCategories: categoriesResponse.data?.length || 0,
        totalProducts: productsResponse.pagination?.total || 0,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Không thể tải thống kê'
      }));
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-brand-grayLight">
        <AuthenticatedHeader />

        <main className="py-xl mt-4">
          <Container>
            <div className="mb-8">
              <h1 className="text-section-heading font-black text-brand-black tracking-heading uppercase">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-brand-grayMedium">
                Tổng quan hệ thống và quản lý nội dung
              </p>
            </div>

              {stats.error ? (
              <Alert className="mb-6" variant="error">
                  {stats.error}
                </Alert>
              ) : null}

              {stats.loading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner />
                </div>
              ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 bg-gradient-to-br from-brand-purple to-brand-purpleLight border-0">
                    <div className="text-[8.658px] font-semibold uppercase tracking-nav text-white/80">
                        Tổng danh mục
                      </div>
                    <div className="mt-3 text-4xl font-black text-white">
                        {stats.totalCategories}
                      </div>
                    </Card>

                  <Card className="p-6 bg-gradient-to-br from-brand-cyan to-brand-cyanLight border-0">
                    <div className="text-[8.658px] font-semibold uppercase tracking-nav text-white/80">
                        Tổng sản phẩm
                      </div>
                    <div className="mt-3 text-4xl font-black text-white">
                        {stats.totalProducts}
                      </div>
                    </Card>

                  <Card className="p-6 bg-gradient-to-br from-brand-orange to-brand-orangeLight border-0">
                    <div className="text-[8.658px] font-semibold uppercase tracking-nav text-white/80">
                      TB SP/Danh mục
                      </div>
                    <div className="mt-3 text-4xl font-black text-white">
                        {stats.totalCategories > 0
                          ? Math.round(stats.totalProducts / stats.totalCategories)
                          : 0}
                      </div>
                    </Card>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to="/admin/categories" className="block group">
                    <Card className="p-6 hover:scale-[1.01] hover:shadow-card transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-brand-black">
                              Quản lý Danh mục
                            </h3>
                          <p className="mt-2 text-sm text-brand-grayMedium">
                              Tạo, sửa, xóa danh mục sản phẩm
                            </p>
                          <div className="mt-3 flex items-center gap-1 text-brand-grayMedium group-hover:text-brand-black transition-colors">
                            <span className="text-xs font-medium">Xem chi tiết</span>
                            <svg
                              className="w-3 h-3 transition-transform group-hover:translate-x-0.5" 
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-sm bg-brand-pink flex items-center justify-center flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                        </div>
                      </Card>
                    </Link>

                  <Link to="/admin/products" className="block group">
                    <Card className="p-6 hover:scale-[1.01] hover:shadow-card transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-brand-black">
                              Quản lý Sản phẩm
                            </h3>
                          <p className="mt-2 text-sm text-brand-grayMedium">
                              Tạo, sửa, xóa sản phẩm và upload ảnh
                            </p>
                          <div className="mt-3 flex items-center gap-1 text-brand-grayMedium group-hover:text-brand-black transition-colors">
                            <span className="text-xs font-medium">Xem chi tiết</span>
                            <svg
                              className="w-3 h-3 transition-transform group-hover:translate-x-0.5" 
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-sm bg-brand-mint flex items-center justify-center flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </div>
                </>
              )}
          </Container>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grayLight">
      <AuthenticatedHeader />

      <main className="py-xl mt-4">
        <Container>
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10 rounded-lg border-l-4 border-brand-blue">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-blueLight flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-section-heading font-black text-brand-black tracking-heading uppercase">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-brand-grayMedium">
                  Chào mừng bạn đến với Fashion! Quản lý hồ sơ và thông tin của bạn tại đây.
                </p>
              </div>
            </div>
          </div>
            
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/profile" className="block group">
              <Card className="p-6 hover:scale-[1.01] hover:shadow-card transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-brand-black">Hồ sơ của tôi</h3>
                    <p className="mt-2 text-sm text-brand-grayMedium">
                        Xem và cập nhật thông tin cá nhân, chiều cao, cân nặng và ảnh toàn thân
                      </p>
                    <div className="mt-3 flex items-center gap-1 text-brand-grayMedium group-hover:text-brand-black transition-colors">
                      <span className="text-xs font-medium">Xem chi tiết</span>
                      <svg
                        className="w-3 h-3 transition-transform group-hover:translate-x-0.5" 
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-sm bg-brand-blue flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>

            <Card className="p-6 opacity-60">
              <div className="text-[8.658px] font-semibold uppercase tracking-nav text-brand-grayMedium">
                Tính năng sắp có
              </div>
              <div className="mt-3 text-lg font-semibold text-brand-grayDark">Virtual Try-On</div>
              <p className="mt-2 text-sm text-brand-grayMedium">Đang phát triển</p>
            </Card>

            <Card className="p-6 opacity-60">
              <div className="text-[8.658px] font-semibold uppercase tracking-nav text-brand-grayMedium">
                  Tính năng sắp có
                </div>
              <div className="mt-3 text-lg font-semibold text-brand-grayDark">AI Recommendations</div>
              <p className="mt-2 text-sm text-brand-grayMedium">Đang phát triển</p>
              </Card>
            </div>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
