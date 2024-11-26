import { Button } from '@/components/ui/button';
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
            <section className="flex">
              <select className="display-medium14 focus:outline-none">
                {ALARM_OPTIONS.map((option) => (
                  <option key={option.id} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="1,000"
                className="border-gray border-b-[1px] text-right focus:outline-none"
              />
            </section>
          </article>
          <article className="flex flex-col gap-2">
            <p className="display-bold16">어떻게 알림을 보낼까요?</p>
            <section className="flex items-center">
              <input type="radio" name="method" id="push" checked />
              <label htmlFor="push" className="display-medium14">
                웹 푸시
              </label>
              <input type="radio" name="method" id="email" />
              <label htmlFor="email" className="display-medium14">
                이메일
              </label>
            </section>
          </article>
          <article className="flex flex-col gap-2">
            <p className="display-bold16">언제까지 알림을 보낼까요?</p>
            <input
              type="date"
              className="display-medium14 focus:outline-none"
            />
          </article>
        </div>
        <Button>알림 추가하기</Button>
      </form>
    </div>
  );
};
