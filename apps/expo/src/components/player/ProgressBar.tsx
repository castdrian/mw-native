import { useCallback, useRef } from "react";
import { Dimensions, PanResponder, TouchableOpacity, View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";

export const ProgressBar = () => {
  const status = usePlayerStore((state) => state.status);
  const videoRef = usePlayerStore((state) => state.videoRef);

  const screenWidth = Dimensions.get("window").width;
  const progressBarWidth = screenWidth - 40; // Adjust the padding as needed

  const updateProgress = useCallback(
    (newProgress: number) => {
      videoRef?.setStatusAsync({ positionMillis: newProgress }).catch(() => {
        console.log("Error updating progress");
      });
    },
    [videoRef],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        console.log(gestureState.moveX, gestureState.x0, gestureState.dx);
      },
      onPanResponderRelease: (e, gestureState) => {
        console.log("onPanResponderRelease");
        const { moveX, x0 } = gestureState;
        const newProgress = (moveX - x0) / progressBarWidth;
        updateProgress(newProgress);
      },
    }),
  ).current;

  if (status?.isLoaded) {
    const progressRatio =
      status.durationMillis && status.durationMillis !== 0
        ? status.positionMillis / status.durationMillis
        : 0;
    return (
      <View className="flex h-8 flex-1 items-center justify-center">
        {/* Progress Dot */}
        <View className="absolute inset-x-0 top-0">
          <View
            className="z-10 h-4 w-4 rounded-full bg-primary-100"
            style={{
              left: `${progressRatio * 100}%`,
              transform: [
                { translateY: 7 },
                {
                  translateX: -4,
                },
              ],
            }}
          />
        </View>

        {/* Full bar */}
        <TouchableOpacity
          className="relative h-1 w-full rounded-full bg-secondary-300 bg-opacity-25 transition-[height] duration-100"
          {...panResponder.panHandlers}
        >
          {/* TODO: Preloaded */}
          <View className="absolute left-0 top-0 h-full rounded-full bg-secondary-300" />

          {/* Progress */}
          <View
            className="dir-neutral:left-0 absolute top-0 flex h-full items-center justify-end rounded-full bg-primary-100"
            style={{
              width: `${progressRatio * 100}%`,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
};
