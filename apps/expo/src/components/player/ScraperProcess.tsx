import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

import {
  extractTracksFromHLS,
  getVideoStream,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails, fetchSeasonDetails } from "@movie-web/tmdb";

import type { ItemData } from "../item/item";
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
  const setPlayerStatus = usePlayerStore((state) => state.setPlayerStatus);
  const setSourceId = usePlayerStore((state) => state.setSourceId);
  const setMeta = usePlayerStore((state) => state.setMeta);

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
      }
      setPlayerStatus("ready");
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
  ]);

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center bg-black">
        <View className="flex flex-col items-center">
          <Text className="mb-4 text-2xl text-white">Checking sources</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    </View>
  );
};
