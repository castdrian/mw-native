import { useCallback } from "react";
import { View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import VideoSlider from "./VideoSlider";

export const ProgressBar = () => {
  const status = usePlayerStore((state) => state.status);
  const videoRef = usePlayerStore((state) => state.videoRef);

  const updateProgress = useCallback(
    (newProgress: number) => {
      videoRef?.setStatusAsync({ positionMillis: newProgress }).catch(() => {
        console.error("Error updating progress");
      });
    },
    [videoRef],
  );

  if (status?.isLoaded) {
    return (
      <View className="flex h-10 flex-1 items-center justify-center p-8">
        <VideoSlider onSlidingComplete={updateProgress} />
      </View>
    );
  }
};
