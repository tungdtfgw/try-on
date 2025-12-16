import { cn } from '../../utils/cn';

export default function Spinner({ className }) {
  return (
    <div
      className={cn(
        'h-10 w-10 animate-spin rounded-full border-2 border-black/15 border-t-brand-black',
        className
      )}
      aria-label="Loading"
      role="status"
    />
  );
}

