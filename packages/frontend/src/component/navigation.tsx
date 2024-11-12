import { useState } from 'react';
import BellSvg from '@/assets/bell.svg.tsx';
import { DarkLightSVG } from '@/assets/darkLight.svg.tsx';
import GraphSvg from '@/assets/graph.svg.tsx';
import HomeSvg from '@/assets/home.svg.tsx';
import { UserSvg } from '@/assets/user.svg.tsx';
import { NavigationBlock, SearchBox } from '@/component/navigationBlock.tsx';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative">
      <nav
        className={`fixed left-0 top-0 h-full bg-gray-800 ${
          isOpen ? 'w-[260px]' : 'w-[105px]'
        } bg-white p-4 transition-all duration-300 ease-in-out`}
      >
        <header className="relative">
          <div className="flex items-center gap-4">
            <span className="min-w-[96px]">
              <img src="/logo.png" width="96px" alt="logo" />
            </span>
            <div className="whitespace-nowrap">
              <img
                src="/title.png"
                width="78px"
                className={`${!isOpen ? 'opacity-0' : ''}`}
              ></img>
            </div>
          </div>
          <div
            className={`bg-light-orange text-gray absolute right-[-35px] top-2/4 flex h-6 w-6 items-center justify-center rounded-full`}
            onClick={toggleSidebar}
          >
            <span>{isOpen ? '<' : '>'}</span>
          </div>
        </header>
        <div className="mt-4 flex h-[calc(100%-125px)] flex-col justify-between">
          <div>
            <ul className="flex flex-col gap-5">
              <SearchBox isOpen={isOpen} />
              <NavigationBlock
                SvgComponent={HomeSvg}
                label={'홈'}
                isOpen={isOpen}
              />
              <NavigationBlock
                SvgComponent={GraphSvg}
                label={'주식'}
                isOpen={isOpen}
              />
              <NavigationBlock
                SvgComponent={BellSvg}
                label={'알림'}
                isOpen={isOpen}
              />
            </ul>
          </div>
          <div>
            <ul className="flex flex-col gap-4">
              <NavigationBlock
                SvgComponent={DarkLightSVG}
                label={'다크모드'}
                isOpen={isOpen}
              />
              <NavigationBlock
                SvgComponent={UserSvg}
                label={'김부캠님'}
                isOpen={isOpen}
              />
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};