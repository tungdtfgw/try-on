import { cn } from '../../utils/cn';

const ALERT_VARIANTS = {
  success: 'bg-green-50 text-green-900 border-green-200',
  error: 'bg-red-50 text-red-900 border-red-200',
  info: 'bg-white text-brand-grayDark border-black/10',
};

export default function Alert({ className, variant = 'info', title, children }) {
  return (
    <div
      className={cn(
        'rounded-md border px-4 py-3 text-sm leading-relaxed',
        ALERT_VARIANTS[variant],
        className
      )}
      role="status"
    >
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

