import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../services/auth_service.js';
import Card from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

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
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-brand-cyanLight via-brand-grayLight to-brand-pinkLight flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-brand-yellow/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-brand-orange/20 rounded-full blur-2xl"></div>

      <Container className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-black tracking-[0.12em] text-brand-black text-[19px] hover:text-brand-purple transition-colors"
          >
            <div className="p-2 bg-gradient-to-br from-brand-yellow to-brand-orange rounded-full">
              <svg className="w-[16.5px] h-[16.5px] text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
            <span>FASHION</span>
          </Link>
        </div>

        <Card className="p-8 bg-white/95 backdrop-blur-sm" elevated>
          <h1 className="text-center text-3xl font-black tracking-heading text-brand-black uppercase">
            Đăng nhập
          </h1>
          <p className="mt-3 text-center text-base text-brand-grayMedium">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-brand-black hover:underline">
              Đăng ký ngay
            </Link>
          </p>

          {location.state?.message ? (
            <Alert className="mt-6" variant="success">
              {location.state.message}
            </Alert>
          ) : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...registerField('email')}
              id="email"
              type="email"
              autoComplete="email"
              label="Email"
              placeholder="you@example.com"
              error={errors.email?.message}
            />

            <Input
              {...registerField('password')}
              id="password"
              type="password"
              autoComplete="current-password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              error={errors.password?.message}
            />

            {mutation.isError ? (
              <Alert variant="error">
                {mutation.error?.response?.data?.error?.message ||
                  'Email hoặc mật khẩu không đúng'}
              </Alert>
            ) : null}

            <Button type="submit" className="w-full mt-6" isLoading={mutation.isPending}>
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-brand-grayMedium hover:text-brand-black">
              Quay lại trang chủ
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
