import { Link } from 'react-router-dom';
import { useGetTestLogin } from '@/apis/queries/auth/useGetTestLogin';
import Google from '@/assets/google.svg?react';
import { Button } from '@/components/ui/button';

export const Login = () => {
  const googleLoginUrl = '/api/auth/google/login';
  const { refetch } = useGetTestLogin({ password: 'test', username: 'test' });

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <main className="relative flex flex-col gap-36 rounded-lg bg-gradient-to-br from-[#ffe259] to-[#ffa751] p-16 py-24 shadow-sm dark:from-[#e35f5f] dark:to-[#ead16b]">
        <div className="absolute inset-0 rounded-md bg-white/40 backdrop-blur-sm" />
        <section className="relative z-10">
          <h2 className="display-bold24">스마트한 투자의 첫걸음,</h2>
          <p className="display-medium20">주춤주춤과 함께해요!</p>
        </section>
        <section className="relative z-10 flex flex-col gap-4">
          <Link to={googleLoginUrl} className="w-72" reloadDocument>
            <Button className="flex h-10 w-full items-center justify-center gap-4 px-10 dark:bg-black">
              <Google />
              <span>구글 로그인</span>
            </Button>
          </Link>
          <Link to="/">
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
