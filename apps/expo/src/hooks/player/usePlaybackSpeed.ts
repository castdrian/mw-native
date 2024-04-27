import { useCallback } from "react";

import { usePlayerStore } from "~/stores/player/store";

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const usePlaybackSpeed = () => {
  const videoRef = usePlayerStore((state) => state.videoRef);

  const changePlaybackSpeed = useCallback(
    async (newValue: number) => {
      if (videoRef) {
        await videoRef.setRateAsync(newValue, true);
      }
    },
    [videoRef],
  );

  return {
    speeds,
    currentSpeed: videoRef?.props.rate ?? 1,
    changePlaybackSpeed,
  } as const;
};
