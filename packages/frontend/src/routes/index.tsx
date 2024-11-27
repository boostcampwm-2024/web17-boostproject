import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layouts';
import { Home } from '@/pages/home';
import { Login } from '@/pages/login';
import { MyPage } from '@/pages/my-page';
import { StockDetail } from '@/pages/stock-detail';
import { Stocks } from '@/pages/stocks';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Stocks />,
      },
      // {
      //   path: '/stocks',
      //   element: <Stocks />,
      // },
      {
        path: 'stocks/:stockId',
        element: <StockDetail />,
      },
      {
        path: '/my-page',
        element: <MyPage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
]);
