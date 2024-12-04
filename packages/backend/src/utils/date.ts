export function getFormattedDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isTodayWeekend() {
  const today = new Date();
  const day = today.getDay();
  return day === 0 || day === 6;
}
