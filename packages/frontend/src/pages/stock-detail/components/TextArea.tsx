import Send from '@/assets/send.svg?react';

export const TextArea = () => {
  return (
    <div className="relative w-full">
      <textarea
        maxLength={100}
        placeholder="주주 사용자만 입력 가능해요."
        className="display-medium12 bg-light-yellow h-20 w-full resize-none rounded-md p-3 pr-10 focus:outline-none"
      ></textarea>
      <button className="bg-orange absolute right-2 top-1/2 -translate-y-1/2 rounded p-1">
        <Send />
      </button>
    </div>
  );
};
