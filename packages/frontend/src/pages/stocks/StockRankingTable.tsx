import { Link } from 'react-router-dom';
import DownArrow from '@/assets/down-arrow.svg?react';
import stockData from '@/mocks/stock.json';
import { cn } from '@/utils/cn';

export const StockRankingTable = () => {
  return (
    <div className="rounded-md bg-white px-6 shadow">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-1/4" />
          <col className="w-1/5" />
          <col className="w-1/5" />
          <col className="w-1/5" />
          <col className="w-1/5" />
        </colgroup>
        <thead>
          <tr className="display-medium12 text-dark-gray border-light-gray border-b text-left [&>*]:p-4 [&>*]:py-3">
            <th>종목</th>
            <th className="text-right">현재가</th>
            <th className="flex items-center justify-end gap-1 text-right">
              <p> 등락률</p>
              <DownArrow className="cursor-pointer" />
            </th>
            <th className="text-right">거래대금</th>
            <th className="text-right">거래량</th>
          </tr>
        </thead>
        <tbody>
          {stockData.data.map((stock, index) => (
            <tr
              key={stock.id}
              className="display-medium14 text-dark-gray text-right [&>*]:p-4"
            >
              <td className="flex gap-6 text-left">
                <span className="text-gray">{index + 1}</span>
                <Link
                  to={`${stock.id}`}
                  className="display-bold14 hover:text-orange cursor-pointer text-ellipsis hover:underline"
                >
                  {stock.name}
                </Link>
              </td>
              <td>{stock.currentPrice.toLocaleString()}원</td>
              <td
                className={cn(stock.changeRate >= 0 ? 'text-red' : 'text-blue')}
              >
                {stock.changeRate >= 0 && '+'}
                {stock.changeRate.toLocaleString()}원 ({stock.changeRatePercent}
                %)
              </td>
              <td>{stock.tradingVolume.toLocaleString()}원</td>
              <td>{stock.tradingValue.toLocaleString()}주</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
