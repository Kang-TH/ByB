import { PLOGGING_LOCATION_TASK } from '@/features/plogging/background/constants';

let taskManagerModule: typeof import('expo-task-manager') | null = null;
let taskManagerLoadAttempted = false;
let backgroundAvailable: boolean | null = null;

function loadTaskManager(): typeof import('expo-task-manager') | null {
  if (taskManagerLoadAttempted) {
    return taskManagerModule;
  }
  taskManagerLoadAttempted = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    taskManagerModule = require('expo-task-manager');
  } catch {
    taskManagerModule = null;
  }
  return taskManagerModule;
}

export async function isPloggingBackgroundNativeAvailable(): Promise<boolean> {
  if (backgroundAvailable != null) return backgroundAvailable;

  const TaskManager = loadTaskManager();
  if (!TaskManager) {
    backgroundAvailable = false;
    return false;
  }

  try {
    backgroundAvailable = await TaskManager.isAvailableAsync();
  } catch {
    backgroundAvailable = false;
  }
  return backgroundAvailable;
}

/** ploggingLocationTask.ts 에서 앱 시작 시 등록됨 */
export function ensurePloggingLocationTaskRegistered(): boolean {
  const TaskManager = loadTaskManager();
  if (!TaskManager) return false;

  try {
    return TaskManager.isTaskDefined(PLOGGING_LOCATION_TASK);
  } catch {
    return false;
  }
}

export function getTaskManagerModule() {
  return loadTaskManager();
}
