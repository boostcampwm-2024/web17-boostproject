import { TradingChart } from './TradingChart';
import {
  AddAlarmForm,
  ChatPanel,
  NotificationPanel,
  StockMetricsPanel,
} from '.';
import Plus from '@/assets/plus.svg?react';
import { Button } from '@/components/ui/button';

export const StockDetail = () => {
  return (
    <div className="flex flex-col gap-7">
      <header className="flex gap-7">
        <h1 className="display-bold24">삼성전자</h1>
        <Button
          type="button"
          className="flex items-center justify-center gap-1"
        >
          <Plus /> 내 주식 추가
        </Button>
      </header>
      <article className="grid grid-cols-[2.5fr_1fr_1fr] gap-5 [&_section]:gap-5">
        <section className="flex flex-col">
          <div className="relative h-[30rem]">
            <TradingChart />
          </div>
          <StockMetricsPanel />
        </section>
        <ChatPanel />
        <section className="grid grid-rows-[1fr_2fr]">
          <NotificationPanel />
          <AddAlarmForm />
        </section>
      </article>
    </div>
  );
};
