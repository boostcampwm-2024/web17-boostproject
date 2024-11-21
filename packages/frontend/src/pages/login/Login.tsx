import { Link } from 'react-router-dom';
import google from '@/assets/google.png';

interface LoginButtonProps {
  to: string;
  src: string;
  alt: string;
}

export const Login = () => {
  const googleLoginUrl = '/api/auth/google/login';

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <main className="relative flex flex-col gap-36 rounded-lg bg-gradient-to-br from-[#ffe259] to-[#ffa751] p-16 py-24 shadow-sm">
        <div className="absolute inset-0 rounded-md bg-white/40 backdrop-blur-sm" />
        <section className="relative z-10">
          <h2 className="display-bold24">스마트한 투자의 첫걸음,</h2>
          <p className="display-medium20">주춤주춤과 함께해요!</p>
        </section>
        <section className="relative z-10 flex flex-col gap-4">
          <LoginButton to={googleLoginUrl} src={google} alt="구글 로그인" />
        </section>
      </main>
    </div>
  );
};

export const LoginButton = ({ to, src, alt }: LoginButtonProps) => {
  return (
    <Link to={to} className="w-72">
      <img src={src} alt={alt} />
    </Link>
  );
};
