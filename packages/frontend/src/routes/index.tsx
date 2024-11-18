import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layouts';
import { Home } from '@/pages/home';
import { MyPage } from '@/pages/my-page';
import { StockDetail } from '@/pages/stock-detail';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        // TODO: 주식 메인페이지 만들어지면 path 바꿀것
        path: '/stocks',
        element: <StockDetail />,
      },
      {
        path: '/my-page',
        element: <MyPage />,
      },
    ],
  },
]);
