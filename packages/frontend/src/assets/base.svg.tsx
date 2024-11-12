import React from 'react';

export interface BaseSvgProps {
  width: string;
  height: string;
  viewBox: string;
  className?: string;
  fill?: string;
  children?: React.ReactNode;
}

export type ChildSvgProps = Omit<BaseSvgProps, 'fill' | 'children' | 'viewBox'>;

export const BaseSvg: React.FC<BaseSvgProps> = ({
  width,
  height,
  viewBox,
  className,
  fill,
  children,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={viewBox}
    className={className}
    fill={fill}
  >
    {children}
  </svg>
);