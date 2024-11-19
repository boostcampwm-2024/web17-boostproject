import { type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = ({ placeholder, className, ...props }: InputProps) => {
  return (
    <input
      placeholder={placeholder}
      className={cn(
        'border-dark-gray w-36 border-b focus:outline-none',
        className,
      )}
      {...props}
    />
  );
};
