type TrashSession = {
  trash_amount_value?: string;
  trash_amount_unit?: 'L' | '%';
};

function parseLiters(value: string): number {
  const range = value.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/);
  if (range) {
    return (Number(range[1]) + Number(range[2])) / 2;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** 주간 요약용 — L 단위 세션만 합산 */
export function sumTrashLitersFromSessions(sessions: TrashSession[]): string {
  const totalL = sessions.reduce((sum, s) => {
    if (s.trash_amount_unit !== 'L' || !s.trash_amount_value) return sum;
    return sum + parseLiters(s.trash_amount_value);
  }, 0);

  const rounded = Math.round(totalL * 10) / 10;
  return `${rounded}L`;
}
