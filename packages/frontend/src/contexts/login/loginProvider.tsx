import { type ReactNode } from 'react';
import { LoginContext } from './loginContext';
import { useGetLoginStatus } from '@/apis/queries/auth';

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider = ({ children }: LoginProviderProps) => {
  const { data: loginStatus } = useGetLoginStatus();

  if (!loginStatus) return;
  const { message, nickname, subName } = loginStatus;

  return (
    <LoginContext.Provider
      value={{ isLoggedIn: message === 'Authenticated', nickname, subName }}
    >
      {children}
    </LoginContext.Provider>
  );
};
