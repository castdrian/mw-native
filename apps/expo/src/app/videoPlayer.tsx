import type { AVPlaybackSource } from "expo-av";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  findHighestQuality,
  getVideoStream,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails } from "@movie-web/tmdb";

import type { ItemData } from "~/components/item/item";
import { Header } from "~/components/player/Header";
import { MiddleControls } from "~/components/player/MiddleButtons";
import { usePlayerStore } from "~/stores/player/store";

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

interface HeaderInfo {
  title: string;
  season?: number;
  episode?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ data }) => {
  const [videoSrc, setVideoSrc] = useState<AVPlaybackSource>();
  const [isLoading, setIsLoading] = useState(true);
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({ title: "" });
  const router = useRouter();
  const setVideoRef = usePlayerStore((state) => state.setVideoRef);
  const setStatus = usePlayerStore((state) => state.setStatus);
  const setIsIdle = usePlayerStore((state) => state.setIsIdle);
  const presentFullscreenPlayer = usePlayerStore(
    (state) => state.presentFullscreenPlayer,
  );
  const dismissFullscreenPlayer = usePlayerStore(
    (state) => state.dismissFullscreenPlayer,
  );

  useEffect(() => {
    const initializePlayer = async () => {
      const fetchVideo = async () => {
        if (!data) return null;
        const { id, type } = data;
        const media = await fetchMediaDetails(id, type).catch(() => null);
        if (!media) return null;

        const { result } = media;
        let season: number | undefined; // defaults to 1 when undefined
        let episode: number | undefined;

        if (type === "tv") {
          // season = <chosen by user / continue watching> ?? undefined;
          // episode = <chosen by user / continue watching> ?? undefined;
        }

        const scrapeMedia = transformSearchResultToScrapeMedia(
          type,
          result,
          season,
          episode,
        );

        setHeaderInfo({
          title: data.title,
          ...(scrapeMedia.type === "show" && {
            season: scrapeMedia.season.number,
            episode: scrapeMedia.episode.number,
          }),
        });

        const stream = await getVideoStream({
          media: scrapeMedia,
          forceVTT: true,
        }).catch(() => null);
        if (!stream) {
          await dismissFullscreenPlayer();
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
      } else {
        await dismissFullscreenPlayer();
        return router.push("/(tabs)");
      }
    };

    setIsLoading(true);
    void presentFullscreenPlayer();
    void initializePlayer();

    return () => {
      void dismissFullscreenPlayer();
    };
  }, [data, dismissFullscreenPlayer, presentFullscreenPlayer, router]);

  const onVideoLoadStart = () => {
    setIsLoading(true);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
  };

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Video
        ref={setVideoRef}
        source={videoSrc}
        shouldPlay
        resizeMode={ResizeMode.CONTAIN}
        onLoadStart={onVideoLoadStart}
        onReadyForDisplay={onReadyForDisplay}
        onPlaybackStatusUpdate={setStatus}
        style={styles.video}
        onTouchStart={() => setIsIdle(false)}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {!isLoading && data && (
        <Header
          title={
            headerInfo.season && headerInfo.episode
              ? `${headerInfo.title} S${headerInfo.season.toString().padStart(2, '0')}E${headerInfo.episode.toString().padStart(2, '0')}`
              : headerInfo.title
          }
        />
      )}
      {!isLoading && <MiddleControls />}
    </View>
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
