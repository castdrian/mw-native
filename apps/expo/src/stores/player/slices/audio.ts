import type { Audio } from "expo-av";

import type { MakeSlice } from "./types";
import type { AudioTrack } from "~/components/player/AudioTrackSelector";

export interface AudioSlice {
  audioObject: Audio.Sound | null;
  currentAudioTrack: AudioTrack | null;

  setAudioObject(audioObject: Audio.Sound | null): void;
  setCurrentAudioTrack(track: AudioTrack | null): void;
  playAudio(): Promise<void>;
  pauseAudio(): Promise<void>;
  setAudioPositionAsync(positionMillis: number): Promise<void>;
}

export const createAudioSlice: MakeSlice<AudioSlice> = (set, get) => ({
  audioObject: null,
  currentAudioTrack: null,

  setAudioObject: (audioObject) => {
    set({ audioObject });
  },
  setCurrentAudioTrack: (track) => {
    set({ currentAudioTrack: track });
  },
  playAudio: async () => {
    const { audioObject } = get();
    if (audioObject) {
      await audioObject.playAsync();
    }
  },
  pauseAudio: async () => {
    const { audioObject } = get();
    if (audioObject) {
      await audioObject.pauseAsync();
    }
  },
  setAudioPositionAsync: async (positionMillis) => {
    const { audioObject } = get();
    if (audioObject) {
      await audioObject.setPositionAsync(positionMillis);
    }
  },
});
