import { cn } from '../../utils/cn';
import { forwardRef } from 'react';

const Card = forwardRef(function Card({ className, children, elevated = false, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-md bg-white border border-black/5',
        elevated ? 'shadow-elevated' : 'shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;

