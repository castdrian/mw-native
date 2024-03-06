import { useCallback, useState } from "react";
import { Audio } from "expo-av";

import type { Stream } from "@movie-web/provider-utils";

import type { AudioTrack } from "~/components/player/AudioTrackSelector";
import { usePlayerStore } from "~/stores/player/store";

export const useAudioTrack = () => {
  const videoRef = usePlayerStore((state) => state.videoRef);
  const [audioObject, setAudioObject] = useState<Audio.Sound | null>(null);

  const synchronizePlayback = useCallback(
    async (selectedAudioTrack?: AudioTrack, stream?: Stream) => {
      if (selectedAudioTrack && stream) {
        const { uri } = selectedAudioTrack;
        const sound = new Audio.Sound();
        await sound.loadAsync({
          uri,
          headers: {
            ...stream.headers,
            ...stream.preferredHeaders,
          },
        });
        setAudioObject(sound);
      } else {
        if (audioObject) {
          await audioObject.unloadAsync();
          setAudioObject(null);
        }
      }

      if (videoRef?.getStatusAsync && audioObject) {
        const videoStatus = await videoRef.getStatusAsync();

        if (selectedAudioTrack && videoStatus.isLoaded) {
          await videoRef.setIsMutedAsync(true);
          await audioObject.setPositionAsync(videoStatus.positionMillis);
          await audioObject.playAsync();
        } else {
          await videoRef.setIsMutedAsync(false);
        }
      }
    },
    [videoRef, audioObject],
  );

  return {
    synchronizePlayback,
  } as const;
};
