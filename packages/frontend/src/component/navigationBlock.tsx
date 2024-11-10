import React from 'react';
import SearchSvg from '@/assets/search.svg.tsx';

interface NavItemProps {
  SvgComponent: React.FC;
  label: string;
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
    <li className="w-full">
      <a className={boxClassName}>
        <SvgComponent />
        <span
          className={`${!isOpen ? 'opacity-0' : ''} box-border w-full whitespace-nowrap`}
        >
          {label}
        </span>
      </a>
    </li>
  );
};

export const SearchBox: React.FC = () => {
  return (
    <li className="h-[45px] w-full">
      <a className={boxClassName}>
        <SearchSvg />
        <input
          className="bg-light-orange h-full w-full rounded-r-xl outline-none"
          type="search"
          placeholder="search..."
        />
      </a>
    </li>
  );
};