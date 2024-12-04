import { Link } from 'react-router-dom';
import { AlarmInfo } from './AlarmInfo';
import { StockInfo } from './StockInfo';
import { UserInfo } from './UserInfo';
import { useGetLoginStatus } from '@/apis/queries/auth';

export const MyPage = () => {
  const { data: loginStatus } = useGetLoginStatus();

  if (!loginStatus) return <></>;

  return (
    <div>
      <h1 className="display-bold24 mb-16">마이페이지</h1>
      <article className="grid gap-5 lg:h-[40rem] lg:grid-cols-[1.5fr_2.5fr]">
        <section className="grid grid-rows-[1fr_2fr] gap-5">
          <section className="rounded-md bg-white p-7">
            {loginStatus?.message === 'Authenticated' ? (
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
          <AlarmInfo loginStatus={loginStatus} />
        </section>
        <StockInfo loginStatus={loginStatus} />
      </article>
    </div>
  );
};
