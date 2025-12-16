import { cn } from '../../utils/cn';
import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea({
  className,
  label,
  error,
  hint,
  required,
  id,
  rows = 4,
  ...props
}, ref) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-brand-grayDark"
        >
          {label} {required ? <span className="text-red-600">*</span> : null}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={cn(
          'w-full rounded-sm bg-white px-[7.3px] py-[6.5px] text-sm text-brand-grayDark',
          'border border-[#D9DDE9]',
          'placeholder:text-[#767676] placeholder:text-[6.5px]',
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

export default Textarea;

