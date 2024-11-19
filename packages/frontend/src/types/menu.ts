import { type ReactNode } from 'react';

export interface MenuSection {
  id: number;
  icon: ReactNode;
  text: string;
  path?: string;
}
