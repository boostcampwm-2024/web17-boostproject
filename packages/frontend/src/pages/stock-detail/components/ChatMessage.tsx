import { MouseEventHandler } from 'react';
import Like from '@/assets/like.svg?react';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/formatDate';

interface ChatMessageProps {
  name: string;
  contents: string;
  likeCount: number;
  liked: boolean;
  subName: string;
  createdAt: string;
  onClick: MouseEventHandler<SVGElement>;
  writer: boolean;
}

export const ChatMessage = ({
  name,
  contents,
  likeCount,
  liked,
  subName,
  createdAt,
  onClick,
  writer,
}: ChatMessageProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p
          className={cn(
            'display-medium14 text-dark-gray w-fit',
            writer && 'text-orange',
          )}
        >
          {name}
        </p>
        <p
          className="display-medium12 text-gray cursor-pointer"
          title="사용자 구분을 위한 식별번호"
        >
          {subName}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p
          className={cn(
            'display-bold14 w-full whitespace-pre-wrap rounded p-2 py-3',
            writer ? 'bg-light-yellow' : 'bg-extra-light-gray',
          )}
        >
          {contents}
        </p>
        <div className="flex flex-col items-center">
          <Like
            className={cn(
              'hover:fill-orange cursor-pointer',
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
      <p className="display-medium12 text-gray">{formatDate(createdAt)}</p>
    </div>
  );
};
