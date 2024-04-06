import type { NativeSyntheticEvent } from "react-native";
import type { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";
import React from "react";
import ContextMenu from "react-native-context-menu-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image, Text, View, XStack, YStack } from "tamagui";

import type { Download } from "~/contexts/DownloadManagerContext";
import { useDownloadManager } from "~/contexts/DownloadManagerContext";
import { MWProgress } from "./ui/Progress";

export interface DownloadItemProps {
  item: Download;
  onPress: (localPath?: string) => void;
}

enum ContextMenuActions {
  Cancel = "Cancel",
  Remove = "Remove",
}

const statusToTextMap: Record<Download["status"], string> = {
  downloading: "Downloading",
  finished: "Finished",
  error: "Error",
  merging: "Merging",
  cancelled: "Cancelled",
  importing: "Importing",
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function DownloadItem(props: DownloadItemProps) {
  const percentage = props.item.progress * 100;
  const formattedFileSize = formatBytes(props.item.fileSize);
  const formattedDownloaded = formatBytes(props.item.downloaded);
  const { removeDownload, cancelDownload } = useDownloadManager();

  const contextMenuActions = [
    {
      title: ContextMenuActions.Remove,
    },
    ...(props.item.status !== "finished"
      ? [{ title: ContextMenuActions.Cancel }]
      : []),
  ];

  const onContextMenuPress = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
  ) => {
    if (e.nativeEvent.name === ContextMenuActions.Cancel) {
      void cancelDownload(props.item.id);
    } else if (e.nativeEvent.name === ContextMenuActions.Remove) {
      removeDownload(props.item.id);
    }
  };

  return (
    <ContextMenu
      actions={contextMenuActions}
      onPress={onContextMenuPress}
      previewBackgroundColor="transparent"
    >
      <TouchableOpacity
        onPress={() => props.onPress(props.item.localPath)}
        onLongPress={() => {
          return;
        }}
        activeOpacity={0.7}
      >
        <XStack gap="$4" alignItems="center">
          <View
            aspectRatio={9 / 14}
            width={70}
            maxHeight={180}
            overflow="hidden"
            borderRadius="$2"
          >
            <Image
              source={{
                uri: "https://image.tmdb.org/t/p/original//or06FN3Dka5tukK1e9sl16pB3iy.jpg",
              }}
              width="100%"
              height="100%"
            />
          </View>
          <YStack gap="$2">
            <XStack gap="$6" maxWidth="65%">
              <Text fontWeight="$bold" ellipse flexGrow={1}>
                {props.item.media.title}
              </Text>
              {props.item.type !== "hls" && (
                <Text fontSize="$2" color="gray">
                  {props.item.speed.toFixed(2)} MB/s
                </Text>
              )}
            </XStack>
            <MWProgress value={percentage} height={10} maxWidth="100%">
              <MWProgress.Indicator />
            </MWProgress>
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize="$2" color="gray">
                {props.item.type === "hls"
                  ? `${percentage.toFixed()}% - ${props.item.downloaded} of ${props.item.fileSize} segments`
                  : `${percentage.toFixed()}% - ${formattedDownloaded} of ${formattedFileSize}`}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text fontSize="$2" color="gray">
                  {statusToTextMap[props.item.status]}
                </Text>
              </View>
            </XStack>
          </YStack>
        </XStack>
      </TouchableOpacity>
    </ContextMenu>
  );
}
