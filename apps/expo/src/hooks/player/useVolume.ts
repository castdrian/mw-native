import { useCallback, useState } from "react";
import { useSharedValue } from "react-native-reanimated";

import { useDebounce } from "../useDebounce";

export const useVolume = () => {
  const [showVolumeOverlay, setShowVolumeOverlay] = useState(false);
  const debouncedShowVolumeOverlay = useDebounce(showVolumeOverlay, 20);
  const volume = useSharedValue(1);
  const debouncedVolume = useDebounce(volume.value, 20);

  const handleVolumeChange = useCallback((newValue: number) => {
    volume.value = newValue;
    setShowVolumeOverlay(true);
  }, []);

  return {
    showVolumeOverlay: debouncedShowVolumeOverlay,
    currentVolume: volume,
    debouncedVolume: `${Math.round(debouncedVolume * 100)}%`,
    setShowVolumeOverlay,
    handleVolumeChange,
  } as const;
};
