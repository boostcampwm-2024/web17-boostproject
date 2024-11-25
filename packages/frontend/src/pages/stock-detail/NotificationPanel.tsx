import { useGetLoginStatus } from '@/apis/queries/auth';
import { Alarm, AlarmProps } from '@/components/ui/Alarm';
import mock from '@/mocks/alarm.json';
import { cn } from '@/utils/cn';

interface NotificationPanelProps {
  className?: string;
}

export const NotificationPanel = ({ className }: NotificationPanelProps) => {
  const { goalPrice, method, date } = mock.data[0] as AlarmProps;
  const { data: loginStatus } = useGetLoginStatus();

  return (
    <div
      className={cn(
        'flex flex-col gap-4 overflow-auto rounded-md bg-white p-7 shadow',
        className,
      )}
    >
      <h2 className="display-bold20 text-center font-bold">알림</h2>
      {!loginStatus || loginStatus.message === 'Not Authenticated' ? (
        <p className="text-center">로그인 후 이용 가능해요.</p>
      ) : goalPrice ? (
        <>
          <Alarm goalPrice={goalPrice} method={method} date={date} />
          <Alarm goalPrice={goalPrice} method={method} date={date} />
        </>
      ) : (
        <p className="text-center">현재 설정된 알림이 없어요.</p>
      )}
    </div>
  );
};
