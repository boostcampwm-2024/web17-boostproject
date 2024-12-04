import { useGetAlarm } from '@/apis/queries/alarm';
import { GetLoginStatus } from '@/apis/queries/auth/schema';
import { Alarm } from '@/components/ui/alarm';

interface AlarmInfoProps {
  loginStatus: GetLoginStatus;
}

export const AlarmInfo = ({ loginStatus }: AlarmInfoProps) => {
  return (
    <section className="display-bold20 flex flex-col gap-5 rounded-md bg-white p-7">
      <h2>알림</h2>
      <AlarmInfoContents loginStatus={loginStatus} />
    </section>
  );
};

const AlarmInfoContents = ({ loginStatus }: AlarmInfoProps) => {
  const { data } = useGetAlarm({
    loginStatus: loginStatus.message === 'Authenticated',
  });

  if (!loginStatus || loginStatus.message === 'Not Authenticated') {
    return (
      <p className="text-dark-gray display-medium14">
        로그인 후 이용 가능해요.
      </p>
    );
  }

  if (!data || data?.length === 0) {
    return (
      <p className="text-dark-gray display-medium14">
        현재 설정된 알림이 없어요.
      </p>
    );
  }

  return data.map((alarm) => (
    <Alarm
      key={alarm.alarmId}
      option={alarm.targetPrice ? '목표가' : '거래가'}
      goalPrice={alarm.targetPrice ?? alarm.targetVolume!}
      alarmDate={alarm.alarmDate}
    />
  ));
};
