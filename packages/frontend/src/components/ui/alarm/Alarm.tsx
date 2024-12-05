import Date from '@/assets/date.svg?react';
import Flag from '@/assets/flag.svg?react';

export interface AlarmProps {
  option: string;
  goalPrice: number;
  alarmDate: string | null;
}

export const Alarm = ({ option, goalPrice, alarmDate }: AlarmProps) => {
  return (
    <article className="display-medium14 text-dark-gray bg-extra-light-gray flex flex-col gap-2 rounded-md p-4">
      <span className="flex items-center gap-2">
        <Flag />
        {option}: {goalPrice?.toLocaleString()}원
      </span>
      <span className="flex items-center gap-2">
        <Date />
        기한: {alarmDate ? alarmDate.slice(0, 10) : '무기한'}
      </span>
    </article>
  );
};
