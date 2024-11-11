import {
  AddAlarmForm,
  ChatPanel,
  NotificationPanel,
  StockMetricsPanel,
} from '.';
import Plus from '@/assets/plus.svg?react';
import { Button } from '@/components/ui';

export const StockDetail = () => {
  return (
    <div className="flex flex-col gap-7 px-60 py-14">
      <header className="flex gap-7">
        <h1 className="display-bold24">삼성전자</h1>
        <Button
          backgroundColor="white"
          textColor="orange"
          type="button"
          className="flex items-center justify-center gap-1"
        >
          <Plus /> 내 주식 추가
        </Button>
      </header>
      <article className="grid grid-cols-[2fr_1fr_1fr] gap-5 [&_section]:gap-5">
        <section className="flex flex-col">
          <div className="h-[23rem] border">graph</div>
          <StockMetricsPanel />
        </section>
        <ChatPanel />
        <section className="grid grid-rows-2">
          <NotificationPanel />
          <AddAlarmForm />
        </section>
      </article>
    </div>
  );
};
