/**
 * .env 의 EXPO_PUBLIC_API_BASE_URL(http) 호스트를 ios/ByB/Info.plist ATS 예외에 반영.
 * 네이티브 빌드 전 실행: node scripts/sync-ios-ats.mjs
 */
import { config as loadEnv } from 'dotenv';
import expoPlist from '@expo/plist';

const { parse: parsePlist, build: buildPlist } = expoPlist.default ?? expoPlist;
import fs from 'fs';
import path from 'path';

loadEnv({ path: path.resolve(process.cwd(), '.env') });

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';
const plistPath = path.resolve(process.cwd(), 'ios/ByB/Info.plist');

if (!baseUrl.startsWith('http://')) {
  console.log('[sync-ios-ats] HTTPS API — ATS 예외 불필요');
  process.exit(0);
}

let hostname;
try {
  hostname = new URL(baseUrl).hostname;
} catch {
  console.error('[sync-ios-ats] 잘못된 EXPO_PUBLIC_API_BASE_URL:', baseUrl);
  process.exit(1);
}

if (!hostname) {
  console.error('[sync-ios-ats] 호스트를 찾을 수 없습니다:', baseUrl);
  process.exit(1);
}

if (!fs.existsSync(plistPath)) {
  console.error('[sync-ios-ats] Info.plist 없음. npx expo prebuild --platform ios 먼저 실행');
  process.exit(1);
}

const xml = fs.readFileSync(plistPath, 'utf8');
const data = parsePlist(xml);

const ats = data.NSAppTransportSecurity ?? {};
ats.NSAllowsArbitraryLoads = ats.NSAllowsArbitraryLoads ?? false;
ats.NSAllowsLocalNetworking = ats.NSAllowsLocalNetworking ?? true;
ats.NSExceptionDomains = {
  ...(ats.NSExceptionDomains ?? {}),
  [hostname]: {
    NSExceptionAllowsInsecureHTTPLoads: true,
    NSIncludesSubdomains: true,
  },
};
data.NSAppTransportSecurity = ats;

const out = buildPlist(data);
fs.writeFileSync(plistPath, `${out}\n`);

console.log(`[sync-ios-ats] ${hostname} HTTP 허용 반영 → ${plistPath}`);
