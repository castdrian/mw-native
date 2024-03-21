import type { AVPlaybackSource } from "expo-av";
import { useEffect, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import * as NavigationBar from "expo-navigation-bar";
import { useRouter } from "expo-router";
import * as StatusBar from "expo-status-bar";
import { Spinner, Text, View } from "tamagui";

import { findHighestQuality } from "@movie-web/provider-utils";

import { useAudioTrack } from "~/hooks/player/useAudioTrack";
import { useBrightness } from "~/hooks/player/useBrightness";
import { usePlaybackSpeed } from "~/hooks/player/usePlaybackSpeed";
import { usePlayer } from "~/hooks/player/usePlayer";
import { useVolume } from "~/hooks/player/useVolume";
import { getGestureControls } from "~/settings";
import { useAudioTrackStore } from "~/stores/audio";
import { usePlayerStore } from "~/stores/player/store";
import { CaptionRenderer } from "./CaptionRenderer";
import { ControlsOverlay } from "./ControlsOverlay";
import { isPointInSliderVicinity } from "./VideoSlider";

export const VideoPlayer = () => {
  const {
    brightness,
    showBrightnessOverlay,
    currentBrightness,
    setShowBrightnessOverlay,
    handleBrightnessChange,
  } = useBrightness();
  const { showVolumeOverlay, setShowVolumeOverlay, volume, currentVolume } =
    useVolume();
  const { currentSpeed } = usePlaybackSpeed();
  const { synchronizePlayback } = useAudioTrack();
  const { dismissFullscreenPlayer } = usePlayer();
  const [videoSrc, setVideoSrc] = useState<AVPlaybackSource>();
  const [isLoading, setIsLoading] = useState(true);
  const [resizeMode, setResizeMode] = useState(ResizeMode.CONTAIN);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const isGestureInSliderVicinity = useSharedValue(false);
  const router = useRouter();
  const scale = useSharedValue(1);

  const state = usePlayerStore((state) => state.interface.state);
  const isIdle = usePlayerStore((state) => state.interface.isIdle);
  const stream = usePlayerStore((state) => state.interface.currentStream);
  const selectedAudioTrack = useAudioTrackStore((state) => state.selectedTrack);
  const videoRef = usePlayerStore((state) => state.videoRef);
  const asset = usePlayerStore((state) => state.asset);
  const setVideoRef = usePlayerStore((state) => state.setVideoRef);
  const setStatus = usePlayerStore((state) => state.setStatus);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);
  const toggleAudio = usePlayerStore((state) => state.toggleAudio);
  const toggleState = usePlayerStore((state) => state.toggleState);

  const [gestureControlsEnabled, setGestureControlsEnabled] = useState(true);

  useEffect(() => {
    void getGestureControls().then((enabled) => {
      setGestureControlsEnabled(enabled);
    });
  }, []);

  const checkGestureInSliderVicinity = (x: number, y: number) => {
    isGestureInSliderVicinity.value = isPointInSliderVicinity(x, y);
  };

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

  const doubleTapGesture = Gesture.Tap()
    .enabled(gestureControlsEnabled)
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(toggleAudio)();
      runOnJS(toggleState)();
    });

  const screenHalfWidth = Dimensions.get("window").width / 2;

  const panGesture = Gesture.Pan()
    .enabled(gestureControlsEnabled)
    .onStart((event) => {
      runOnJS(checkGestureInSliderVicinity)(event.x, event.y);
      if (isGestureInSliderVicinity.value) {
        return;
      }
      if (event.x > screenHalfWidth) {
        runOnJS(setShowVolumeOverlay)(true);
      } else {
        runOnJS(setShowBrightnessOverlay)(true);
      }
    })
    .onUpdate((event) => {
      const divisor = 5000;
      const panIsInHeaderOrFooter = event.y < 100 || event.y > 400;
      if (panIsInHeaderOrFooter) return;

      const directionMultiplier = event.velocityY < 0 ? 1 : -1;

      const change = directionMultiplier * Math.abs(event.velocityY / divisor);

      if (event.x > screenHalfWidth) {
        const newVolume = Math.max(0, Math.min(1, volume.value + change));
        volume.value = newVolume;
      } else {
        const newBrightness = Math.max(
          0,
          Math.min(1, brightness.value + change),
        );
        brightness.value = newBrightness;
        runOnJS(handleBrightnessChange)(newBrightness);
      }
    })
    .onEnd((event) => {
      if (event.x > screenHalfWidth) {
        runOnJS(setShowVolumeOverlay)(false);
      } else {
        runOnJS(setShowBrightnessOverlay)(false);
      }
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
      if (asset) {
        setVideoSrc(asset);
        setIsLoading(false);
        return;
      }

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
      void synchronizePlayback();
    };
  }, [
    asset,
    dismissFullscreenPlayer,
    hasStartedPlaying,
    router,
    selectedAudioTrack,
    stream,
    synchronizePlayback,
  ]);

  const onVideoLoadStart = () => {
    setIsLoading(true);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
    setHasStartedPlaying(true);
    if (videoRef) {
      void videoRef.setRateAsync(currentSpeed, true);
    }
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <View
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        backgroundColor="black"
      >
        <Video
          ref={setVideoRef}
          source={videoSrc}
          shouldPlay={state === "playing"}
          resizeMode={resizeMode}
          volume={volume.value}
          rate={currentSpeed}
          onLoadStart={onVideoLoadStart}
          onReadyForDisplay={onReadyForDisplay}
          onPlaybackStatusUpdate={setStatus}
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              ...(!isIdle && {
                opacity: 0.7,
              }),
            },
          ]}
          onTouchStart={() => setIsIdle(!isIdle)}
        />
        <View
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          {isLoading && (
            <Spinner
              size="large"
              color="$loadingIndicator"
              position="absolute"
            />
          )}
          <ControlsOverlay isLoading={isLoading} />
        </View>
        {showVolumeOverlay && <VolumeOverlay volume={currentVolume} />}
        {showBrightnessOverlay && (
          <BrightnessOverlay brightness={currentBrightness} />
        )}
        <CaptionRenderer />
      </View>
    </GestureDetector>
  );
};

function BrightnessOverlay(props: { brightness: number }) {
  return (
    <View
      position="absolute"
      bottom={48}
      alignSelf="center"
      borderRadius={999}
      backgroundColor="black"
      padding={12}
      opacity={0.5}
    >
      <Text fontWeight="bold">
        Brightness: {Math.round(props.brightness * 100)}%
      </Text>
    </View>
  );
}

function VolumeOverlay(props: { volume: number }) {
  return (
    <View
      position="absolute"
      bottom={48}
      alignSelf="center"
      borderRadius={999}
      backgroundColor="black"
      padding={12}
      opacity={0.5}
    >
      <Text fontWeight="bold">Volume: {Math.round(props.volume * 100)}%</Text>
    </View>
  );
}
