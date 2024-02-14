import type { AVPlaybackSource } from "expo-av";
import React, { useEffect, useState } from "react";
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
import * as Brightness from "expo-brightness";
import * as NavigationBar from "expo-navigation-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as StatusBar from "expo-status-bar";

import type { ScrapeMedia, Stream } from "@movie-web/provider-utils";
import { findHighestQuality } from "@movie-web/provider-utils";

import type { ItemData } from "~/components/item/item";
import type { HeaderData } from "~/components/player/Header";
import { ControlsOverlay } from "~/components/player/ControlsOverlay";
import { usePlayerStore } from "~/stores/player/store";

export default function VideoPlayerWrapper() {
  const params = useLocalSearchParams();
  const data = params.data
    ? (JSON.parse(params.data as string) as VideoPlayerData)
    : null;
  return <VideoPlayer data={data} />;
}

export interface VideoPlayerData {
  item: ItemData;
  stream: Stream;
  media: ScrapeMedia;
}

interface VideoPlayerProps {
  data: VideoPlayerData | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ data }) => {
  const [videoSrc, setVideoSrc] = useState<AVPlaybackSource>();
  const [isLoading, setIsLoading] = useState(true);
  const [headerData, setHeaderData] = useState<HeaderData>();
  const [resizeMode, setResizeMode] = useState(ResizeMode.CONTAIN);
  const [shouldPlay, setShouldPlay] = useState(true);
  const [currentVolume, setCurrentVolume] = useState(0.5);
  const router = useRouter();
  const scale = useSharedValue(1);
  const setVideoRef = usePlayerStore((state) => state.setVideoRef);
  const setStatus = usePlayerStore((state) => state.setStatus);
  const isIdle = usePlayerStore((state) => state.interface.isIdle);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);
  const presentFullscreenPlayer = usePlayerStore(
    (state) => state.presentFullscreenPlayer,
  );
  const dismissFullscreenPlayer = usePlayerStore(
    (state) => state.dismissFullscreenPlayer,
  );

  const updateResizeMode = (newMode: ResizeMode) => {
    setResizeMode(newMode);
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

  const brightness = useSharedValue(0.5);

  const handleVolumeChange = (newValue: number) => {
    setCurrentVolume(newValue);
  };

  const handleBrightnessChange = async (newValue: number) => {
    try {
      await Brightness.setBrightnessAsync(newValue);
    } catch (error) {
      console.error("Failed to set brightness:", error);
    }
  };

  const screenHalfWidth = Dimensions.get("window").width / 2;

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      const isRightHalf = event.x > screenHalfWidth;
      if (isRightHalf) {
        runOnJS(setCurrentVolume)(0.5);
      } else {
        brightness.value = 0.5;
      }
    })
    .onUpdate((event) => {
      const divisor = 5000;
      if (event.x > screenHalfWidth) {
        const change = -event.translationY / divisor;
        const newVolume = Math.max(0, Math.min(1, currentVolume + change));
        runOnJS(handleVolumeChange)(newVolume);
      } else {
        const change = -event.translationY / divisor;
        const newBrightness = Math.max(
          0,
          Math.min(1, brightness.value + change),
        );
        brightness.value = newBrightness;
        runOnJS(handleBrightnessChange)(newBrightness);
      }
    });

  const composedGesture = Gesture.Exclusive(
    panGesture,
    pinchGesture,
    doubleTapGesture,
  );

  useEffect(() => {
    const initializePlayer = async () => {
      if (!data) {
        await dismissFullscreenPlayer();
        return router.push("/(tabs)");
      }

      StatusBar.setStatusBarHidden(true);

      if (Platform.OS === "android") {
        await NavigationBar.setVisibilityAsync("hidden");
      }

      const { status } = await Brightness.requestPermissionsAsync();
      if (status !== Brightness.PermissionStatus.GRANTED) {
        console.warn("Brightness permissions not granted");
      }

      try {
        const currentBrightness = await Brightness.getBrightnessAsync();
        brightness.value = currentBrightness;
      } catch (error) {
        console.error("Failed to get initial brightness:", error);
      }

      setIsLoading(true);

      const { item, stream, media } = data;

      setHeaderData({
        title: item.title,
        year: item.year,
        season: media.type === "show" ? media.season.number : undefined,
        episode: media.type === "show" ? media.episode.number : undefined,
      });

      let highestQuality;
      let url;

      switch (stream.type) {
        case "file":
          highestQuality = findHighestQuality(stream);
          url = highestQuality ? stream.qualities[highestQuality]?.url : null;
          return url ?? null;
        case "hls":
          url = stream.playlist;
      }

      // setTextTracks(
      //   stream.captions && stream.captions.length > 0
      //     ? convertCaptionsToTextTracks(stream.captions)
      //     : [],
      // );

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
    void presentFullscreenPlayer();
    void initializePlayer();

    return () => {
      void dismissFullscreenPlayer();
      StatusBar.setStatusBarHidden(false);
      if (Platform.OS === "android") {
        void NavigationBar.setVisibilityAsync("visible");
      }
    };
  }, [
    brightness,
    data,
    dismissFullscreenPlayer,
    presentFullscreenPlayer,
    router,
  ]);

  const onVideoLoadStart = () => {
    setIsLoading(true);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
  };

  return (
    <GestureDetector gesture={composedGesture}>
      <View className="flex-1 items-center justify-center bg-black">
        <Video
          ref={setVideoRef}
          source={videoSrc}
          shouldPlay={shouldPlay}
          resizeMode={resizeMode}
          volume={currentVolume}
          onLoadStart={onVideoLoadStart}
          onReadyForDisplay={onReadyForDisplay}
          onPlaybackStatusUpdate={setStatus}
          style={styles.video}
          onTouchStart={() => setIsIdle(!isIdle)}
        />
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {!isLoading && headerData && (
          <ControlsOverlay headerData={headerData} />
        )}
      </View>
    </GestureDetector>
  );
};

// interface Caption {
//   type: "srt" | "vtt";
//   id: string;
//   url: string;
//   hasCorsRestrictions: boolean;
//   language: string;
// }

// const captionTypeToTextTracksType = {
//   srt: TextTracksType.SUBRIP,
//   vtt: TextTracksType.VTT,
// };

// function convertCaptionsToTextTracks(captions: Caption[]): TextTracks {
//   return captions
//     .map((caption) => {
//       if (Platform.OS === "ios" && caption.type !== "vtt") {
//         return null;
//       }

//       return {
//         title: caption.language,
//         language: caption.language as ISO639_1,
//         type: captionTypeToTextTracksType[caption.type],
//         uri: caption.url,
//       };
//     })
//     .filter(Boolean) as TextTracks;
// }

const styles = StyleSheet.create({
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
