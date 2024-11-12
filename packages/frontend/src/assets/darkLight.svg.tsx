import { BaseSvg, ChildSvgProps } from '@/assets/base.svg.tsx';

export const DarkLightSVG = ({ width, className, height }: ChildSvgProps) => (
  <BaseSvg
    width={width}
    height={height}
    viewBox="0 0 512 512"
    className={className}
  >
    <path
      fill="gray"
      d="M414.39 97.61A224 224 0 1 0 97.61 414.39A224 224 0 1 0 414.39
        97.61M256 432v-96a80 80 0 0 1 0-160V80c97.05 0 176 79 176 176s-78.95
         176-176 176"
    ></path>
    <path
      fill="gray"
      d="M336 256a80 80 0 0 0-80-80v160a80 80 0 0 0 80-80"
    ></path>
  </BaseSvg>
);
