import { useCallback, useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import * as Brightness from "expo-brightness";

export const useBrightness = () => {
  const [showBrightnessOverlay, setShowBrightnessOverlay] = useState(false);

  const brightness = useSharedValue(0.5);

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

  const handleBrightnessChange = useCallback(async (newValue: number) => {
    try {
      await Brightness.setBrightnessAsync(newValue);
    } catch (error) {
      console.error("Failed to set brightness:", error);
    }
  }, []);

  return {
    showBrightnessOverlay,
    setShowBrightnessOverlay,
    brightness,
    handleBrightnessChange,
  } as const;
};
