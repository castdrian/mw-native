import * as ScreenOrientation from "expo-screen-orientation";

import type { MakeSlice } from "./types";

export interface InterfaceSlice {
  interface: {
    isIdle: boolean;
  };
  setIsIdle(state: boolean): void;
  lockOrientation: () => Promise<void>;
  unlockOrientation: () => Promise<void>;
  presentFullscreenPlayer: () => Promise<void>;
  dismissFullscreenPlayer: () => Promise<void>;
}

export const createInterfaceSlice: MakeSlice<InterfaceSlice> = (set, get) => ({
  interface: {
    isIdle: true,
  },
  setIsIdle: (state) => {
    set((s) => {
      setTimeout(() => {
        if (get().interface.isIdle === false) {
          set((s) => {
            s.interface.isIdle = true;
          });
        }
      }, 6000);
      s.interface.isIdle = state;
    });
  },
  lockOrientation: async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    );
  },
  unlockOrientation: async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  },
  presentFullscreenPlayer: async () => {
    await get().lockOrientation();
  },
  dismissFullscreenPlayer: async () => {
    await get().unlockOrientation();
  },
});
