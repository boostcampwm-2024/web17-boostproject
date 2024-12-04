import { FormEvent, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  PostCreateAlarmRequest,
  usePostCreateAlarm,
} from '@/apis/queries/alarm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ALARM_OPTIONS, type AlarmOptionName } from '@/constants/alarmOptions';
import { LoginContext } from '@/contexts/login';
import { cn } from '@/utils/cn';

interface AddAlarmFormProps {
  className?: string;
}

interface AlarmInfo {
  option: AlarmOptionName;
  value: number;
  endDate: string;
}

export const AddAlarmForm = ({ className }: AddAlarmFormProps) => {
  const { stockId = '' } = useParams();
  const { mutate } = usePostCreateAlarm();
  const { isLoggedIn } = useContext(LoginContext);

  const [alarmInfo, setAlarmInfo] = useState<AlarmInfo>({
    option: ALARM_OPTIONS[0].name,
    value: 0,
    endDate: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      alert('로그인 후 이용 가능해요.');
      return;
    }

    if (!alarmInfo.endDate) {
      alert('알림을 받을 기한을 선택해주세요.');
      return;
    }

    const { option, value, endDate } = alarmInfo;

    const requestData: PostCreateAlarmRequest = {
      stockId,
      [option]: value,
      alarmDate: endDate,
    };

    mutate(requestData, {
      onSuccess: () => {
        alert('알림이 등록되었어요!');
        setAlarmInfo({ option: ALARM_OPTIONS[0].name, value: 0, endDate: '' });
      },
      onError: () => alert('예기치 못한 문제가 발생했어요. 다시 시도해주세요.'),
    });
  };

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
              <select
                className="display-medium14 bg-white focus:outline-none"
                value={alarmInfo.option}
                onChange={(e) =>
                  setAlarmInfo((prev) => ({
                    ...prev,
                    option: e.target.value as AlarmOptionName,
                  }))
                }
              >
                {ALARM_OPTIONS.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="1,000"
                value={alarmInfo.value}
                onChange={(e) =>
                  setAlarmInfo((prev) => ({ ...prev, value: +e.target.value }))
                }
                className="w-full text-right"
              />
            </section>
          </article>
          <article className="flex flex-col gap-2">
            <p className="display-bold16">언제까지 알림을 보낼까요?</p>
            <Input
              type="date"
              value={alarmInfo.endDate}
              onChange={(e) =>
                setAlarmInfo((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="display-medium14"
            />
          </article>
        </div>
        <Button type="submit">알림 추가하기</Button>
      </form>
    </div>
  );
};
