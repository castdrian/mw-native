import type { AVPlaybackSource } from "expo-av";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import * as NavigationBar from "expo-navigation-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as StatusBar from "expo-status-bar";

import type {
	ScrapeMedia,
	Stream} from "@movie-web/provider-utils";
import {
  findHighestQuality,
} from "@movie-web/provider-utils";

import type { ItemData } from "~/components/item/item";
import type { HeaderData } from "~/components/player/Header";
import { Header } from "~/components/player/Header";
import { MiddleControls } from "~/components/player/MiddleControls";
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
	  StatusBar.setStatusBarHidden(true);
      await NavigationBar.setVisibilityAsync("hidden");
      setIsLoading(true);
      
	  if (!data) {
		await dismissFullscreenPlayer();
		return router.push("/(tabs)");
	  }

	  const { item, stream, media } = data;

	  setHeaderData({
		title: item.title,
		year: item.year,
		season:
		  media.type === "show" ? media.season.number : undefined,
		episode:
		  media.type === "show"
			? media.episode.number
			: undefined,
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
      void NavigationBar.setVisibilityAsync("visible");
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
      {!isLoading && data && <Header data={headerData!} />}
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
