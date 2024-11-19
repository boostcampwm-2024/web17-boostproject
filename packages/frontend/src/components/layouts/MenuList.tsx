import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { type MenuSection } from '@/types/menu';
import { cn } from '@/utils/cn';

interface MenuListProps {
  items: MenuSection[];
  isHovered: boolean;
  onItemClick?: (item: MenuSection) => void;
}

interface MenuItemProps {
  icon: ReactNode;
  text: string;
  isHovered: boolean;
  onClick?: () => void;
}

export const MenuList = ({ items, isHovered, onItemClick }: MenuListProps) => {
  const navigate = useNavigate();

  const handleClick = (item: MenuSection) => {
    if (item.path) {
      navigate(item.path);
    }

    onItemClick?.(item);
  };

  return (
    <ul className="flex flex-col justify-center gap-7">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          icon={item.icon}
          text={item.text}
          isHovered={isHovered}
          onClick={() => handleClick(item)}
        />
      ))}
    </ul>
  );
};

const MenuItem = ({ icon, text, isHovered, onClick }: MenuItemProps) => {
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
