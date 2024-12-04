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
  const { data: userTheme } = useGetUserTheme();
  const { mutate: updateTheme } = usePatchUserTheme();

  const initialTheme = isLoggedIn ? userTheme : localStorage.getItem('theme');
  const [theme, setTheme] = useState<GetUserTheme['theme']>(
    initialTheme as GetUserTheme['theme'],
  );

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
