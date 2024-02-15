import { Image, Keyboard, TouchableOpacity, View } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import { useRouter } from "expo-router";

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
  const { title, type, year, posterUrl } = data;

  const handlePress = () => {
    Keyboard.dismiss();
    router.push({
      pathname: "/videoPlayer/loading",
      params: { data: JSON.stringify(data) },
    });
  };

  const contextMenuActions = [
    { title: "Bookmark" },
    ...(type === "movie" ? [{ title: "Download" }] : []),
  ];

  const onContextMenuPress = (_e: unknown) => {
    // do stuff
  };

  return (
    <TouchableOpacity onPress={handlePress} style={{ width: "100%" }}>
      <View className="w-full">
        <ContextMenu actions={contextMenuActions} onPress={onContextMenuPress}>
          <View className="mb-2 aspect-[9/14] w-full overflow-hidden rounded-2xl">
            <Image source={{ uri: posterUrl }} className="h-full w-full" />
          </View>
        </ContextMenu>
        <Text className="font-bold">{title}</Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-xs text-gray-600">
            {type === "tv" ? "Show" : "Movie"}
          </Text>
          <View className="h-1 w-1 rounded-3xl bg-gray-600" />
          <Text className="text-sm text-gray-600">{year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
