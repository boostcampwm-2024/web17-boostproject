import Like from '@/assets/like.svg?react';
import { cn } from '@/utils/cn';

interface ChatMessageProps {
  name: string;
  contents: string;
  likeCount: number;
  liked: boolean;
  onClick: () => void;
}

export const ChatMessage = ({
  name,
  contents,
  likeCount,
  liked,
  onClick,
}: ChatMessageProps) => {
  return (
    <div className="flex">
      <p className="display-bold14 text-dark-gray mr-3 w-fit">{name}</p>
      <div>
        <p className="display-medium14 text-dark-gray">{contents}</p>
        <div className="flex items-center gap-1">
          <Like
            className={cn(
              'hover:fill-orange cursor-pointer',
              liked ? 'fill-orange' : 'fill-gray',
            )}
            onClick={onClick}
          />
          <span className="display-medium12 text-gray">{likeCount}</span>
        </div>
      </div>
    </div>
  );
};
