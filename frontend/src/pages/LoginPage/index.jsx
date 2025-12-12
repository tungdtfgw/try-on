import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../services/auth_service.js';
import { cn } from '../../utils/cn.js';

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      // Lưu token vào localStorage
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }

      // Redirect đến dashboard hoặc trang được chỉ định
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Đăng ký
            </Link>
          </p>
        </div>

        {location.state?.message && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{location.state.message}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                {...registerField('email')}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={cn(
                  'appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  errors.email ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                {...registerField('password')}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={cn(
                  'appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  errors.password ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Mật khẩu"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          {mutation.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">
                {mutation.error?.response?.data?.error?.message || 'Email hoặc mật khẩu không đúng'}
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
