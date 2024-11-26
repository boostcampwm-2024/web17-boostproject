import { GetLoginStatus } from '@/apis/queries/auth/schema';
import { Alarm, AlarmProps } from '@/components/ui/Alarm';
import mock from '@/mocks/alarm.json';

interface AlarmInfoProps {
  loginStatus: GetLoginStatus;
}

export const AlarmInfo = ({ loginStatus }: AlarmInfoProps) => {
  const { goalPrice, method, date } = mock.data[0] as AlarmProps;

  return (
    <section className="display-bold20 flex flex-col gap-5 rounded-md bg-white p-7">
      <h2>알림</h2>
      {loginStatus?.message === 'Authenticated' ? (
        <>
          <Alarm goalPrice={goalPrice} method={method} date={date} />
          <Alarm goalPrice={goalPrice} method={method} date={date} />
        </>
      ) : (
        <p className="display-medium14 text-dark-gray">
          로그인 후 이용 가능합니다.
        </p>
      )}
    </section>
  );
};
