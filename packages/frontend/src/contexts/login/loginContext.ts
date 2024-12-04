import { createContext } from 'react';
import { GetLoginStatus } from '@/apis/queries/auth/schema';

interface LoginContextType extends Partial<GetLoginStatus> {
  isLoggedIn: boolean;
}

export const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  nickname: '',
  subName: '',
});
