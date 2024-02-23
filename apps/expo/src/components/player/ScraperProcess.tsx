import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

import type { HlsBasedStream, RunnerEvent } from "@movie-web/provider-utils";
import {
  extractTracksFromHLS,
  getVideoStream,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails, fetchSeasonDetails } from "@movie-web/tmdb";

import type { ItemData } from "../item/item";
import type { AudioTrack } from "./AudioTrackSelector";
import { PlayerStatus } from "~/stores/player/slices/interface";
import { usePlayerStore } from "~/stores/player/store";
import { Text } from "../ui/Text";

interface ScraperProcessProps {
  data: ItemData;
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

  const handleEvent = (event: RunnerEvent) => {
    if (typeof event === "string") {
      setCheckedSource(event);
    }
  };

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
          // init: handleEvent,
          // update: handleEvent,
          // discoverEmbeds: handleEvent,
          start: handleEvent,
        },
      });
      if (!streamResult) return router.back();
      setStream(streamResult.stream);

      if (streamResult.stream.type === "hls") {
        const tracks = await extractTracksFromHLS(
          streamResult.stream.playlist, // multiple tracks example: "https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
          {
            ...streamResult.stream.preferredHeaders,
            ...streamResult.stream.headers,
          },
        );
        if (tracks) setHlsTracks(tracks);

        const constructFullUrl = (playlistUrl: string, uri: string) => {
          const baseUrl = playlistUrl.substring(
            0,
            playlistUrl.lastIndexOf("/") + 1,
          );
          return uri.startsWith("http://") || uri.startsWith("https://")
            ? uri
            : baseUrl + uri;
        };

        if (tracks?.audio.length) {
          const audioTracks: AudioTrack[] = tracks.audio
            .map((track) => ({
              uri: constructFullUrl(
                (streamResult.stream as HlsBasedStream).playlist,
                track.uri,
              ),
              name:
                (track.properties[0]?.attributes.name as string) ?? "Unknown",
              language:
                (track.properties[0]?.attributes.language as string) ??
                "Unknown",
              active:
                (track.properties[0]?.attributes.default as boolean) ?? false,
            }))
            .filter((track, index, self) => {
              const trackUriSet = new Set(self.map((t) => t.uri));
              return (
                !trackUriSet.has(track.uri) || trackUriSet.size === index + 1
              );
            });
          setAudioTracks(audioTracks);
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
  ]);

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center bg-black">
        <View className="flex flex-col items-center">
          <Text className="mb-4 text-2xl text-white">
            Checking {checkedSource}
          </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    </View>
  );
};
