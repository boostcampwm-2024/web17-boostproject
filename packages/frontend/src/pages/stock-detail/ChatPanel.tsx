import { TextArea } from './components';
import DownArrow from '@/assets/down-arrow.svg?react';

export const ChatPanel = () => {
  return (
    <article className="flex flex-col gap-5 rounded-md bg-white p-7">
      <h2 className="display-medium20 text-center">채팅</h2>
      <TextArea />
      <div className="border-light-gray flex items-center justify-end gap-1 border-b-2 pb-2">
        <p className="display-medium12 text-dark-gray">최신순</p>
        <DownArrow className="cursor-pointer" />
      </div>
      <section className="flex flex-col gap-5"></section>
    </article>
  );
};
