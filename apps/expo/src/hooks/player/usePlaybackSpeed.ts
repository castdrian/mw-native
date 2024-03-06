import { useCallback } from "react";

import { usePlayerStore } from "~/stores/player/store";

export const usePlaybackSpeed = () => {
  const videoRef = usePlayerStore((state) => state.videoRef);

  const changePlaybackSpeed = useCallback(
    (newValue: number) => {
      if (videoRef) {
        void videoRef.setRateAsync(newValue, true);
      }
    },
    [videoRef],
  );

  return {
    currentSpeed: videoRef?.props.rate ?? 1,
    changePlaybackSpeed,
  } as const;
};
