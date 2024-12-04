import { useNavigate } from 'react-router-dom';
import { GetLoginStatus } from '@/apis/queries/auth/schema';
import { useDeleteStockUser } from '@/apis/queries/stock-detail';
import { useGetUserStock } from '@/apis/queries/user/useGetUserStock';
import { Button } from '@/components/ui/button';

interface StockInfoProps {
  loginStatus: GetLoginStatus;
}

export const StockInfo = ({ loginStatus }: StockInfoProps) => {
  return (
    <section className="display-bold20 flex flex-col gap-5 rounded-md bg-white p-7">
      <h2>주식 정보</h2>
      <StockInfoContents loginStatus={loginStatus} />
    </section>
  );
};

const StockInfoContents = ({ loginStatus }: StockInfoProps) => {
  const navigate = useNavigate();

  const { data } = useGetUserStock();
  const { mutate } = useDeleteStockUser();

  const { userStocks } = data || {};

  if (!loginStatus || loginStatus.message === 'Not Authenticated') {
    return (
      <p className="text-dark-gray display-medium14">
        로그인 후 이용 가능해요.
      </p>
    );
  }

  if (userStocks?.length === 0) {
    return (
      <p className="text-dark-gray display-medium14">
        현재 소유한 주식이 없어요.
      </p>
    );
  }

  return (
    <article className="grid gap-5 xl:grid-cols-2">
      {data?.userStocks.map((stock) => (
        <section
          className="display-bold14 text-dark-gray bg-extra-light-gray flex cursor-pointer items-center justify-between rounded px-4 py-2 transition-all duration-300 hover:scale-105 xl:p-8"
          onClick={() => navigate(`/stocks/${stock.stockId}`)}
        >
          <p>{stock.name}</p>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              mutate({ stockId: stock.stockId });
            }}
          >
            삭제
          </Button>
        </section>
      ))}
    </article>
  );
};
