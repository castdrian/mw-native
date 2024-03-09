import { Image, View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import Icon from "../../../assets/images/icon-transparent.png";
import { Text } from "../ui/Text";
import { BackButton } from "./BackButton";
import { Controls } from "./Controls";

const mapSeasonAndEpisodeNumberToText = (season: number, episode: number) => {
  return `S${season.toString().padStart(2, "0")}E${episode.toString().padStart(2, "0")}`;
};

export const Header = () => {
  const isIdle = usePlayerStore((state) => state.interface.isIdle);
  const meta = usePlayerStore((state) => state.meta);

  if (!isIdle && meta) {
    return (
      <View className="z-50 flex h-16 w-full flex-row items-center justify-between px-6 pt-6">
        <Controls>
          <BackButton className="w-36" />
        </Controls>
        <Text className="font-bold">
          {meta.title} ({meta.releaseYear}){" "}
          {meta.season !== undefined && meta.episode !== undefined
            ? mapSeasonAndEpisodeNumberToText(
                meta.season.number,
                meta.episode.number,
              )
            : ""}
        </Text>
        <View className="flex h-12 w-36 flex-row items-center justify-center gap-2 space-x-2 rounded-full bg-pill-background px-4 py-2 opacity-80">
          <Image source={Icon} className="h-6 w-6" />
          <Text className="font-bold">movie-web</Text>
        </View>
      </View>
    );
  }
};
