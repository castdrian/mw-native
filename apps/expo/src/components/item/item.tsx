import type { NativeSyntheticEvent } from "react-native";
import type { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";
import { useCallback } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import ContextMenu from "react-native-context-menu-view";
import { useRouter } from "expo-router";
import { Image, Text, View } from "tamagui";

import { useToast } from "~/hooks/useToast";
import { usePlayerStore } from "~/stores/player/store";
import { useBookmarkStore, useWatchHistoryStore } from "~/stores/settings";

export interface ItemData {
  id: string;
  title: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  year: number;
  release_date?: Date;
  posterUrl: string;
}

enum ContextMenuActions {
  Bookmark = "Bookmark",
  RemoveBookmark = "Remove Bookmark",
  Download = "Download",
  RemoveWatchHistoryItem = "Remove from Continue Watching",
}

function checkReleased(media: ItemData): boolean {
  const isReleasedYear = Boolean(
    media.year && media.year <= new Date().getFullYear(),
  );
  const isReleasedDate = Boolean(
    media.release_date && media.release_date <= new Date(),
  );

  // If the media has a release date, use that, otherwise use the year
  const isReleased = media.release_date ? isReleasedDate : isReleasedYear;

  return isReleased;
}

export default function Item({ data }: { data: ItemData }) {
  const resetVideo = usePlayerStore((state) => state.resetVideo);
  const router = useRouter();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const { hasWatchHistoryItem, removeFromWatchHistory } =
    useWatchHistoryStore();
  const { showToast } = useToast();

  const { title, type, year, posterUrl } = data;

  const isReleased = useCallback(() => checkReleased(data), [data]);

  const handlePress = () => {
    if (!isReleased()) {
      showToast("This media is not released yet", {
        burntOptions: { preset: "error" },
      });
      return;
    }
    resetVideo();
    Keyboard.dismiss();
    router.push({
      pathname: "/videoPlayer",
      params: { data: JSON.stringify(data) },
    });
  };

  const contextMenuActions = [
    {
      title: isBookmarked(data)
        ? ContextMenuActions.RemoveBookmark
        : ContextMenuActions.Bookmark,
    },
    ...(type === "movie" ? [{ title: ContextMenuActions.Download }] : []),
    ...(hasWatchHistoryItem(data)
      ? [{ title: ContextMenuActions.RemoveWatchHistoryItem }]
      : []),
  ];

  const onContextMenuPress = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
  ) => {
    if (e.nativeEvent.name === ContextMenuActions.Bookmark) {
      addBookmark(data);
      showToast("Added to bookmarks", {
        burntOptions: { preset: "done" },
      });
    } else if (e.nativeEvent.name === ContextMenuActions.RemoveBookmark) {
      removeBookmark(data);
      showToast("Removed from bookmarks", {
        burntOptions: { preset: "done" },
      });
    } else if (e.nativeEvent.name === ContextMenuActions.Download) {
      router.push({
        pathname: "/videoPlayer",
        params: { data: JSON.stringify(data), download: "true" },
      });
    } else if (
      e.nativeEvent.name === ContextMenuActions.RemoveWatchHistoryItem
    ) {
      removeFromWatchHistory(data);
      showToast("Removed from Continue Watching", {
        burntOptions: { preset: "done" },
      });
    }
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
            height="$14"
          >
            <Image source={{ uri: posterUrl }} width="100%" height="100%" />
          </View>
        </ContextMenu>
        <Text fontWeight="bold" fontSize={14}>
          {title}
        </Text>
        <View flexDirection="row" alignItems="center" gap={3}>
          <Text fontSize={12} color="$ash100">
            {type === "tv" ? "Show" : "Movie"}
          </Text>
          <View
            height={6}
            width={6}
            borderRadius={24}
            backgroundColor="$ash100"
          />
          <Text fontSize={12} color="$ash100">
            {isReleased() ? year : "Unreleased"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
