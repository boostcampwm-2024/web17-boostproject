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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(chatText);
    setChatText('');
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <textarea
        maxLength={100}
        value={chatText}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'display-medium12 bg-light-yellow h-20 w-full resize-none rounded-md p-3 pr-10 focus:outline-none',
          disabled && 'cursor-not-allowed',
        )}
        onChange={(e) => setChatText(e.target.value)}
      />
      <button
        className={cn(
          'bg-orange absolute right-2 top-1/2 -translate-y-1/2 rounded p-1',
          disabled && 'cursor-not-allowed',
        )}
      >
        <Send />
      </button>
    </form>
  );
};
