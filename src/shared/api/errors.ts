import axios from 'axios';

/** axios / 네트워크 오류를 사용자에게 보여줄 메시지로 변환 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as { message?: string } | string | undefined;
      if (typeof data === 'string' && data.trim()) {
        return data;
      }
      if (data && typeof data === 'object' && data.message) {
        return data.message;
      }
      return `서버 오류 (${error.response.status})`;
    }

    if (error.code === 'ECONNABORTED') {
      return '서버 응답 시간이 초과되었습니다. 네트워크를 확인해 주세요.';
    }

    if (error.message === 'Network Error') {
      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
      if (baseUrl.startsWith('http://')) {
        return (
          '서버에 연결할 수 없습니다. iOS는 HTTP(비암호) 주소를 기본 차단합니다. ' +
          '앱을 다시 빌드했는지 확인하거나, 서버에 HTTPS를 사용해 주세요.'
        );
      }
      return '서버에 연결할 수 없습니다. API 주소와 방화벽을 확인해 주세요.';
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '요청에 실패했습니다. 네트워크와 서버 연결을 확인해 주세요.';
}
