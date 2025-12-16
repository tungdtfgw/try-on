import { cn } from '../../utils/cn';

const BUTTON_VARIANTS = {
  primary:
    'bg-brand-black text-brand-white hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2',
  secondary:
    'bg-brand-yellow text-brand-black hover:bg-brand-yellowDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 font-semibold',
  ghost:
    'bg-transparent text-brand-black hover:bg-brand-grayLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2',
  purple:
    'bg-brand-purple text-white hover:bg-brand-purpleLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 font-semibold',
  cyan:
    'bg-brand-cyan text-white hover:bg-brand-cyanLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 font-semibold',
  orange:
    'bg-brand-orange text-white hover:bg-brand-orangeLight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 font-semibold',
};

const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-6 py-3 text-base font-semibold',
  lg: 'px-8 py-4 text-lg font-semibold',
};

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  isLoading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-button font-medium uppercase tracking-[-0.7125px] transition-all duration-200 ease-out',
        'active:scale-[0.99] hover:scale-[1.02]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  );
}

