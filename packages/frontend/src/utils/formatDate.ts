import dayjs from 'dayjs';

export const formatDate = (isoString: string) =>
  dayjs(isoString).format('YY.MM.DD HH:mm');
