import type { AVPlaybackSource } from "expo-av";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import * as NavigationBar from "expo-navigation-bar";
import { useRouter } from "expo-router";
import * as StatusBar from "expo-status-bar";

import { findHighestQuality } from "@movie-web/provider-utils";

import { useBrightness } from "~/hooks/player/useBrightness";
import { usePlayer } from "~/hooks/player/usePlayer";
import { useVolume } from "~/hooks/player/useVolume";
import { useAudioTrackStore } from "~/stores/audio";
import { usePlayerStore } from "~/stores/player/store";
import { Text } from "../ui/Text";
import { CaptionRenderer } from "./CaptionRenderer";
import { ControlsOverlay } from "./ControlsOverlay";

export const VideoPlayer = () => {
  const {
    brightness,
    debouncedBrightness,
    showBrightnessOverlay,
    setShowBrightnessOverlay,
    handleBrightnessChange,
  } = useBrightness();
  const {
    currentVolume,
    debouncedVolume,
    showVolumeOverlay,
    setShowVolumeOverlay,
    handleVolumeChange,
  } = useVolume();
  const { dismissFullscreenPlayer } = usePlayer();
  const [videoSrc, setVideoSrc] = useState<AVPlaybackSource>();
  const [isLoading, setIsLoading] = useState(true);
  const [resizeMode, setResizeMode] = useState(ResizeMode.CONTAIN);
  const [shouldPlay, setShouldPlay] = useState(true);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const router = useRouter();
  const scale = useSharedValue(1);
  const [lastVelocityY, setLastVelocityY] = useState(0);

  const isIdle = usePlayerStore((state) => state.interface.isIdle);
  const stream = usePlayerStore((state) => state.interface.currentStream);
  const audioTracks = usePlayerStore((state) => state.interface.audioTracks);
  const _selectedAudioTrack = useAudioTrackStore(
    (state) => state.selectedTrack,
  );
  const setVideoRef = usePlayerStore((state) => state.setVideoRef);
  const setStatus = usePlayerStore((state) => state.setStatus);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);

  const updateResizeMode = (newMode: ResizeMode) => {
    setResizeMode(newMode);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    scale.value = e.scale;
    if (scale.value > 1 && resizeMode !== ResizeMode.COVER) {
      runOnJS(updateResizeMode)(ResizeMode.COVER);
    } else if (scale.value <= 1 && resizeMode !== ResizeMode.CONTAIN) {
      runOnJS(updateResizeMode)(ResizeMode.CONTAIN);
    }
  });

  const togglePlayback = () => {
    setShouldPlay(!shouldPlay);
  };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(togglePlayback)();
    });

  const screenHalfWidth = Dimensions.get("window").width / 2;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const divisor = 5000;
      const panIsInHeaderOrFooter = event.y < 100 || event.y > 400;
      if (panIsInHeaderOrFooter) return;

      const directionMultiplier = event.velocityY < 0 ? 1 : -1;

      const change = directionMultiplier * Math.abs(event.velocityY / divisor);
      const newVolume = Math.max(0, Math.min(1, currentVolume.value + change));
      const newBrightness = Math.max(0, Math.min(1, brightness.value + change));

      if (event.x > screenHalfWidth) {
        runOnJS(handleVolumeChange)(newVolume);
      } else {
        brightness.value = newBrightness;
        runOnJS(handleBrightnessChange)(newBrightness);
      }

      if (
        (event.velocityY < 0 && lastVelocityY >= 0) ||
        (event.velocityY >= 0 && lastVelocityY < 0)
      ) {
        runOnJS(setLastVelocityY)(event.velocityY);
      }

      if (event.x > screenHalfWidth) {
        runOnJS(handleVolumeChange)(newVolume);
        runOnJS(setShowVolumeOverlay)(true);
      } else {
        runOnJS(handleBrightnessChange)(newBrightness);
        runOnJS(setShowBrightnessOverlay)(true);
      }
    })
    .onEnd(() => {
      runOnJS(setLastVelocityY)(0);
      runOnJS(setShowVolumeOverlay)(false);
      runOnJS(setShowBrightnessOverlay)(false);
    });

  const composedGesture = Gesture.Race(
    panGesture,
    pinchGesture,
    doubleTapGesture,
  );

  StatusBar.setStatusBarHidden(true);

  if (Platform.OS === "android") {
    void NavigationBar.setVisibilityAsync("hidden");
  }

  useEffect(() => {
    const initializePlayer = async () => {
      if (!stream) {
        await dismissFullscreenPlayer();
        return router.back();
      }
      setIsLoading(true);

      let url = null;

      if (stream.type === "hls") {
        url = stream.playlist;
      }

      if (stream.type === "file") {
        const highestQuality = findHighestQuality(stream);
        url = highestQuality ? stream.qualities[highestQuality]?.url : null;
      }

      if (!url) {
        await dismissFullscreenPlayer();
        return router.back();
      }

      setVideoSrc({
        uri: url,
        headers: {
          ...stream.preferredHeaders,
          ...stream.headers,
        },
      });

      setIsLoading(false);
    };

    setIsLoading(true);
    void initializePlayer();

    const timeout = setTimeout(() => {
      if (!hasStartedPlaying) {
        router.back();
      }
    }, 60000);

    return () => {
      clearTimeout(timeout);
    };
  }, [audioTracks, dismissFullscreenPlayer, hasStartedPlaying, router, stream]);

  const onVideoLoadStart = () => {
    setIsLoading(true);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
    setHasStartedPlaying(true);
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <View className="flex-1 items-center justify-center bg-black">
        <Video
          ref={setVideoRef}
          source={videoSrc}
          shouldPlay={shouldPlay}
          resizeMode={resizeMode}
          volume={currentVolume.value}
          onLoadStart={onVideoLoadStart}
          onReadyForDisplay={onReadyForDisplay}
          onPlaybackStatusUpdate={setStatus}
          style={[
            styles.video,
            {
              ...(!isIdle && {
                opacity: 0.7,
              }),
            },
          ]}
          onTouchStart={() => setIsIdle(!isIdle)}
        />
        <View className="h-full w-full flex-1 items-center justify-center">
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              className="absolute"
            />
          )}
          <ControlsOverlay isLoading={isLoading} />
        </View>
        {showVolumeOverlay && (
          <View className="absolute bottom-12 self-center rounded-xl bg-black p-3 opacity-50">
            <Text className="font-bold">Volume: {debouncedVolume}</Text>
          </View>
        )}
        {showBrightnessOverlay && (
          <View className="absolute bottom-12 self-center rounded-xl bg-black p-3 opacity-50">
            <Text className="font-bold">Brightness: {debouncedBrightness}</Text>
          </View>
        )}
        <CaptionRenderer />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
