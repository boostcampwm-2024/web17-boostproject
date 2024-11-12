import { BaseSvg, ChildSvgProps } from '@/assets/base.svg.tsx';

const GraphSvg = ({ width, className, height }: ChildSvgProps) => (
  <BaseSvg
    width={width}
    height={height}
    viewBox={'0 0 24 24'}
    className={className}
    fill={'gray'}
  >
    <path d="M2.5 2.75a.75.75 0 00-1.5 0v18.5c0 .414.336.75.75.75H20a.75.75 0 000-1.5H2.5V2.75z" />
    <path d="M22.28 7.78a.75.75 0 00-1.06-1.06l-5.72 5.72-3.72-3.72a.75.75 0 00-1.06 0l-6 6a.75.75 0 101.06 1.06l5.47-5.47 3.72 3.72a.75.75 0 001.06 0l6.25-6.25z" />
  </BaseSvg>
);

export default GraphSvg;