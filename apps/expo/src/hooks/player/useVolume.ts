import { useMemo, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useDebounceValue } from "tamagui";

export const useVolume = () => {
  const [showVolumeOverlay, setShowVolumeOverlay] = useState(false);

  const volume = useSharedValue(1);

  const currentVolume = useDebounceValue(volume.value, 20);
  const memoizedVolume = useMemo(() => currentVolume, [currentVolume]);

  return {
    showVolumeOverlay,
    setShowVolumeOverlay,
    volume,
    currentVolume: memoizedVolume,
  } as const;
};
