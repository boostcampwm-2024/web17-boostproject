import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipProps } from '.';

const TooltipWrapper = ({ children }: TooltipProps) => {
  return (
    <div className="group relative bg-white">
      <Tooltip className="absolute bottom-full mb-2">{children}</Tooltip>
      <button className="text-blue rounded px-4 py-3">Hover me</button>
    </div>
  );
};

const meta: Meta<TooltipProps> = {
  title: 'Example/Tooltip',
  component: TooltipWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],

  args: { children: 'Tooltip' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Tooltip',
  },
};
