import * as ScreenOrientation from "expo-screen-orientation";

import type { Stream } from "@movie-web/provider-utils";
import type { SeasonDetails } from "@movie-web/tmdb";

import type { MakeSlice } from "./types";
import type { ItemData } from "~/components/item/item";

export interface InterfaceSlice {
  interface: {
    isIdle: boolean;
    idleTimeout: NodeJS.Timeout | null;
    stream: Stream | null;
    sourceId: string | null;
    data: ItemData | null;
    seasonData: SeasonDetails | null;
    selectedCaption: Stream["captions"][0] | null;
  };
  setIsIdle(state: boolean): void;
  setStream(stream: Stream): void;
  setSourceId(sourceId: string): void;
  setData(data: ItemData): void;
  setSeasonData(data: SeasonDetails): void;
  lockOrientation: () => Promise<void>;
  unlockOrientation: () => Promise<void>;
  presentFullscreenPlayer: () => Promise<void>;
  dismissFullscreenPlayer: () => Promise<void>;
}

export const createInterfaceSlice: MakeSlice<InterfaceSlice> = (set, get) => ({
  interface: {
    isIdle: true,
    idleTimeout: null,
    stream: null,
    sourceId: null,
    data: null,
    seasonData: null,
    selectedCaption: null,
  },
  setIsIdle: (state) => {
    set((s) => {
      if (s.interface.idleTimeout) clearTimeout(s.interface.idleTimeout);

      s.interface.idleTimeout = setTimeout(() => {
        if (get().interface.isIdle === false) {
          set((s) => {
            s.interface.isIdle = true;
          });
        }
      }, 6000);

      s.interface.isIdle = state;
    });
  },
  setStream: (stream) => {
    set((s) => {
      s.interface.stream = stream;
    });
  },
  setSourceId: (sourceId: string) => {
    set((s) => {
      s.interface.sourceId = sourceId;
    });
  },
  setData: (data: ItemData) => {
    set((s) => {
      s.interface.data = data;
    });
  },
  setSeasonData: (data: SeasonDetails) => {
    set((s) => {
      s.interface.seasonData = data;
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
