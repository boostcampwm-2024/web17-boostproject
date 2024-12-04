import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteStockUser } from '@/apis/queries/stock-detail';
import { useGetUserStock } from '@/apis/queries/user/useGetUserStock';
import { Button } from '@/components/ui/button';
import { LoginContext } from '@/contexts/login';

export const StockInfo = () => {
  return (
    <section className="display-bold20 flex flex-col gap-5 rounded-md bg-white p-7">
      <h2>주식 정보</h2>
      <StockInfoContents />
    </section>
  );
};

const StockInfoContents = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useGetUserStock();
  const { mutate } = useDeleteStockUser({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userStock'] }),
  });
  const { isLoggedIn } = useContext(LoginContext);

  const { userStocks } = data || {};

  if (!isLoggedIn) {
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
