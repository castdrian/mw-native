import type { AVPlaybackStatus, Video } from "expo-av";

import type { MakeSlice } from "./types";

export interface VideoSlice {
  videoRef: Video | null;
  status: AVPlaybackStatus | null;

  setVideoRef(ref: Video | null): void;
  setStatus(status: AVPlaybackStatus | null): void;
}

export const createVideoSlice: MakeSlice<VideoSlice> = (set) => ({
  videoRef: null,
  status: null,

  setVideoRef: (ref) => {
    set({ videoRef: ref });
  },
  setStatus: (status) => {
    set((s) => {
      s.status = status;
    });
  },
});
