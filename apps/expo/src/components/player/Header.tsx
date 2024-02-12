/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Image, View } from "react-native";

import Icon from "../../../assets/images/icon-transparent.png";
import { Text } from "../ui/Text";
import { BackButton } from "./BackButton";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <View className="absolute top-0 flex w-full flex-row items-center justify-between px-6 pt-6">
      <BackButton className="w-36" />
      <Text className="font-bold">{title}</Text>
      <View className="flex w-36 flex-row items-center justify-center gap-2 space-x-2 rounded-full bg-secondary-300 px-4 py-2 opacity-80">
        <Image source={Icon} className="h-6 w-6" />
        <Text className="font-bold">movie-web</Text>
      </View>
    </View>
  );
};
