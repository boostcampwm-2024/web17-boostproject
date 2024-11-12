import React from 'react';
import SearchSvg from '@/assets/search.svg';

interface SearchBoxProps {
  isOpen: boolean;
}

const boxClassName =
  'hover:bg-orange flex h-full w-full items-center gap-4 rounded-xl transition-colors duration-500';

export const NavigationBlock: React.FC<NavItemProps> = ({
  SvgComponent,
  label,
  isOpen,
}) => {
  return (
    <li className="h-[3.5rem] w-full">
      <a className={boxClassName}>
        <SvgComponent
          width={'2rem'}
          height={'2rem'}
          className={'min-w-[73px]'}
        />
        <span
          className={`${!isOpen ? 'opacity-0' : ''} text-gray display-bold16 box-border w-full whitespace-nowrap`}
        >
          {label}
        </span>
      </a>
    </li>
  );
};

export const SearchBox: React.FC<SearchBoxProps> = ({ isOpen }) => {
  return (
    <li className="h-[3.5rem] w-full">
      <a className={boxClassName}>
        <SearchSvg width={'2rem'} height={'2rem'} className={'min-w-[73px]'} />
        <input
          className={`bg-light-orange ${!isOpen ? 'opacity-0' : 'opacity-100'} display-bold16 text-gray h-full w-full rounded-r-xl pl-2 opacity-0 outline-none`}
          type="search"
          placeholder="search..."
        />
      </a>
    </li>
  );
};
