import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePostStockView } from '@/apis/queries/stock-detail';
import {
  type GetStockListRequest,
  useGetStocksByPrice,
} from '@/apis/queries/stocks';
import DownArrow from '@/assets/down-arrow.svg?react';
import { cn } from '@/utils/cn';

const LIMIT = 20;

export const StockRankingTable = () => {
  const [sortType, setSortType] =
    useState<GetStockListRequest['sortType']>('increase');

  const { data } = useGetStocksByPrice({ limit: LIMIT, sortType });
  const { mutate } = usePostStockView();

  return (
    <div className="rounded-md bg-white px-6 shadow">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-4/12" />
          <col className="w-2/12" />
          <col className="w-2/12" />
          <col className="w-2/12" />
          <col className="w-2/12" />
        </colgroup>
        <thead>
          <tr className="display-medium12 text-dark-gray border-light-gray border-b text-left [&>*]:p-4 [&>*]:py-3">
            <th>종목</th>
            <th className="text-right">현재가</th>
            <th className="flex items-center justify-end gap-1 text-right">
              <p>등락률({sortType === 'increase' ? '상승순' : '하락순'})</p>
              <DownArrow
                className={cn(
                  'cursor-pointer',
                  sortType === 'increase' ? 'rotate-0' : 'rotate-180',
                )}
                onClick={() =>
                  setSortType((prev) => {
                    if (prev === 'increase') return 'decrease';
                    return 'increase';
                  })
                }
              />
            </th>
            <th className="text-right">거래대금</th>
            <th className="text-right">거래량</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((stock, index) => (
            <tr
              key={stock.id}
              className="display-medium14 text-dark-gray text-right [&>*]:p-4"
            >
              <td className="flex gap-6 text-left">
                <span className="text-gray w-3 flex-shrink-0">{index + 1}</span>
                <Link
                  to={`${stock.id}`}
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
                {stock.changeRate >= 0 && '+'}
                {stock.changeRate}%
              </td>
              <td>{stock.volume?.toLocaleString()}원</td>
              <td>{stock.marketCap?.toLocaleString()}주</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
