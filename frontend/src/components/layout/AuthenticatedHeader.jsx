import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Container from '../ui/Container';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

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

const AuthenticatedHeader = () => {
  const navigate = useNavigate();
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const token = localStorage.getItem('token');
  const decoded = token ? decodeToken(token) : null;
  const isAdmin = decoded?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <Container>
        <div className="flex h-[53px] items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 font-black tracking-[0.12em] text-brand-black text-[19px]"
          >
            <svg className="w-[16.5px] h-[16.5px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            <span>FASHION</span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex px-3 py-2 text-sm font-semibold uppercase tracking-nav text-brand-grayDark hover:text-brand-black transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="hidden sm:inline-flex px-3 py-2 text-sm font-semibold uppercase tracking-nav text-brand-grayDark hover:text-brand-black transition-colors"
            >
              Profile
            </Link>

            {isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu((prev) => !prev)}
                  className={cn(
                    'inline-flex items-center gap-1 px-3 py-2 text-[11.4px] font-medium uppercase tracking-nav',
                    'text-brand-grayDark hover:text-brand-black transition-colors'
                  )}
                >
                  Admin
                  <svg
                    className={cn('h-3 w-3 transition-transform', showAdminMenu && 'rotate-180')}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {showAdminMenu ? (
                  <div className="absolute right-0 mt-2 w-56 rounded-md border border-black/5 bg-white shadow-elevated overflow-hidden">
                    <Link
                      to="/admin/categories"
                      className="block px-4 py-3 text-sm text-brand-grayDark hover:bg-brand-grayLight transition-colors"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      Quản lý Danh mục
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-3 text-sm text-brand-grayDark hover:bg-brand-grayLight transition-colors"
                      onClick={() => setShowAdminMenu(false)}
                    >
                      Quản lý Sản phẩm
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : null}

            <Button variant="ghost" size="sm" onClick={handleLogout} className="border border-black/10">
              Logout
            </Button>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default AuthenticatedHeader;
