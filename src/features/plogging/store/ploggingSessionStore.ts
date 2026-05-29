import { create } from 'zustand';
import type {
  ActivePloggingSession,
  StartPloggingResponse,
  TrashBagType,
} from '@/types/plogging';
import type { RoutePoint } from '@/types/course';
import { totalDistanceKm } from '@/shared/utils/geo';

export interface TrashDraft {
  bagType: TrashBagType;
  trashAmountValue: string;
  trashAmountUnit: 'L' | '%';
  displayAmount: string;
}

interface PloggingSessionState {
  session: ActivePloggingSession | null;
  elapsedSeconds: number;
  liveDistanceKm: number;
  trashDraft: TrashDraft | null;
  startSession: (response: StartPloggingResponse, mode: 'FREE' | 'COURSE') => void;
  appendGpsPoint: (point: RoutePoint) => void;
  tick: () => void;
  syncElapsedFromClock: () => void;
  resetTick: () => void;
  setTrashDraft: (draft: TrashDraft) => void;
  clearTrashDraft: () => void;
  restoreFromPersisted: (session: ActivePloggingSession) => void;
  clearSession: () => void;
}

export const usePloggingSessionStore = create<PloggingSessionState>((set, get) => ({
  session: null,
  elapsedSeconds: 0,
  liveDistanceKm: 0,
  trashDraft: null,

  startSession: (response, mode) => {
    set({
      session: {
        ploggingId: response.ploggingId,
        courseId: response.courseId,
        courseName: response.courseName,
        mode,
        status: response.status,
        startedAt: response.startedAt,
        routePoints: response.routePoints,
        trackedPoints: [],
      },
      elapsedSeconds: 0,
      liveDistanceKm: 0,
      trashDraft: null,
    });
  },

  appendGpsPoint: (point) => {
    const { session } = get();
    if (!session) return;

    const last = session.trackedPoints[session.trackedPoints.length - 1];
    if (last && totalDistanceKm([last, point]) < 0.003) {
      return;
    }

    const trackedPoints = [...session.trackedPoints, point];
    set({
      session: { ...session, trackedPoints },
      liveDistanceKm: totalDistanceKm(trackedPoints),
    });
  },

  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

  syncElapsedFromClock: () => {
    const { session } = get();
    if (!session?.startedAt) return;
    const startMs = new Date(session.startedAt).getTime();
    if (Number.isNaN(startMs)) return;
    set({
      elapsedSeconds: Math.max(0, Math.floor((Date.now() - startMs) / 1000)),
    });
  },

  resetTick: () => set({ elapsedSeconds: 0 }),

  setTrashDraft: (draft) => set({ trashDraft: draft }),

  clearTrashDraft: () => set({ trashDraft: null }),

  restoreFromPersisted: (session) => {
    const trackedPoints = session.trackedPoints ?? [];
    const startMs = new Date(session.startedAt).getTime();
    const elapsedSeconds = Number.isNaN(startMs)
      ? 0
      : Math.max(0, Math.floor((Date.now() - startMs) / 1000));

    set({
      session: {
        ...session,
        trackedPoints,
      },
      elapsedSeconds,
      liveDistanceKm: totalDistanceKm(trackedPoints),
      trashDraft: null,
    });
  },

  clearSession: () =>
    set({
      session: null,
      elapsedSeconds: 0,
      liveDistanceKm: 0,
      trashDraft: null,
    }),
}));
