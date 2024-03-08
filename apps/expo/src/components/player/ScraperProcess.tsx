import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

import type {
  DiscoverEmbedsEvent,
  HlsBasedStream,
  InitEvent,
  RunnerEvent,
  UpdateEvent,
} from "@movie-web/provider-utils";
import {
  extractTracksFromHLS,
  getVideoStream,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails, fetchSeasonDetails } from "@movie-web/tmdb";

import type { ItemData } from "../item/item";
import type { AudioTrack } from "./AudioTrackSelector";
import { constructFullUrl } from "~/lib/url";
import { PlayerStatus } from "~/stores/player/slices/interface";
import { usePlayerStore } from "~/stores/player/store";
import { Text } from "../ui/Text";

interface ScraperProcessProps {
  data: ItemData;
}

enum ScrapeStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

export const ScraperProcess = ({ data }: ScraperProcessProps) => {
  const router = useRouter();

  const meta = usePlayerStore((state) => state.meta);
  const setStream = usePlayerStore((state) => state.setCurrentStream);
  const setSeasonData = usePlayerStore((state) => state.setSeasonData);
  const setHlsTracks = usePlayerStore((state) => state.setHlsTracks);
  const setAudioTracks = usePlayerStore((state) => state.setAudioTracks);
  const setPlayerStatus = usePlayerStore((state) => state.setPlayerStatus);
  const setSourceId = usePlayerStore((state) => state.setSourceId);
  const setMeta = usePlayerStore((state) => state.setMeta);
  const [checkedSource, setCheckedSource] = useState("");

  function isInitEvent(event: RunnerEvent): event is InitEvent {
    return (event as InitEvent).sourceIds !== undefined;
  }

  function isUpdateEvent(event: RunnerEvent): event is UpdateEvent {
    return (event as UpdateEvent).percentage !== undefined;
  }

  function isDiscoverEmbedsEvent(
    event: RunnerEvent,
  ): event is DiscoverEmbedsEvent {
    return (event as DiscoverEmbedsEvent).sourceId !== undefined;
  }

  const handleEvent = useCallback((event: RunnerEvent) => {
    if (typeof event === "string") {
      setCheckedSource(event);
      setScrapeStatus({ status: ScrapeStatus.LOADING, progress: 10 });
    } else if (isUpdateEvent(event)) {
      console.log(event.status);
      switch (event.status) {
        case "success":
          setScrapeStatus({ status: ScrapeStatus.SUCCESS, progress: 100 });
          break;
        case "failure":
          setScrapeStatus({ status: ScrapeStatus.ERROR, progress: 0 });
          break;
        case "pending":
        case "notfound":
      }
      setCheckedSource(event.id);
    } else if (isInitEvent(event) || isDiscoverEmbedsEvent(event)) {
      setScrapeStatus((prevStatus) => ({
        status: ScrapeStatus.LOADING,
        progress: Math.min(prevStatus.progress + 20, 95),
      }));
    }
  }, []);

  const [_scrapeStatus, setScrapeStatus] = useState({
    status: ScrapeStatus.LOADING,
    progress: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!data) return router.back();
      const media = await fetchMediaDetails(data.id, data.type);
      if (!media) return router.back();
      const scrapeMedia = transformSearchResultToScrapeMedia(
        media.type,
        media.result,
        meta?.season?.number,
        meta?.episode?.number,
      );
      let seasonData = null;
      if (scrapeMedia.type === "show") {
        seasonData = await fetchSeasonDetails(
          scrapeMedia.tmdbId,
          scrapeMedia.season.number,
        );
      }

      setMeta({
        ...scrapeMedia,
        poster: media.result.poster_path,
        ...("season" in scrapeMedia
          ? {
              season: {
                number: scrapeMedia.season.number,
                tmdbId: scrapeMedia.tmdbId,
              },
              episode: {
                number: scrapeMedia.episode.number,
                tmdbId: scrapeMedia.episode.tmdbId,
              },
              episodes:
                seasonData?.episodes.map((e) => ({
                  tmdbId: e.id.toString(),
                  number: e.episode_number,
                  name: e.name,
                })) ?? [],
            }
          : {}),
      });
      const streamResult = await getVideoStream({
        media: scrapeMedia,
        events: {
          init: handleEvent,
          update: handleEvent,
          discoverEmbeds: handleEvent,
          start: handleEvent,
        },
      });
      if (!streamResult) return router.back();
      setStream(streamResult.stream);

      if (streamResult.stream.type === "hls") {
        const tracks = await extractTracksFromHLS(
          streamResult.stream.playlist,
          {
            ...streamResult.stream.preferredHeaders,
            ...streamResult.stream.headers,
          },
        );

        if (tracks) setHlsTracks(tracks);

        if (tracks?.audio.length) {
          const audioTracks: AudioTrack[] = tracks.audio.map((track) => ({
            uri: constructFullUrl(
              (streamResult.stream as HlsBasedStream).playlist,
              track.uri,
            ),
            name: track.properties[0]?.attributes.name?.toString() ?? "Unknown",
            language:
              track.properties[0]?.attributes.language?.toString() ?? "Unknown",
            active: Boolean(track.properties[0]?.attributes.default) ?? false,
          }));

          const uniqueTracks = new Set(audioTracks.map((t) => t.language));

          const filteredAudioTracks = audioTracks.filter((track) => {
            if (uniqueTracks.has(track.language)) {
              uniqueTracks.delete(track.language);
              return true;
            }
            return false;
          });

          setAudioTracks(filteredAudioTracks);
        }
      }
      setPlayerStatus(PlayerStatus.READY);
      setSourceId(streamResult.sourceId);
    };
    void fetchData();
  }, [
    data,
    router,
    setHlsTracks,
    setSeasonData,
    setStream,
    setPlayerStatus,
    setSourceId,
    setMeta,
    meta?.season?.number,
    meta?.episode?.number,
    setAudioTracks,
    handleEvent,
  ]);

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center bg-black">
        <View className="flex flex-col items-center">
          <Text className="mb-4 text-2xl text-white">
            Checking {checkedSource}
          </Text>
          <ActivityIndicator size="large" color="#0000ff" />
          {/* <StatusCircle type={scrapeStatus.status} percentage={scrapeStatus.progress} /> */}
        </View>
      </View>
    </View>
  );
};
