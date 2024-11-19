import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export const ButtonVariants = cva(
  `display-bold12 border rounded shadow-black py-1`,
  {
    variants: {
      backgroundColor: {
        default: 'bg-white hover:bg-orange',
        gray: 'bg-gray',
        orange: 'bg-orange hover:bg-white',
      },
      textColor: {
        default: 'text-orange hover:text-white',
        white: 'text-white hover:text-orange',
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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: ReactNode;
}

export const Button = ({
  type = 'button',
  backgroundColor,
  textColor,
  size,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
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
