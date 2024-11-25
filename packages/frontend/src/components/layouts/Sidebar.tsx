import { useState } from 'react';
import logoCharacter from '/logoCharacter.png';
import logoTitle from '/logoTitle.png';
import { Alarm } from './alarm';
import { MenuList } from './MenuList';
import { Search } from './search';
import { BOTTOM_MENU_ITEMS, TOP_MENU_ITEMS } from '@/constants/menuItems';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { type MenuSection } from '@/types/menu';
import { cn } from '@/utils/cn';

export const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);

  const ref = useOutsideClick(() => {
    if (showSearch) {
      setShowSearch(false);
    }

    if (showAlarm) {
      setShowAlarm(false);
    }
  });

  const handleMenuItemClick = (item: MenuSection) => {
    console.log(item.text);
    if (item.text === '검색') {
      setShowSearch(true);
      setShowAlarm(false);
    }

    if (item.text === '알림') {
      setShowSearch(false);
      setShowAlarm(true);
    }
  };

  return (
    <div ref={ref}>
      <nav
        className={cn(
          'fixed left-0 top-0 z-10 h-full cursor-pointer bg-white px-1 py-4 shadow-md',
          'transition-all duration-300 ease-in-out',
          isHovered ? 'w-60' : 'w-24',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <section className="flex flex-col justify-center gap-8">
          <header className="flex items-center gap-4">
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
              <MenuList items={BOTTOM_MENU_ITEMS} isHovered={isHovered} />
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
        {showSearch && <Search className="h-screen" />}
        {showAlarm && <Alarm className="h-screen" />}
      </div>
    </div>
  );
};
