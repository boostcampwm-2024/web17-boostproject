import { type ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
}

interface MetricItemProps {
  label: string;
  value: string;
}

export const StockMetricsPanel = () => {
  return (
    <article className="flex flex-col gap-10 rounded-md bg-white p-5 shadow-black">
      <section className="flex items-center gap-10">
        <Title>거래량</Title>
        <span className="display-medium14 text-dark-gray">00.000</span>
      </section>
      <section className="flex flex-col gap-3">
        <Title>가격</Title>
        <section className="grid grid-cols-[repeat(4,100px)] items-center gap-3">
          <MetricItem label="현재가" value="00.000" />
          <MetricItem label="52주 최고가" value="00.000" />
          <MetricItem label="변동률" value="00.000" />
          <MetricItem label="52주 최저가" value="00.000" />
        </section>
      </section>
      <section className="flex flex-col gap-3">
        <Title>기업 가치</Title>
        <section className="grid grid-cols-[repeat(4,100px)] items-center gap-3">
          <MetricItem label="시가총액" value="00.000" />
          <MetricItem label="EPS" value="00.000" />
          <MetricItem label="PER" value="00.000" />
        </section>
      </section>
    </article>
  );
};

const Title = ({ children }: TitleProps) => {
  return <h3 className="display-bold16 font-bold">{children}</h3>;
};

const MetricItem = ({ label, value }: MetricItemProps) => {
  return (
    <>
      <span className="display-medium14 text-gray font-bold">{label}</span>
      <span className="display-medium14 text-dark-gray">{value}</span>
    </>
  );
};
