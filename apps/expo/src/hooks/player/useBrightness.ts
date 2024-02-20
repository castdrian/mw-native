import { useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import * as Brightness from "expo-brightness";

import { useDebounce } from "../useDebounce";

export const useBrightness = () => {
  const [showBrightnessOverlay, setShowBrightnessOverlay] = useState(false);
  const debouncedShowBrightnessOverlay = useDebounce(showBrightnessOverlay, 20);
  const brightness = useSharedValue(0.5);
  const debouncedBrightness = useDebounce(brightness.value, 20);

  useEffect(() => {
    async function init() {
      try {
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === Brightness.PermissionStatus.GRANTED) {
          const currentBrightness = await Brightness.getBrightnessAsync();
          brightness.value = currentBrightness;
        }
      } catch (error) {
        console.error("Failed to get brightness permissions:", error);
      }
    }

    void init();
  }, [brightness]);

  const handleBrightnessChange = useCallback(
    async (newValue: number) => {
      try {
        setShowBrightnessOverlay(true);
        brightness.value = newValue;
        await Brightness.setBrightnessAsync(newValue);
      } catch (error) {
        console.error("Failed to set brightness:", error);
      }
    },
    [brightness],
  );

  return {
    showBrightnessOverlay: debouncedShowBrightnessOverlay,
    brightness,
    debouncedBrightness: `${Math.round(debouncedBrightness * 100)}%`,
    setShowBrightnessOverlay,
    handleBrightnessChange,
  } as const;
};
