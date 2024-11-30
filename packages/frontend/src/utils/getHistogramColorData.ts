interface VolumeData {
  time: string;
  value: number;
}

export const getHistogramColorData = (data: VolumeData[]) => {
  return data.map((item, index) => {
    const color =
      index === 0 || item.value >= data[index - 1].value
        ? '#ff4d4d'
        : '#1a75ff';

    return { ...item, color };
  });
};
