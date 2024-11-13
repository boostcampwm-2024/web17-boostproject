import { Link } from 'react-router-dom';
import google from '@/assets/google.png';
import kakao from '@/assets/kakao.png';
import naver from '@/assets/naver.png';

interface LoginButtonProps {
  to: string;
  src: string;
  alt: string;
}

export const Login = () => {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center gap-16">
      <h1 className="display-medium20 text-dark-gray text-center">
        스마트한 투자의 첫걸음, <br /> 주춤주춤과 함께해요!
      </h1>
      <section className="flex flex-col gap-4">
        <LoginButton to="/" src={google} alt="구글 로그인" />
        <LoginButton to="/" src={kakao} alt="카카오 로그인" />
        <LoginButton to="/" src={naver} alt="네이버 로그인" />
      </section>
    </div>
  );
};

export const LoginButton = ({ to, src, alt }: LoginButtonProps) => {
  return (
    <Link to={to} className="w-72 shadow-sm">
      <img src={src} alt={alt} />
    </Link>
  );
};
