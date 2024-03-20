import type { NativeSyntheticEvent } from "react-native";
import type { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";
import { Keyboard, TouchableOpacity } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import { useRouter } from "expo-router";
import { Image, Text, View } from "tamagui";

import { useDownloadManager } from "~/hooks/DownloadManagerContext";
import { usePlayerStore } from "~/stores/player/store";

export interface ItemData {
  id: string;
  title: string;
  type: "movie" | "tv";
  year: number;
  posterUrl: string;
}

export default function Item({ data }: { data: ItemData }) {
  const resetVideo = usePlayerStore((state) => state.resetVideo);
  const router = useRouter();
  const { startDownload } = useDownloadManager();

  const { title, type, year, posterUrl } = data;

  const handlePress = () => {
    resetVideo();
    Keyboard.dismiss();
    router.push({
      pathname: "/videoPlayer",
      params: { data: JSON.stringify(data) },
    });
  };

  const contextMenuActions = [
    { title: "Bookmark" },
    ...(type === "movie" ? [{ title: "Download" }] : []),
  ];

  const onContextMenuPress = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
  ) => {
    console.log(e.nativeEvent.name);
    startDownload(
      "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
      "mp4",
    ).catch(console.error);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onLongPress={() => {}}
      style={{ width: "100%" }}
    >
      <View width="100%">
        <ContextMenu actions={contextMenuActions} onPress={onContextMenuPress}>
          <View
            marginBottom={4}
            aspectRatio={9 / 14}
            width="100%"
            overflow="hidden"
            borderRadius={24}
          >
            <Image source={{ uri: posterUrl }} width="100%" height="100%" />
          </View>
        </ContextMenu>
        <Text fontWeight="bold" fontSize={14}>
          {title}
        </Text>
        <View flexDirection="row" alignItems="center" gap={3}>
          <Text fontSize={12} color="gray">
            {type === "tv" ? "Show" : "Movie"}
          </Text>
          <View height={1} width={1} borderRadius={24} backgroundColor="gray" />
          <Text fontSize={12} color="gray">
            {year}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
