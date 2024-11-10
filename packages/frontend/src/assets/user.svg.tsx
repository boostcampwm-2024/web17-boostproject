import { BaseSvg, ChildSvgProps } from '@/assets/base.svg.tsx';

export const UserSvg = ({ width, className, height }: ChildSvgProps) => (
  <BaseSvg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" stroke="gray" strokeLinecap="round">
      <circle cx={12} cy={8} r={3.5}></circle>
      <path d="M4.85 16.948c.639-2.345 3.065-3.448 5.495-3.448h3.31c2.43 0 4.856 1.103 5.496 3.448a10 10 0 0 1 .295 1.553c.06.55-.394.999-.946.999h-13c-.552 0-1.005-.45-.946-.998a10 10 0 0 1 .295-1.554Z"></path>
    </g>
  </BaseSvg>
);
