import { useState } from 'react';
import logoCharacter from '/logoCharacter.png';
import logoTitle from '/logoTitle.png';
import { MenuList } from './MenuList';
import { bottomMenuItems, topMenuItems } from '@/constants/menuItems';
import { cn } from '@/utils/cn';

export const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className={cn(
        'fixed left-0 top-0 h-full cursor-pointer bg-white px-1 py-4 shadow-md',
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
            'flex h-[calc(100vh-11rem)] flex-col justify-between pl-7',
          )}
        >
          <MenuList items={topMenuItems} isHovered={isHovered} />
          <MenuList items={bottomMenuItems} isHovered={isHovered} />
        </div>
      </section>
    </nav>
  );
};
