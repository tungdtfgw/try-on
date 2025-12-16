import { cn } from '../../utils/cn';
import { forwardRef } from 'react';

const Input = forwardRef(function Input({
  className,
  label,
  error,
  hint,
  required,
  id,
  ...props
}, ref) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-base font-semibold text-brand-black"
        >
          {label} {required ? <span className="text-red-600">*</span> : null}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-12 w-full rounded-sm bg-white px-4 py-3 text-base text-brand-grayDark',
          'border-2 border-[#D9DDE9]',
          'placeholder:text-[#767676] placeholder:text-sm',
          'focus:outline-none focus:ring-0 focus:border-2 focus:border-brand-black',
          'disabled:bg-brand-grayLight disabled:cursor-not-allowed',
          'transition-colors duration-200',
          error ? 'border-red-400 focus:border-red-500' : '',
          className
        )}
        {...props}
      />
      {hint && !error ? (
        <p className="text-xs text-brand-grayMedium">{hint}</p>
      ) : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
});

export default Input;

