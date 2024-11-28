import { type FormEvent, useState } from 'react';
import Send from '@/assets/send.svg?react';
import { cn } from '@/utils/cn';

interface TextAreaProps {
  disabled: boolean;
  onSend: (text: string) => void;
  placeholder: string;
}

export const TextArea = ({ disabled, onSend, placeholder }: TextAreaProps) => {
  const [chatText, setChatText] = useState('');
  const [inputCount, setInputCount] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(chatText);
    setChatText('');
    setInputCount(0);
  };

  return (
    <div className="flex flex-col">
      <form className="relative w-full" onSubmit={handleSubmit}>
        <textarea
          maxLength={100}
          value={chatText}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus
          className={cn(
            'display-medium12 border-light-yellow h-20 w-full resize-none rounded-md border-4 p-3 pr-10 focus:outline-none',
            disabled && 'bg-light-gray/40 cursor-not-allowed',
          )}
          onChange={(e) => {
            setChatText(e.target.value);
            setInputCount(e.target.value.length);
          }}
        />
        <button
          className={cn(
            'bg-orange absolute right-2 top-1/2 -translate-y-1/2 rounded p-2',
            disabled && 'cursor-not-allowed',
          )}
        >
          <Send />
        </button>
      </form>
      <span className={cn('display-medium12', inputCount > 100 && 'text-red')}>
        {inputCount}자/100자
      </span>
    </div>
  );
};
