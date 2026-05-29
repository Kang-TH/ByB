import * as Location from 'expo-location';
import { reverseGeocodeWithNaver } from '@/shared/api/naverGeocode';
import type { RoutePoint } from '@/types/course';

/**
 * 대한민국 행정구역 표기 (법정동·도로명주소 공통)
 * - 광역시·특별시: 시도 + 구 + 동  (예: 서울특별시 강남구 삼성동)
 * - 도 지역: 시도 + 시·군 + 구 + 동  (예: 경기도 용인시 수지구 동천동)
 *   ※ 시 아래 구(용인시 수지구)는 시·군·구 단계를 모두 표기
 */
export interface KoreanAreaParts {
  sido: string;
  /** 시·군 (광역시·특별시는 비움) */
  city: string;
  /** 구·군 내 구, 또는 광역시·특별시의 구 */
  district: string;
  dong: string;
}

const PLACEHOLDER_AREA = '직접 등록';

const SIDO_PATTERN = /(.+?(?:특별자치시|특별시|광역시|도))/;

export function isMetropolitanSido(sido: string): boolean {
  return /(특별시|특별자치시|광역시)$/.test(sido);
}

/** 시도 이후 토큰 → 시·군 / 구 / 동 분리 */
export function parseTokensAfterSido(
  sido: string,
  tokens: string[],
): KoreanAreaParts {
  const rest = [...tokens];
  let dong = '';

  if (rest.length > 0) {
    const last = rest[rest.length - 1];
    if (/(동|읍|면)(\d+가)?$/.test(last) || /리$/.test(last)) {
      dong = last;
      rest.pop();
    }
  }

  const metro = isMetropolitanSido(sido);
  const cities: string[] = [];
  const districts: string[] = [];

  for (const token of rest) {
    if (/시$|군$/.test(token)) {
      cities.push(token);
    } else if (/구$/.test(token)) {
      districts.push(token);
    } else if (token) {
      districts.push(token);
    }
  }

  if (metro) {
    return {
      sido,
      city: '',
      district: [...cities, ...districts].join(' '),
      dong,
    };
  }

  return {
    sido,
    city: cities.join(' '),
    district: districts.join(' '),
    dong,
  };
}

/** 전체 주소 문자열 파싱 (네이버·저장된 areaName 등) */
export function parseKoreanAddress(full: string): KoreanAreaParts | null {
  const trimmed = full.trim();
  if (!trimmed || trimmed === PLACEHOLDER_AREA) return null;

  const match = trimmed.match(new RegExp(`^${SIDO_PATTERN.source}\\s*(.*)$`));
  if (!match) {
    return { sido: trimmed, city: '', district: '', dong: '' };
  }

  const sido = match[1];
  const rest = match[2].trim();
  if (!rest) return { sido, city: '', district: '', dong: '' };

  return parseTokensAfterSido(sido, rest.split(/\s+/).filter(Boolean));
}

/** @deprecated 내부 호환 — parseKoreanAddress 사용 */
export function parseAreaNameToParts(areaName: string): KoreanAreaParts | null {
  return parseKoreanAddress(areaName);
}

/** 표시용 한 줄 주소 */
export function formatAreaParts(parts: KoreanAreaParts): string {
  return formatAreaNameFromParts(parts);
}

export function formatAreaNameFromParts(parts: KoreanAreaParts): string {
  if (isMetropolitanSido(parts.sido)) {
    return [parts.sido, parts.district, parts.dong].filter(Boolean).join(' ').trim();
  }
  return [parts.sido, parts.city, parts.district, parts.dong]
    .filter(Boolean)
    .join(' ')
    .trim();
}

async function reverseGeocodeWithExpo(
  lat: number,
  lng: number,
): Promise<KoreanAreaParts | null> {
  const results = await Location.reverseGeocodeAsync({
    latitude: lat,
    longitude: lng,
  });
  const row = results[0];
  if (!row) return null;

  const sido = row.region?.trim() ?? '';
  const city = row.city?.trim() ?? '';
  const subregion = row.subregion?.trim() ?? '';
  const district = row.district?.trim() ?? '';
  const street = row.street?.trim() ?? '';

  const tokens: string[] = [];
  if (city) tokens.push(city);
  if (subregion && subregion !== city) tokens.push(subregion);
  if (district && !tokens.includes(district)) tokens.push(district);

  let dong = street;
  if (district && /(동|읍|면)(\d+가)?$/.test(district)) {
    dong = district;
    const idx = tokens.indexOf(district);
    if (idx >= 0) tokens.splice(idx, 1);
  }

  if (!sido) return null;
  if (tokens.length === 0 && !dong) {
    return { sido, city: '', district: '', dong: '' };
  }

  const base = parseTokensAfterSido(sido, [...tokens, ...(dong ? [dong] : [])]);
  return base;
}

export async function resolveAreaFromCoords(
  lat: number,
  lng: number,
): Promise<KoreanAreaParts | null> {
  try {
    const naver = await reverseGeocodeWithNaver(lat, lng);
    if (naver && (naver.sido || naver.city || naver.district || naver.dong)) {
      return naver;
    }
  } catch {
    // fall through
  }

  try {
    return await reverseGeocodeWithExpo(lat, lng);
  } catch {
    return null;
  }
}

function centroid(points: RoutePoint[]): RoutePoint {
  if (points.length === 1) return points[0];
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}

export async function resolveAreaFromRoutePoints(
  routePoints: RoutePoint[],
): Promise<KoreanAreaParts | null> {
  if (routePoints.length === 0) return null;
  const { lat, lng } = centroid(routePoints);
  return resolveAreaFromCoords(lat, lng);
}

export async function resolveAreaNameFromRoutePoints(
  routePoints: RoutePoint[],
): Promise<string> {
  const parts = await resolveAreaFromRoutePoints(routePoints);
  if (!parts) return PLACEHOLDER_AREA;
  const name = formatAreaNameFromParts(parts);
  return name || PLACEHOLDER_AREA;
}

export function getAreaDisplayFromName(areaName: string): string {
  const parts = parseKoreanAddress(areaName);
  if (!parts) return areaName === PLACEHOLDER_AREA ? '' : areaName;
  return formatAreaParts(parts);
}
