import type { ReactVideoSource } from "react-native-video";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import {
  findHighestQuality,
  getVideoUrl,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails } from "@movie-web/tmdb";

import type { ItemData } from "./components/item/item";
import { usePlayer } from "./hooks/usePlayer";

export default function VideoPlayerWrapper() {
  const params = useLocalSearchParams();
  const data = params.data
    ? (JSON.parse(params.data as string) as ItemData)
    : null;
  return <VideoPlayer data={data} />;
}

interface VideoPlayerProps {
  data: ItemData | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ data }) => {
  const [videoSrc, setVideoSrc] = useState<ReactVideoSource>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {
    videoRef,
    unlockOrientation,
    presentFullscreenPlayer,
    dismissFullscreenPlayer,
  } = usePlayer();

  useEffect(() => {
    const initializePlayer = async () => {
      const fetchVideo = async () => {
        if (!data) return null;
        const { id, type } = data;
        const media = await fetchMediaDetails(id, type);
        if (!media) return null;

        const { result } = media;
        let season: number | undefined;
        let episode: number | undefined;

        if (type === "tv") {
          // season = <chosen by user> ?? undefined;
          // episode = <chosen by user> ?? undefined;
        }

        const scrapeMedia = transformSearchResultToScrapeMedia(
          type,
          result,
          season,
          episode,
        );

        const stream = await getVideoUrl(scrapeMedia);
        if (!stream) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP,
          );
          return router.push("/(tabs)");
        }
        return stream;
      };

      setIsLoading(true);
      const stream = await fetchVideo();

      if (stream) {
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

        setVideoSrc({
          uri: url,
          headers: {
            ...stream.preferredHeaders,
            ...stream.headers,
          },
        });
        setIsLoading(false);
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
        return router.push("/(tabs)");
      }
    };

    setIsLoading(true);
    void presentFullscreenPlayer();
    void initializePlayer();

    return () => {
      void dismissFullscreenPlayer();
      void unlockOrientation();
    };
  }, [
    data,
    dismissFullscreenPlayer,
    presentFullscreenPlayer,
    router,
    unlockOrientation,
  ]);

  const onVideoLoadStart = () => {
    setIsLoading(true);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={videoRef}
        source={videoSrc}
        style={styles.fullScreen}
        fullscreen={true}
        paused={false}
        controls={true}
        onLoadStart={onVideoLoadStart}
        onReadyForDisplay={onReadyForDisplay}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
