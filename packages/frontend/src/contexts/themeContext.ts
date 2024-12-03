import { createContext } from 'react';
import { GetUserTheme } from '@/apis/queries/user';

interface ThemeContextType {
  theme: GetUserTheme['theme'];
  changeTheme: (newTheme: GetUserTheme['theme']) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  changeTheme: () => {},
});
