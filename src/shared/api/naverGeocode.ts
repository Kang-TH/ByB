import type { KoreanAreaParts } from '@/features/course/utils/courseArea';
import {
  NAVER_MAP_CLIENT_ID,
  NAVER_MAP_CLIENT_SECRET,
} from '@/shared/constants/config';

const NAVER_GEOCODE_URL =
  'https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc';

type NaverArea = { name?: string };

function isMetropolitanSido(sido: string): boolean {
  return /(특별시|특별자치시|광역시)$/.test(sido);
}

function partsFromNaverRegion(region: {
  area1?: NaverArea;
  area2?: NaverArea;
  area3?: NaverArea;
  area4?: NaverArea;
}): KoreanAreaParts | null {
  const a1 = region.area1?.name?.trim() ?? '';
  const a2 = region.area2?.name?.trim() ?? '';
  const a3 = region.area3?.name?.trim() ?? '';
  const a4 = region.area4?.name?.trim() ?? '';

  if (!a1) return null;

  if (isMetropolitanSido(a1)) {
    return {
      sido: a1,
      city: '',
      district: a2,
      dong: a3 || a4,
    };
  }

  const cities: string[] = [];
  const districts: string[] = [];
  let dong = '';

  for (const token of [a2, a3, a4].filter(Boolean)) {
    if (/(동|읍|면)(\d+가)?$/.test(token) || /리$/.test(token)) {
      dong = token;
    } else if (/시$|군$/.test(token)) {
      cities.push(token);
    } else if (/구$/.test(token)) {
      districts.push(token);
    } else {
      districts.push(token);
    }
  }

  return {
    sido: a1,
    city: cities.join(' '),
    district: districts.join(' '),
    dong,
  };
}

/** 네이버 지도(Reverse Geocoding) — 지도 SDK와 동일 플랫폼 */
export async function reverseGeocodeWithNaver(
  lat: number,
  lng: number,
): Promise<KoreanAreaParts | null> {
  if (!NAVER_MAP_CLIENT_ID || !NAVER_MAP_CLIENT_SECRET) return null;

  const params = new URLSearchParams({
    coords: `${lng},${lat}`,
    orders: 'legalcode',
    output: 'json',
  });

  const res = await fetch(`${NAVER_GEOCODE_URL}?${params.toString()}`, {
    headers: {
      'X-NCP-APIGW-API-KEY-ID': NAVER_MAP_CLIENT_ID,
      'X-NCP-APIGW-API-KEY': NAVER_MAP_CLIENT_SECRET,
    },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as {
    status?: { code?: number };
    results?: Array<{
      name?: string;
      region?: {
        area1?: NaverArea;
        area2?: NaverArea;
        area3?: NaverArea;
        area4?: NaverArea;
      };
    }>;
  };

  if (json.status?.code !== 0) return null;

  const legal =
    json.results?.find((r) => r.name === 'legalcode') ?? json.results?.[0];
  if (!legal?.region) return null;

  return partsFromNaverRegion(legal.region);
}
