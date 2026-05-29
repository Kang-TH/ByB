import { Platform } from 'react-native';
import type { LiveActivityState } from 'expo-live-activity';
import { formatDistanceKm } from '@/shared/utils/format';
import { colors } from '@/shared/constants/theme';

let activityId: string | undefined;

/** 다이나믹 아일랜드 compact leading */
const LIVE_ACTIVITY_TITLE = '플로깅중';

type LiveActivityModule = typeof import('expo-live-activity');

function getModule(): LiveActivityModule | null {
  if (Platform.OS !== 'ios') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-live-activity') as LiveActivityModule;
  } catch {
    return null;
  }
}

function buildState(title: string, subtitle: string): LiveActivityState {
  return {
    title,
    subtitle,
  };
}

const config = {
  backgroundColor: colors.primary,
  titleColor: '#FFFFFF',
  subtitleColor: '#E8F5E9',
  progressViewTint: '#FFFFFF',
  progressViewLabelColor: '#FFFFFF',
  timerType: 'digital' as const,
};

export function startPloggingLiveActivity(
  _courseName: string | undefined,
  _startedAt: string,
): string | undefined {
  const LiveActivity = getModule();
  if (!LiveActivity) return undefined;

  const id = LiveActivity.startActivity(
    buildState(LIVE_ACTIVITY_TITLE, formatDistanceKm(0)),
    config,
  );
  activityId = id ?? undefined;
  return activityId;
}

export function updatePloggingLiveActivity(
  distanceKm: number,
  _courseName?: string,
  _startedAt?: string,
): void {
  const LiveActivity = getModule();
  if (!LiveActivity || activityId == null) return;

  LiveActivity.updateActivity(
    activityId,
    buildState(LIVE_ACTIVITY_TITLE, formatDistanceKm(distanceKm)),
  );
}

export function stopPloggingLiveActivity(): void {
  const LiveActivity = getModule();
  if (!LiveActivity || activityId == null) return;

  const id = activityId;
  activityId = undefined;
  LiveActivity.stopActivity(id, buildState('플로깅 종료', formatDistanceKm(0)));
}

export function setPloggingLiveActivityId(id: string | undefined): void {
  activityId = id;
}

export function getPloggingLiveActivityId(): string | undefined {
  return activityId;
}
