export type AlarmOptionName = 'targetVolume' | 'targetPrice';

interface AlarmOption {
  id: number;
  name: AlarmOptionName;
  label: string;
}

export const ALARM_OPTIONS: AlarmOption[] = [
  { id: 1, name: 'targetPrice', label: '목표가' },
  { id: 2, name: 'targetVolume', label: '거래가' },
];
