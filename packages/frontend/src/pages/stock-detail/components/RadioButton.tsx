import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface RadioButtonProps extends HTMLAttributes<HTMLInputElement> {
  name: string;
  children: string;
  selected?: boolean;
}

export const RadioButton = ({
  id,
  name,
  children,
  selected,
  ...props
}: RadioButtonProps) => {
  return (
    <div className="flex">
      <input
        type="radio"
        id={id}
        name={name}
        value={id}
        className="hidden"
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          'text-dark-gray hover:text-orange cursor-pointer',
          selected && 'text-orange',
        )}
      >
        {children}
      </label>
    </div>
  );
};
