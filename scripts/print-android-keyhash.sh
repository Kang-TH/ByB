#!/usr/bin/env bash
# 카카오 Developers > Android 플랫폼 > 키 해시 등록용
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEYSTORE="${ROOT}/android/app/debug.keystore"
KEYTOOL="${JAVA_HOME:-}/bin/keytool"

if [ ! -x "$KEYTOOL" ] && [ -x "/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool" ]; then
  KEYTOOL="/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool"
fi

if [ ! -x "$KEYTOOL" ]; then
  echo "keytool 을 찾을 수 없습니다. Android Studio JBR 또는 JAVA_HOME 을 설정하세요." >&2
  exit 1
fi

if [ ! -f "$KEYSTORE" ]; then
  echo "keystore 없음: $KEYSTORE — 먼저 npx expo prebuild --platform android" >&2
  exit 1
fi

echo "패키지명: com.anonymous.ByB"
echo "키 해시 (debug.keystore):"
"$KEYTOOL" -exportcert -alias androiddebugkey -keystore "$KEYSTORE" \
  -storepass android -keypass android \
  | openssl sha1 -binary | openssl base64
