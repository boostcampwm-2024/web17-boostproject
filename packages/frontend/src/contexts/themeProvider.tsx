import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeContext } from './themeContext';
import { useGetLoginStatus } from '@/apis/queries/auth';
import {
  GetUserTheme,
  useGetUserTheme,
  usePatchUserTheme,
} from '@/apis/queries/user';

export const ThemeProvider = () => {
  const { data: loginStatus } = useGetLoginStatus();
  const { data: userTheme } = useGetUserTheme();
  const { mutate: updateTheme } = usePatchUserTheme();

  const isAuthenticated = loginStatus?.message === 'Authenticated';
  const initialTheme = isAuthenticated
    ? userTheme
    : localStorage.getItem('juchumTheme');
  const [theme, setTheme] = useState<GetUserTheme['theme']>(
    initialTheme as GetUserTheme['theme'],
  );

  document.body.classList.toggle('dark', theme === 'dark');

  const changeTheme = (newTheme: GetUserTheme['theme']) => {
    localStorage.setItem('juchumTheme', newTheme);
    setTheme(newTheme);

    if (isAuthenticated) {
      updateTheme({ theme: newTheme });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <Outlet />
    </ThemeContext.Provider>
  );
};
