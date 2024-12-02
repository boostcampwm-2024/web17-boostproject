import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoCharacter from '/logoCharacter.png';
import logoTitle from '/logoTitle.png';
import { Alarm } from './alarm';
import { MenuList } from './MenuList';
import { Search } from './search';
import { useGetUserTheme } from '@/apis/queries/user/useGetUserTheme';
import { usePatchUserTheme } from '@/apis/queries/user/usePatchUserTheme';
import { BOTTOM_MENU_ITEMS, TOP_MENU_ITEMS } from '@/constants/menuItems';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { type MenuSection } from '@/types/menu';
import { cn } from '@/utils/cn';

type TabKey = 'search' | 'alarm';

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showTabs, setShowTabs] = useState<Record<TabKey, boolean>>({
    search: false,
    alarm: false,
  });

  const { data: theme } = useGetUserTheme();
  const { mutate } = usePatchUserTheme();

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.remove('dark');
      return;
    }
    document.body.classList.add('dark');
  }, [theme]);

  const ref = useOutsideClick(() => {
    setShowTabs({ search: false, alarm: false });
  });

  const handleMenuItemClick = (item: MenuSection) => {
    const tab: Record<string, TabKey> = {
      검색: 'search',
      알림: 'alarm',
    };

    const tabKey = tab[item.text];
    if (tabKey) {
      setShowTabs((prev) =>
        Object.keys(prev).reduce(
          (acc, key) => ({
            ...acc,
            [key]: key === tabKey,
          }),
          {} as Record<TabKey, boolean>,
        ),
      );
    }

    if (item.text === '다크모드') {
      if (theme === 'dark') {
        mutate({ theme: 'light' });
      }
      if (theme === 'light') {
        mutate({ theme: 'dark' });
      }
    }
  };

  return (
    <div ref={ref}>
      <nav
        className={cn(
          'fixed left-0 top-0 z-20 h-full cursor-pointer bg-white px-1 py-4 shadow-md',
          'transition-all duration-300 ease-in-out',
          isHovered ? 'w-60' : 'w-24',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <section className="flex flex-col justify-center gap-8">
          <header
            className="flex items-center gap-4"
            onClick={() => navigate('/')}
          >
            <img src={logoCharacter} alt="로고 캐릭터" className="w-20" />
            <img
              src={logoTitle}
              alt="로고 제목"
              className={cn('w-24 pt-5', isHovered ? 'display' : 'hidden')}
            />
          </header>
          <div
            className={cn(
              'flex h-[calc(100vh-11rem)]',
              isHovered ? 'gap-4' : '',
            )}
          >
            <div className="flex flex-col justify-between pl-7">
              <MenuList
                items={TOP_MENU_ITEMS}
                isHovered={isHovered}
                onItemClick={handleMenuItemClick}
              />
              <MenuList
                items={BOTTOM_MENU_ITEMS}
                isHovered={isHovered}
                onItemClick={handleMenuItemClick}
              />
            </div>
          </div>
        </section>
      </nav>
      <div
        className={cn(
          'fixed top-0 z-10 transition-all duration-300 ease-in-out',
          isHovered ? 'left-60' : 'left-24',
        )}
      >
        {showTabs.search && <Search className="h-screen" />}
        {showTabs.alarm && <Alarm className="h-screen" />}
      </div>
    </div>
  );
};
