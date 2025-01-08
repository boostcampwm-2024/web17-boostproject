import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useGetTestLogin } from '@/apis/queries/auth/useGetTestLogin';
import Google from '@/assets/google.svg?react';
import { Button } from '@/components/ui/button';

const BACKEND_URL = import.meta.env.VITE_BASE_URL;
const GOOGLE_LOGIN = `${BACKEND_URL}/api/auth/google/login`;

export const Login = () => {
  const queryClient = useQueryClient();
  const { refetch, isSuccess } = useGetTestLogin({
    password: 'test',
    username: 'test',
  });

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ['loginStatus'] });
  }

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <main className="relative flex flex-col gap-36 rounded-lg bg-gradient-to-br from-[#ffe259] to-[#ffa751] p-16 py-24 shadow-sm dark:from-[#e26262] dark:to-[#f3d55d]">
        <div className="bg-white/4 absolute inset-0 rounded-md backdrop-blur-sm" />
        <section className="relative z-10">
          <h2 className="display-bold24">스마트한 투자의 첫걸음,</h2>
          <p className="display-medium20">주춤주춤과 함께해요!</p>
        </section>
        <section className="relative z-10 flex flex-col gap-4">
          <Button
            onClick={handleGoogleLogin}
            className="flex h-10 w-72 items-center justify-center gap-4 px-10 dark:bg-black"
          >
            <Google />
            <span>구글 로그인</span>
          </Button>
          <Link to="/" reloadDocument>
            <Button
              onClick={() => refetch()}
              className="h-10 w-full dark:bg-black"
            >
              게스트로 로그인
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
};
