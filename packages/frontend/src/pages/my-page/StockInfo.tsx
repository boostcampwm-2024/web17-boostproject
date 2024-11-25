import { GetLoginStatus } from '@/apis/queries/auth/schema';

interface StockInfoProps {
  loginStatus: GetLoginStatus;
}

export const StockInfo = ({ loginStatus }: StockInfoProps) => {
  return (
    <section className="display-bold20 flex flex-col gap-5 rounded-md bg-white p-7">
      <h2>주식 정보</h2>
      {loginStatus?.message === 'Authenticated' ? (
        <></>
      ) : (
        <p className="display-medium14 text-dark-gray">
          로그인 후 이용 가능합니다.
        </p>
      )}
    </section>
  );
};
