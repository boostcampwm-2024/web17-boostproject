import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { LoginContext } from '../login';
import { ThemeContext } from './themeContext';
import {
  GetUserTheme,
  useGetUserTheme,
  usePatchUserTheme,
} from '@/apis/queries/user';

export const ThemeProvider = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const { data: userTheme, isLoading } = useGetUserTheme();
  const { mutate: updateTheme } = usePatchUserTheme();

  const [theme, setTheme] = useState<GetUserTheme['theme']>(() => {
    if (!isLoading && isLoggedIn && userTheme) {
      return userTheme;
    }
    const localTheme = localStorage.getItem('theme');
    return (localTheme as GetUserTheme['theme']) || 'light';
  });

  document.body.classList.toggle('dark', theme === 'dark');

  const changeTheme = (newTheme: GetUserTheme['theme']) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);

    if (isLoggedIn) {
      updateTheme({ theme: newTheme });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <Outlet />
    </ThemeContext.Provider>
  );
};
