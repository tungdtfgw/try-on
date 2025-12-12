import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../services/auth_service.js';
import { cn } from '../../utils/cn.js';

// Validation schema
const registerSchema = z
  .object({
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }) => register(email, password),
    onSuccess: () => {
      navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Đăng nhập
            </Link>
          </p>
        </div>

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
                autoComplete="new-password"
                className={cn(
                  'appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  errors.password ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Mật khẩu (tối thiểu 8 ký tự)"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Xác nhận mật khẩu
              </label>
              <input
                {...registerField('confirmPassword')}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className={cn(
                  'appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                )}
                placeholder="Xác nhận mật khẩu"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {mutation.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">
                {mutation.error?.response?.data?.error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại'}
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
