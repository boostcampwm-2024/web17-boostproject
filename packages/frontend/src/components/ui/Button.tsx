import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export const ButtonVariants = cva(
  `display-bold12 border rounded shadow-black`,
  {
    variants: {
      backgroundColor: {
        default: 'bg-white',
        gray: 'bg-gray',
        white: 'bg-white',
      },
      textColor: {
        default: 'text-white',
        orange: 'text-orange',
      },
      size: {
        default: 'w-24',
        sm: 'w-14',
      },
    },
    defaultVariants: {
      backgroundColor: 'default',
      textColor: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;
}

export const Button = ({
  backgroundColor,
  textColor,
  size,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        ButtonVariants({ backgroundColor, textColor, size }),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
