import { type ReactElement } from 'react';
import Bell from '@/assets/bell.svg?react';
import Home from '@/assets/home.svg?react';
import Search from '@/assets/search.svg?react';
import Stock from '@/assets/stock.svg?react';
import Theme from '@/assets/theme.svg?react';
import User from '@/assets/user.svg?react';

export interface MenuItemData {
  icon: ReactElement;
  text: string;
  id: number;
  url?: string;
}

export const topMenuItems: MenuItemData[] = [
  { icon: <Search className="w-7" />, text: '검색', id: 1 },
  { icon: <Home className="w-7" />, text: '홈', id: 2, url: '/' },
  { icon: <Stock className="w-7" />, text: '주식', id: 3, url: '/stocks' },
  { icon: <Bell className="w-7" />, text: '알림', id: 4 },
];

export const bottomMenuItems: MenuItemData[] = [
  { icon: <Theme className="w-7" />, text: '다크모드', id: 1 },
  {
    icon: <User className="w-7" />,
    text: '마이페이지',
    id: 2,
    url: '/my-page',
  },
];
