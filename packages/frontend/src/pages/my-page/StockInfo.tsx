import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { GetLoginStatus } from '@/apis/queries/auth/schema';
import { useGetUserStock } from '@/apis/queries/auth/useGetUserStock';
import { useDeleteStockUser } from '@/apis/queries/stock-detail';
import { Button } from '@/components/ui/button';

interface StockInfoProps {
  loginStatus: GetLoginStatus;
}

export const StockInfo = ({ loginStatus }: StockInfoProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data } = useGetUserStock();
  const { mutate } = useDeleteStockUser({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userStock'] }),
  });

  const { userStocks } = data || {};

  return (
    <section className="display-bold20 flex flex-col gap-5 rounded-md bg-white p-7">
      <h2>주식 정보</h2>
      {loginStatus?.message === 'Authenticated' ? (
        userStocks?.length === 0 ? (
          <p className="display-medium14 text-dark-gray">
            소유한 주식이 없습니다.
          </p>
        ) : (
          <article className="grid grid-cols-2 gap-5">
            {data?.userStocks.map((stock) => (
              <section
                className="display-bold14 text-dark-gray flex cursor-pointer justify-between rounded bg-[#FAFAFA] p-10 transition-all duration-300 hover:scale-105"
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
        )
      ) : (
        <p className="display-medium14 text-dark-gray">
          로그인 후 이용 가능합니다.
        </p>
      )}
    </section>
  );
};
