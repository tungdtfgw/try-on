import { Navigate } from 'react-router-dom';

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

/**
 * ProtectedRoute component - Bảo vệ routes yêu cầu đăng nhập
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children components to render
 * @param {boolean} props.requireAdmin - Yêu cầu admin role
 * @returns {React.ReactNode} Protected component or redirect to login
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    const decoded = decodeToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
