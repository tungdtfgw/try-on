import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../services/auth_service.js';
import Card from '../../components/ui/Card';
import Container from '../../components/ui/Container';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

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
    <div className="min-h-screen bg-gradient-to-br from-brand-purpleLight via-brand-grayLight to-brand-orangeLight flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-brand-cyan/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-20 w-40 h-40 bg-brand-pink/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-brand-mint/20 rounded-full blur-2xl"></div>

      <Container className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-black tracking-[0.12em] text-brand-black text-[19px] hover:text-brand-cyan transition-colors"
          >
            <div className="p-2 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full">
              <svg className="w-[16.5px] h-[16.5px] text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
            </div>
            <span>FASHION</span>
          </Link>
        </div>

        <Card className="p-8 bg-white/95 backdrop-blur-sm" elevated>
          <h1 className="text-center text-3xl font-black tracking-heading text-brand-black uppercase">
            Đăng ký
          </h1>
          <p className="mt-3 text-center text-base text-brand-grayMedium">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-brand-black hover:underline">
              Đăng nhập ngay
            </Link>
          </p>

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
              autoComplete="new-password"
              label="Mật khẩu"
              placeholder="Tối thiểu 8 ký tự"
              error={errors.password?.message}
            />

            <Input
              {...registerField('confirmPassword')}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              error={errors.confirmPassword?.message}
            />

            {mutation.isError ? (
              <Alert variant="error">
                {mutation.error?.response?.data?.error?.message ||
                  'Đã có lỗi xảy ra, vui lòng thử lại'}
              </Alert>
            ) : null}

            <Button type="submit" className="w-full mt-6" isLoading={mutation.isPending}>
              Đăng ký
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

export default RegisterPage;
