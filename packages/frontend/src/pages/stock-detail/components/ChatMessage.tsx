import Like from '@/assets/like.svg?react';

interface ChatMessageProps {
  name: string;
  contents: string;
  like: number;
}

export const ChatMessage = ({ name, contents, like }: ChatMessageProps) => {
  return (
    <div className="flex">
      <p className="display-bold12 text-dark-gray mr-3 w-12 flex-shrink-0">
        {name}
      </p>
      <div>
        <p className="display-medium12 text-dark-gray">{contents}</p>
        <div className="flex items-center gap-1">
          <Like className="fill-gray hover:fill-orange cursor-pointer" />
          <span className="display-medium12 text-gray">{like}</span>
        </div>
      </div>
    </div>
  );
};
