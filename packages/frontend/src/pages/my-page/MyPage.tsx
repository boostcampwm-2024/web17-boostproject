import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AlarmInfo } from './AlarmInfo';
import { StockInfo } from './StockInfo';
import { UserInfo } from './UserInfo';
import { LoginContext } from '@/contexts/login';

export const MyPage = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <div>
      <h1 className="display-bold24 mb-16">마이페이지</h1>
      <article className="grid gap-5 lg:h-[40rem] lg:grid-cols-[1.5fr_2.5fr]">
        <section className="grid grid-rows-[1fr_2fr] gap-5">
          <section className="rounded-md bg-white p-7">
            {isLoggedIn ? (
              <UserInfo />
            ) : (
              <Link
                to="/login"
                className="display-bold20 text-blue hover:underline"
              >
                로그인
              </Link>
            )}
          </section>
          <AlarmInfo />
        </section>
        <StockInfo />
      </article>
    </div>
  );
};
