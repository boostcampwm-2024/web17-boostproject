import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layouts';
import { ThemeProvider } from '@/contexts/theme';
import { Login } from '@/pages/login';
import { MyPage } from '@/pages/my-page';
import { StockDetail } from '@/pages/stock-detail';
import { Stocks } from '@/pages/stocks';

export const router = createBrowserRouter([
  {
    element: <ThemeProvider />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Stocks />,
          },
          {
            path: '/stocks',
            element: <Stocks />,
          },
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
    ],
  },
]);
