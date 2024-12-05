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
import { useSubscribeAlarm } from '@/hooks/useSubscribeAlarm';
import { cn } from '@/utils/cn';

interface AddAlarmFormProps {
  className?: string;
}

interface AlarmInfo {
  option: AlarmOptionName;
  value: number;
  endDate: string | null;
}

export const AddAlarmForm = ({ className }: AddAlarmFormProps) => {
  const { stockId = '' } = useParams();
  const { mutate } = usePostCreateAlarm();
  const { isLoggedIn } = useContext(LoginContext);
  const { subscribeAlarm } = useSubscribeAlarm();

  const [alarmInfo, setAlarmInfo] = useState<AlarmInfo>({
    option: ALARM_OPTIONS[0].name,
    value: 0,
    endDate: null,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoggedIn) {
      alert('로그인 후 이용 가능해요.');
      return;
    }

    subscribeAlarm();
    const { option, value, endDate } = alarmInfo;

    const requestData: PostCreateAlarmRequest = {
      stockId,
      [option]: value,
      alarmExpiredDate: endDate,
    };

    mutate(requestData, {
      onSuccess: () => {
        alert('알림이 등록되었어요!');
        setAlarmInfo({
          option: ALARM_OPTIONS[0].name,
          value: 0,
          endDate: null,
        });
      },
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
        className="text-dark-gray flex h-full flex-col items-center justify-between gap-16"
      >
        <div className="flex flex-col gap-16">
          <article className="flex flex-col gap-4">
            <div>
              <p className="display-bold16">언제 알림을 보낼까요?</p>
              <p className="display-medium12 text-gray">
                알림을 받고 싶은 도달 가격을 설정하세요.
              </p>
            </div>
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
          <article className="flex flex-col gap-5">
            <div>
              <p className="display-bold16">언제까지 알림을 보낼까요?</p>
              <p className="display-medium12 text-gray">
                알림 종료 일자를 선택하세요.
                <br /> 미 선택시 무기한으로 설정됩니다.
              </p>
            </div>
            <Input
              type="date"
              value={alarmInfo.endDate ?? ''}
              onChange={(e) =>
                setAlarmInfo((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="display-medium14 w-full"
            />
          </article>
        </div>
        <Button type="submit">알림 추가하기</Button>
      </form>
    </div>
  );
};
