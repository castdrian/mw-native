import { useCallback } from "react";
import { useSharedValue } from "react-native-reanimated";

export const usePlaybackSpeed = () => {
  const speed = useSharedValue(1);

  const changePlaybackSpeed = useCallback(
    (newValue: number) => {
      speed.value = newValue;
    },
    [speed],
  );

  return {
    currentSpeed: speed,
    changePlaybackSpeed,
  } as const;
};
