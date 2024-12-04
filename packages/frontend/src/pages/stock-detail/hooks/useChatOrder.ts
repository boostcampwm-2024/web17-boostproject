import { useState } from 'react';

type OrderType = 'latest' | 'like';

export const useChatOrder = () => {
  const [order, setOrder] = useState<OrderType>('latest');
  const handleOrderType = () =>
    setOrder((prev) => (prev === 'latest' ? 'like' : 'latest'));

  return { order, handleOrderType };
};
