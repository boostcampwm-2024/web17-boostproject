import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@/../tailwind.config';

interface VolumeData {
  time: string;
  value: number;
}

const colorConfig = resolveConfig(tailwindConfig).theme.colors;

export const getHistogramColorData = (data: VolumeData[]) => {
  return data.map((item, index) => {
    const color =
      index === 0 || item.value >= data[index - 1].value
        ? colorConfig.red
        : colorConfig.blue;

    return { ...item, color };
  });
};
