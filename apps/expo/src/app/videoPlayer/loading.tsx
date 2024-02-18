import { useEffect, useState } from "react";
import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import type { RunnerEvent } from "@movie-web/provider-utils";
import {
  getVideoStream,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails } from "@movie-web/tmdb";

import type { VideoPlayerData } from ".";
import type { ItemData } from "~/components/item/item";
import ScreenLayout from "~/components/layout/ScreenLayout";

interface Event {
  originalEvent: RunnerEvent;
  formattedMessage: string;
  style: object;
}

export default function LoadingScreenWrapper() {
  const params = useLocalSearchParams();
  const sourceId = params.sourceID as string | undefined;
  const data = params.data
    ? (JSON.parse(params.data as string) as ItemData)
    : null;
  const seasonData = params.seasonData
    ? (JSON.parse(params.seasonData as string) as {
        season: number;
        episode: number;
      })
    : null;
  return (
    <LoadingScreen sourceId={sourceId} data={data} seasonData={seasonData} />
  );
}

function LoadingScreen({
  sourceId,
  data,
  seasonData,
}: {
  sourceId: string | undefined;
  data: ItemData | null;
  seasonData: { season: number; episode: number } | null;
}) {
  const router = useRouter();
  const [eventLog, setEventLog] = useState<Event[]>([]);

  const handleEvent = (event: RunnerEvent) => {
    const { message, style } = formatEvent(event);
    const formattedEvent: Event = {
      originalEvent: event,
      formattedMessage: message,
      style: style,
    };
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
        season = seasonData?.season ?? undefined;
        episode = seasonData?.episode ?? undefined;
      }

      const scrapeMedia = transformSearchResultToScrapeMedia(
        type,
        result,
        season,
        episode,
      );

      const stream = await getVideoStream({
        sourceId,
        media: scrapeMedia,
        onEvent: handleEvent,
      }).catch(() => null);
      if (!stream) return null;

      return { stream, scrapeMedia };
    };

    const initialize = async () => {
      const video = await fetchVideo();
      if (!video || !data) {
        return router.back();
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
  }, [data, router, seasonData?.episode, seasonData?.season, sourceId]);

  return (
    <ScreenLayout
      title="Checking sources"
      subtitle="Fetching sources for the requested content."
    >
      {eventLog.map((event, index) => (
        <Text key={index} style={{ ...event.style, marginVertical: 5 }}>
          {event.formattedMessage}
        </Text>
      ))}
    </ScreenLayout>
  );
}

function formatEvent(event: RunnerEvent): { message: string; style: object } {
  let message = "";
  let style = {};

  if (typeof event === "string") {
    message = `🚀 Start: ID - ${event}`;
    style = { color: "lime" };
  } else if (typeof event === "object" && event !== null) {
    if ("percentage" in event) {
      const evt = event;
      const statusMessage =
        evt.status === "success"
          ? "✅ Completed"
          : evt.status === "failure"
            ? "❌ Failed - " + (evt.reason ?? "Unknown Error")
            : evt.status === "notfound"
              ? "🔍 Not Found"
              : evt.status === "pending"
                ? "⏳ In Progress"
                : "❓ Unknown Status";

      message = `Update: ${evt.percentage}% - Status: ${statusMessage}`;
      let color = "";
      switch (evt.status) {
        case "success":
          color = "green";
          break;
        case "failure":
          color = "red";
          break;
        case "notfound":
          color = "blue";
          break;
        case "pending":
          color = "yellow";
          break;
        default:
          color = "grey";
          break;
      }
      style = { color };
    } else if ("sourceIds" in event) {
      const evt = event;
      message = `🔍 Initialization: Source IDs - ${evt.sourceIds.join(" ")}`;
      style = { color: "skyblue" };
    } else if ("sourceId" in event) {
      const evt = event;
      const embedsInfo = evt.embeds
        .map((embed) => `ID: ${embed.id}, Scraper: ${embed.embedScraperId}`)
        .join("; ");

      message = `🔗 Discovered Embeds: Source ID - ${evt.sourceId} [${embedsInfo}]`;
      style = { color: "orange" };
    }
  } else {
    message = JSON.stringify(event);
    style = { color: "grey" };
  }

  return { message, style };
}
