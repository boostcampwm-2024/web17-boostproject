import { BaseSvg, ChildSvgProps } from '@/assets/base.svg.tsx';

const SearchSvg = ({ width, height, className }: ChildSvgProps) => (
  <BaseSvg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"
      fill="gray"
    />
  </BaseSvg>
);
export default SearchSvg;
