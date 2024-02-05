import type { VideoRef } from "react-native-video";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import {
  getVideoUrl,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails } from "@movie-web/tmdb";

import type { ItemData } from "./components/item/item";

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
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const videoPlayer = useRef<VideoRef>(null);
  const router = useRouter();

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

        const videoUrl = await getVideoUrl(scrapeMedia);
        if (!videoUrl) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP,
          );
          return router.push("/(tabs)");
        }
        return videoUrl;
      };

      setIsLoading(true);
      const url = await fetchVideo();
      if (url) {
        setVideoUrl(url);
        setIsLoading(false);
      } else {
        router.push("/(tabs)");
      }
    };

    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    };

    const unlockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };

    const presentFullscreenPlayer = async () => {
      if (videoPlayer.current) {
        videoPlayer.current.presentFullscreenPlayer();
        await lockOrientation();
      }
    };

    const dismissFullscreenPlayer = async () => {
      if (videoPlayer.current) {
        videoPlayer.current.dismissFullscreenPlayer();
        await unlockOrientation();
      }
    };

    setIsLoading(true);
    void presentFullscreenPlayer();
    void initializePlayer();

    return () => {
      void dismissFullscreenPlayer();
    };
  }, [data, router]);

  const onVideoLoadStart = () => {
    setIsLoading(true);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Video
        ref={videoPlayer}
        source={{ uri: videoUrl }}
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
