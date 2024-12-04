import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ALARM_OPTIONS } from '@/constants/alarmOptions';
import { cn } from '@/utils/cn';

interface AddAlarmFormProps {
  className?: string;
}

export const AddAlarmForm = ({ className }: AddAlarmFormProps) => {
  const handleSubmit = () => {};

  return (
    <div
      className={cn(
        'flex flex-col gap-10 overflow-auto rounded-md bg-white p-7 shadow',
        className,
      )}
    >
      <h2 className="display-bold20 text-center font-bold">알림 추가</h2>
      <form
        onSubmit={handleSubmit}
        className="text-dark-gray flex flex-col items-center gap-16"
      >
        <div className="flex flex-col gap-16">
          <article className="flex flex-col gap-2">
            <p className="display-bold16">언제 알림을 보낼까요?</p>
            <section className="flex gap-5">
              <select className="display-medium14 bg-white focus:outline-none">
                {ALARM_OPTIONS.map((option) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="1,000"
                className="w-full text-right"
              />
            </section>
          </article>
          <article className="flex flex-col gap-2">
            <p className="display-bold16">언제까지 알림을 보낼까요?</p>
            <Input type="date" className="display-medium14" />
          </article>
        </div>
        <Button>알림 추가하기</Button>
      </form>
    </div>
  );
};
