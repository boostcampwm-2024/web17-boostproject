import Bell from '@/assets/bell.svg?react';
import Home from '@/assets/home.svg?react';
import Search from '@/assets/search.svg?react';
import Stock from '@/assets/stock.svg?react';
import Theme from '@/assets/theme.svg?react';
import User from '@/assets/user.svg?react';
import { type MenuSection } from '@/types/menu';

export const TOP_MENU_ITEMS: MenuSection[] = [
  { id: 1, icon: <Search className="w-7" />, text: '검색' },
  { id: 2, icon: <Home className="w-7" />, text: '홈', path: '/' },
  {
    id: 3,
    icon: <Stock className="w-7" />,
    text: '주식',
    path: '/stocks/005930',
  },
  { id: 4, icon: <Bell className="w-7" />, text: '알림' },
];

export const BOTTOM_MENU_ITEMS: MenuSection[] = [
  { id: 1, icon: <Theme className="w-7" />, text: '다크모드' },
  {
    id: 2,
    icon: <User className="w-7" />,
    text: '마이페이지',
    path: '/my-page',
  },
];
