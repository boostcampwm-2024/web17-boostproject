import { cn } from '@/utils/cn';

interface SearchProps {
  className?: string;
}

export const Alarm = ({ className }: SearchProps) => {
  return (
    <div className={cn('flex flex-col gap-16 bg-white p-10 shadow', className)}>
      <article>
        <h3 className="display-bold24 mb-2">알림</h3>
        <p className="display-medium16 text-dark-gray">
          <span className="text-orange">1개</span>의 알림이 있어요.
        </p>
      </article>
      <article className="flex flex-col gap-3">
        <h4>오늘</h4>
        <section className="flex items-start gap-4">
          <div className="bg-orange mt-2 h-2 w-2 rounded-full" />
          <p className="text-gray w-48">
            <span className="text-orange">삼성전자</span>의 현재가는 00원이에요.
          </p>
        </section>
      </article>
      <article className="flex flex-col gap-3">
        <h4>이전</h4>
      </article>
    </div>
  );
};
