import { type FormEvent, useState } from 'react';
import Send from '@/assets/send.svg?react';

interface TextAreaProps {
  onSend: (text: string) => void;
}

export const TextArea = ({ onSend }: TextAreaProps) => {
  const [chatText, setChatText] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSend(chatText);
    setChatText('');
  };

  return (
    <form className="relative w-full" onSubmit={(e) => handleSubmit(e)}>
      <textarea
        maxLength={100}
        value={chatText}
        placeholder="주주 사용자만 입력 가능해요."
        className="display-medium12 bg-light-yellow h-20 w-full resize-none rounded-md p-3 pr-10 focus:outline-none"
        onChange={(e) => setChatText(e.target.value)}
      />
      <button className="bg-orange absolute right-2 top-1/2 -translate-y-1/2 rounded p-1">
        <Send />
      </button>
    </form>
  );
};
