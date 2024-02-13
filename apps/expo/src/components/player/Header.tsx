import { Image, View } from "react-native";

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
  return (
    <Controls className="absolute top-0 flex w-full flex-row items-center justify-between px-6 pt-6">
      <BackButton className="w-36" />
      <Text className="font-bold">
        {data.season && data.episode
          ? `${data.title} (${data.year}) S${data.season.toString().padStart(2, "0")}E${data.episode.toString().padStart(2, "0")}`
          : `${data.title} (${data.year})`}
      </Text>
      <View className="flex w-36 flex-row items-center justify-center gap-2 space-x-2 rounded-full bg-secondary-300 px-4 py-2 opacity-80">
        <Image source={Icon} className="h-6 w-6" />
        <Text className="font-bold">movie-web</Text>
      </View>
    </Controls>
  );
};
