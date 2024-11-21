import Like from '@/assets/like.svg?react';
import { cn } from '@/utils/cn';

interface ChatMessageProps {
  name: string;
  contents: string;
  likeCount: number;
  liked: boolean;
}

export const ChatMessage = ({
  name,
  contents,
  likeCount,
  liked,
}: ChatMessageProps) => {
  return (
    <div className="flex">
      <p className="display-bold12 text-dark-gray mr-3 w-12 flex-shrink-0">
        {name}
      </p>
      <div>
        <p className="display-medium12 text-dark-gray">{contents}</p>
        <div className="flex items-center gap-1">
          <Like
            className={
              (cn('hover:fill-orange cursor-pointer'),
              liked ? 'fill-orange' : 'fill-gray')
            }
          />
          <span className="display-medium12 text-gray">{likeCount}</span>
        </div>
      </div>
    </div>
  );
};
