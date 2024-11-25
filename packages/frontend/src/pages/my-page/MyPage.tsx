import { Link } from 'react-router-dom';
import { AlarmInfo } from './AlarmInfo';
import { StockInfo } from './StockInfo';
import { useGetLoginStatus } from '@/apis/queries/auth';

export const MyPage = () => {
  const { data: loginStatus } = useGetLoginStatus();

  if (!loginStatus) return <></>;

  return (
    <div>
      <h1 className="display-bold24 mb-16">마이페이지</h1>
      <article className="grid h-[40rem] grid-cols-[1.5fr_2.5fr] gap-5">
        <section className="grid grid-rows-[1fr_2fr] gap-5">
          <section className="display-bold20 rounded-md bg-white p-7">
            {loginStatus?.message === 'Authenticated' ? (
              '내정보'
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
