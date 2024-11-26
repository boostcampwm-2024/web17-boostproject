import Date from '@/assets/date.svg?react';
import Flag from '@/assets/flag.svg?react';
import Bell from '@/assets/small-bell.svg?react';

export interface AlarmProps {
  goalPrice?: number;
  method?: 'push' | 'email';
  date?: string;
}

export const Alarm = ({ goalPrice, method, date }: AlarmProps) => {
  return (
    <article className="display-medium14 text-dark-gray flex flex-col gap-2 rounded-md bg-[#f6f6f6] p-4">
      <span className="flex items-center gap-2">
        <Flag />
        목표가: {goalPrice?.toLocaleString()}원
      </span>
      <span className="flex items-center gap-2">
        <Bell />
        {method === 'push' ? '웹 푸시' : '이메일'} 알림
      </span>
      <span className="flex items-center gap-2">
        <Date />
        {date}
      </span>
      <section>
        <button className="mr-2">수정</button>
        <button>삭제</button>
      </section>
    </article>
  );
};
