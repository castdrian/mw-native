import { Image, View } from "react-native";

import { usePlayerStore } from "~/stores/player/store";
import Icon from "../../../assets/images/icon-transparent.png";
import { Text } from "../ui/Text";
import { BackButton } from "./BackButton";
import { Controls } from "./Controls";

export interface HeaderData {
  title: string;
  year: number;
  season?: number;
  episode?: number;
}

interface HeaderProps {
  data: HeaderData;
}

export const Header = ({ data }: HeaderProps) => {
  const isIdle = usePlayerStore((state) => state.interface.isIdle);

  if (!isIdle) {
    return (
      <View className="flex h-16 w-full flex-row items-center justify-between px-6 pt-6">
        <Controls>
          <BackButton className="w-36" />
        </Controls>
        <Text className="font-bold">
          {data.season !== undefined && data.episode !== undefined
            ? `${data.title} (${data.year}) S${data.season.toString().padStart(2, "0")}E${data.episode.toString().padStart(2, "0")}`
            : `${data.title} (${data.year})`}
        </Text>
        <View className="flex w-36 flex-row items-center justify-center gap-2 space-x-2 rounded-full bg-secondary-300 px-4 py-2 opacity-80">
          <Image source={Icon} className="h-6 w-6" />
          <Text className="font-bold">movie-web</Text>
        </View>
      </View>
    );
  }
};
