import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostStockView } from '@/apis/queries/stock-detail';
import { useGetStocksByPrice } from '@/apis/queries/stocks';
import DownArrow from '@/assets/down-arrow.svg?react';
import { cn } from '@/utils/cn';

const LIMIT = 10;

const StockRankingTable = () => {
  const [sortType, setSortType] = useState<'increase' | 'decrease'>('increase');

  const { data } = useGetStocksByPrice({ limit: LIMIT, type: sortType });
  const { mutate } = usePostStockView();

  const handleSortType = () => {
    setSortType((prev) => {
      if (prev === 'increase') return 'decrease';
      return 'increase';
    });
  };

  return (
    <div className="rounded-md bg-white px-6 shadow">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-3/5 lg:w-4/12" />
          <col className="w-1/5 lg:w-2/12" />
          <col className="w-1/5 lg:w-2/12" />
          <col className="hidden lg:table-cell lg:w-2/12" />
          <col className="hidden lg:table-cell lg:w-2/12" />
        </colgroup>
        <thead>
          <tr className="display-medium12 text-dark-gray border-light-gray border-b text-left [&>*]:p-4 [&>*]:py-3">
            <th>종목</th>
            <th className="text-right">현재가</th>
            <th
              className="flex cursor-pointer items-center justify-end gap-1 text-right"
              onClick={handleSortType}
            >
              <span>
                등락률({sortType === 'increase' ? '상승순' : '하락순'})
              </span>
              <DownArrow
                className={cn(
                  sortType === 'increase' ? 'rotate-0' : 'rotate-180',
                )}
              />
            </th>
            <th className="hidden lg:table-cell lg:text-right">거래대금</th>
            <th className="hidden lg:table-cell lg:text-right">거래량</th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.result.map((stock, index) => (
              <tr
                key={stock.id}
                className="display-medium14 text-dark-gray text-right [&>*]:p-4"
              >
                <td className="flex gap-6 text-left">
                  <span className="text-gray w-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <Link
                    to={`/stocks/${stock.id}`}
                    onClick={() => mutate({ stockId: stock.id })}
                    className="display-bold14 hover:text-orange cursor-pointer text-ellipsis hover:underline"
                    aria-label={stock.name}
                  >
                    {stock.name}
                  </Link>
                </td>
                <td>{stock.currentPrice?.toLocaleString()}원</td>
                <td
                  className={cn(
                    +stock.changeRate >= 0 ? 'text-red' : 'text-blue',
                  )}
                >
                  {stock.changeRate}%
                </td>
                <td className="hidden lg:table-cell">
                  {stock.volume?.toLocaleString()}원
                </td>
                <td className="hidden lg:table-cell">
                  {stock.marketCap?.toLocaleString()}주
                </td>
              </tr>
            ))
          ) : (
            <p className="py-3">종목 정보를 불러오는데 실패했어요.</p>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockRankingTable;
