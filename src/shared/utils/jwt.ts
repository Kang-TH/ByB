/** 서명 검증 없이 JWT exp 클레임만 읽음 (만료 여부 판단용) */
export function getJwtExpiryMs(token: string): number | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(globalThis.atob(base64)) as { exp?: number };
    if (typeof json.exp === 'number') return json.exp * 1000;
  } catch {
    // ignore
  }
  return null;
}

export function isJwtExpired(token: string, bufferMs = 5 * 60 * 1000): boolean {
  const exp = getJwtExpiryMs(token);
  if (exp == null) return true;
  return exp <= Date.now() + bufferMs;
}
