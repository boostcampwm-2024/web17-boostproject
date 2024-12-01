import { MouseEventHandler } from 'react';
import Like from '@/assets/like.svg?react';
import { cn } from '@/utils/cn';

interface ChatMessageProps {
  name: string;
  contents: string;
  likeCount: number;
  liked: boolean;
  onClick: MouseEventHandler<SVGElement>;
  writer: boolean;
}

export const ChatMessage = ({
  name,
  contents,
  likeCount,
  liked,
  onClick,
  writer,
}: ChatMessageProps) => {
  return (
    <div className={cn('flex flex-col', writer ? 'items-end' : '')}>
      <p
        className={cn(
          'display-bold14 text-dark-gray w-fit',
          writer && 'text-orange',
        )}
      >
        {name}
      </p>
      <div className="flex flex-col gap-2">
        <p className="display-medium14 text-dark-gray">{contents}</p>
        <div
          className={cn('flex items-center gap-1', writer ? 'justify-end' : '')}
        >
          <Like
            className={cn(
              'hover:fill-orange active:fill-orange cursor-pointer',
              liked ? 'fill-orange' : 'fill-gray',
            )}
            onClick={onClick}
          />
          <span
            className={cn(
              'display-medium12',
              liked ? 'text-orange' : 'text-gray',
            )}
          >
            {likeCount}
          </span>
        </div>
      </div>
    </div>
  );
};
