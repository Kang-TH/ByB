import type { PermissionStatus } from 'expo-location';
import { create } from 'zustand';
import { requestForegroundLocationPermission } from '@/shared/location/locationService';

interface LocationState {
  permissionStatus: PermissionStatus | null;
  /** 로그인 성공 직후 1회 호출 */
  requestPermissionOnLogin: () => Promise<PermissionStatus>;
  setPermissionStatus: (status: PermissionStatus) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  permissionStatus: null,

  requestPermissionOnLogin: async () => {
    const status = await requestForegroundLocationPermission();
    set({ permissionStatus: status });
    return status;
  },

  setPermissionStatus: (status) => set({ permissionStatus: status }),
}));
