/**
 * TaskManager.defineTask 는 앱 진입 시 전역에서 한 번 등록해야 합니다.
 * (백그라운드/헤드리스에서 React 컨텍스트 없이 실행됨)
 */
import { PLOGGING_LOCATION_TASK } from '@/features/plogging/background/constants';

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const TaskManager = require('expo-task-manager') as typeof import('expo-task-manager');

  if (!TaskManager.isTaskDefined(PLOGGING_LOCATION_TASK)) {
    const { applyPloggingLocationUpdate } =
      require('@/features/plogging/background/ploggingGpsUpdate') as typeof import('@/features/plogging/background/ploggingGpsUpdate');

    TaskManager.defineTask(PLOGGING_LOCATION_TASK, async ({ data, error }) => {
      if (error) {
        console.warn('[plogging] background location error', error);
        return;
      }

      const locations = (
        data as { locations?: import('expo-location').LocationObject[] }
      )?.locations;
      if (!locations?.length) return;

      await applyPloggingLocationUpdate(locations);
    });
  }
} catch {
  // Expo Go — expo-task-manager 네이티브 모듈 없음
}
