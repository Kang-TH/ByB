/** 이번 주 월요일 00:00 ~ 일요일 23:59:59 (로컬 시간) */
export function getCurrentWeekRange(now: Date = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay(); // 0=일, 1=월, …
  const daysFromMonday = day === 0 ? 6 : day - 1;
  start.setDate(start.getDate() - daysFromMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function isWithinRange(isoDate: string, start: Date, end: Date): boolean {
  const time = new Date(isoDate).getTime();
  return time >= start.getTime() && time <= end.getTime();
}
