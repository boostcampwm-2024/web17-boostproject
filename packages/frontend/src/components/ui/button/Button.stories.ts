import type { Meta, StoryObj } from '@storybook/react';
import { Button, type ButtonProps } from '.';

const meta: Meta<ButtonProps> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: {
      control: 'select',
      options: ['default', 'gray', 'orange'],
    },
    textColor: {
      control: 'select',
      options: ['default', 'white'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
  args: { children: 'Button' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
  },
};

export const OrangeButton: Story = {
  args: {
    backgroundColor: 'orange',
    textColor: 'white',
    children: 'Button',
  },
};

export const GrayButton: Story = {
  args: {
    backgroundColor: 'gray',
    textColor: 'white',
    children: 'Button',
  },
};

export const SmallButton: Story = {
  args: {
    backgroundColor: 'orange',
    textColor: 'white',
    children: 'Button',
    size: 'sm',
  },
};
