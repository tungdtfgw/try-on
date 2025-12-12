import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component - Bảo vệ routes yêu cầu đăng nhập
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children components to render
 * @returns {React.ReactNode} Protected component or redirect to login
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
