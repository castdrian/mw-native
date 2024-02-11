import type {
  ISO639_1,
  ReactVideoSource,
  TextTracks,
} from "react-native-video";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import Video, { TextTracksType } from "react-native-video";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import {
  findHighestQuality,
  getVideoStream,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails } from "@movie-web/tmdb";

import type { ItemData } from "~/components/item/item";
import { usePlayer } from "../hooks/usePlayer";

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
  const [_textTracks, setTextTracks] = useState<TextTracks>([]);
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

        const stream = await getVideoStream(scrapeMedia);
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

        setTextTracks(
          stream.captions && stream.captions.length > 0
            ? convertCaptionsToTextTracks(stream.captions)
            : [],
        );

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
    <View className="flex-1 items-center justify-center bg-black">
      <Video
        ref={videoRef}
        source={videoSrc}
        // textTracks={textTracks} // breaks playback
        className="absolute inset-0"
        fullscreen={true}
        fullscreenOrientation="landscape"
        paused={false}
        controls={true}
        onLoadStart={onVideoLoadStart}
        onReadyForDisplay={onReadyForDisplay}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

interface Caption {
  type: "srt" | "vtt";
  id: string;
  url: string;
  hasCorsRestrictions: boolean;
  language: string;
}

const captionTypeToTextTracksType = {
  srt: TextTracksType.SUBRIP,
  vtt: TextTracksType.VTT,
};

function convertCaptionsToTextTracks(captions: Caption[]): TextTracks {
	return captions.map((caption) => {
		if (Platform.OS === "ios" && caption.type !== "vtt") {
			return null;
		}

		return {
			title: caption.language,
			language: caption.language as ISO639_1,
			type: captionTypeToTextTracksType[caption.type],
			uri: caption.url,
		};
	}).filter(Boolean) as TextTracks;
}
