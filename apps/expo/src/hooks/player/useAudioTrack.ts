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
      console.log("synchronizePlayback called");

      if (selectedAudioTrack && stream) {
        console.log("Loading audio track", selectedAudioTrack.uri);
        const { uri } = selectedAudioTrack;
        const { sound } = await Audio.Sound.createAsync({
          // never resolves or rejects :(
          uri,
          headers: {
            ...stream.headers,
            ...stream.preferredHeaders,
          },
        });
        console.log("Audio track loaded");
        setAudioObject(sound);
      } else {
        if (audioObject) {
          console.log("Unloading existing audio track");
          await audioObject.unloadAsync();
          setAudioObject(null);
        }
      }

      if (videoRef && audioObject) {
        console.log("Synchronizing audio with video");
        const videoStatus = await videoRef.getStatusAsync();

        if (selectedAudioTrack && videoStatus.isLoaded) {
          console.log("Muting video and starting audio playback");
          await videoRef.setIsMutedAsync(true);
          await audioObject.setPositionAsync(videoStatus.positionMillis);
          await audioObject.playAsync();
        } else {
          console.log("Unmuting video");
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
