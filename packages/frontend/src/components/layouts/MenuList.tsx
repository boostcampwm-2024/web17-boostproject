import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { type MenuItemData } from '@/constants/menuItems';
import { cn } from '@/utils/cn';

interface MenuListProps {
  items: MenuItemData[];
  isHovered: boolean;
}

interface MenuItemProps {
  icon: ReactNode;
  text: string;
  isHovered: boolean;
  onClick?: () => void;
}

export const MenuList = ({ items, isHovered }: MenuListProps) => {
  const navigate = useNavigate();

  return (
    <ul className="flex flex-col justify-center gap-7">
      {items.map((menu) => {
        const { id, icon, text, url } = menu;
        return (
          <MenuItem
            key={id}
            icon={icon}
            text={text}
            isHovered={isHovered}
            onClick={() => url && navigate(url)}
          />
        );
      })}
    </ul>
  );
};

const MenuItem = ({ icon, text, onClick, isHovered }: MenuItemProps) => {
  return (
    <li className="group flex items-center gap-10" onClick={onClick}>
      <button
        type="button"
        className="fill-gray group-hover:fill-orange group-hover:stroke-orange stroke-gray transition-colors"
      >
        {icon}
      </button>
      <p
        className={cn(
          'text-gray display-medium16 whitespace-nowrap',
          'group-hover:text-orange transition-all group-hover:font-bold',
          isHovered ? 'display' : 'hidden',
        )}
      >
        {text}
      </p>
    </li>
  );
};
