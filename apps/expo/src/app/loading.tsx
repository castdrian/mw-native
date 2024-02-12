import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  getVideoStream,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails } from "@movie-web/tmdb";

import type { VideoPlayerData } from "./videoPlayer";
import type { ItemData } from "~/components/item/item";
import ScreenLayout from "~/components/layout/ScreenLayout";

export default function LoadingScreenWrapper() {
  const params = useLocalSearchParams();
  const data = params.data
    ? (JSON.parse(params.data as string) as ItemData)
    : null;
  return <LoadingScreen data={data} />;
}

function LoadingScreen({ data }: { data: ItemData | null }) {
  const router = useRouter();
  const [eventLog, setEventLog] = useState<string[]>([]);

  const handleEvent = (event: unknown) => {
    const formattedEvent = formatEvent(event);
    setEventLog((prevLog) => [...prevLog, formattedEvent]);
  };

  useEffect(() => {
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

      const stream = await getVideoStream({
        media: scrapeMedia,
        onEvent: handleEvent,
      }).catch(() => null);
      if (!stream) return null;

      return { stream, scrapeMedia };
    };

    const initialize = async () => {
      const video = await fetchVideo();
      if (!video || !data) {
        return router.push({ pathname: "/(tabs)" });
      }

      const videoPlayerData: VideoPlayerData = {
        item: data,
        stream: video.stream,
        media: video.scrapeMedia,
      };

      router.replace({
        pathname: "/videoPlayer",
        params: { data: JSON.stringify(videoPlayerData) },
      });
    };

    void initialize();
  }, [data, router]);

  return (
    <ScreenLayout
      title="Checking sources"
      subtitle="Fetching sources for the requested content."
    >
      {eventLog.map((event, index) => (
        <Text key={index} style={{ color: "white", marginVertical: 5 }}>
          {event}
        </Text>
      ))}
    </ScreenLayout>
  );
}

function formatEvent(event: unknown): string {
  if (typeof event === "string") {
    return `Start: ID - ${event}`;
  } else if (typeof event === "object" && event !== null) {
    const evt = event as Record<string, unknown>;
    if ("percentage" in evt) {
      return `Update: ${String(evt.percentage)}% - Status: ${String(evt.status)}`;
    } else if ("sourceIds" in evt) {
      return `Initialization: Source IDs - ${String(evt.sourceIds)}`;
    } else if ("sourceId" in evt) {
      return `Discovered Embeds: Source ID - ${String(evt.sourceId)}`;
    }
  }
  return JSON.stringify(event);
}
