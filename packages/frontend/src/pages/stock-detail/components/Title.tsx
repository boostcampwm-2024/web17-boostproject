import { type ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
}

export const Title = ({ children }: TitleProps) => {
  return <h3 className="display-bold16 font-bold">{children}</h3>;
};
