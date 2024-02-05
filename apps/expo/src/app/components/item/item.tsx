import { Image, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";

import {
  getVideoUrl,
  transformSearchResultToScrapeMedia,
} from "@movie-web/provider-utils";
import { fetchMediaDetails } from "@movie-web/tmdb";

import { Text } from "~/components/ui/Text";

export interface ItemData {
  id: string;
  title: string;
  type: "movie" | "tv";
  year: number;
  posterUrl: string;
}

export default function Item({ data }: { data: ItemData }) {
  const router = useRouter();
  const { id, title, type, year, posterUrl } = data;

  const handlePress = async () => {
    router.push("/video-player");

    const media = await fetchMediaDetails(id, type);
    if (!media) return;

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
    console.log(videoUrl);

    router.push({
      pathname: "/video-player",
      params: { videoUrl },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ width: "100%" }}>
      {
        <View className="w-full">
          <View className="mb-2 aspect-[9/14] w-full overflow-hidden rounded-2xl">
            <Image
              source={{
                uri: posterUrl,
              }}
              className="h-full w-full"
            />
          </View>
          <Text className="font-bold">{title}</Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-xs text-gray-600">
              {type === "tv" ? "Show" : "Movie"}
            </Text>
            <View className="h-1 w-1 rounded-3xl bg-gray-600" />
            <Text className="text-sm text-gray-600">{year}</Text>
          </View>
        </View>
      }
    </TouchableOpacity>
  );
}
