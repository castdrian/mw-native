import type { NativeSyntheticEvent } from "react-native";
import type { ContextMenuOnPressNativeEvent } from "react-native-context-menu-view";
import React from "react";
import ContextMenu from "react-native-context-menu-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Image, Text, View, XStack, YStack } from "tamagui";

import type { Download, DownloadContent } from "~/hooks/useDownloadManager";
import { useDownloadManager } from "~/hooks/useDownloadManager";
import { mapSeasonAndEpisodeNumberToText } from "./player/utils";
import { MWProgress } from "./ui/Progress";
import { FlashingText } from "./ui/Text";

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
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
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
      void cancelDownload(props.item);
    } else if (e.nativeEvent.name === ContextMenuActions.Remove) {
      removeDownload(props.item);
    }
  };

  const isInProgress = !(
    props.item.status === "finished" ||
    props.item.status === "error" ||
    props.item.status === "cancelled"
  );

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
          <YStack gap="$2" flex={1}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text
                fontWeight="$bold"
                numberOfLines={1}
                ellipsizeMode="tail"
                flex={1}
              >
                {props.item.media.type === "show" &&
                  `${mapSeasonAndEpisodeNumberToText(
                    props.item.media.season.number,
                    props.item.media.episode.number,
                  )} `}
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
                <FlashingText
                  isInProgress={isInProgress}
                  style={{
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  {statusToTextMap[props.item.status]}
                </FlashingText>
              </View>
            </XStack>
          </YStack>
        </XStack>
      </TouchableOpacity>
    </ContextMenu>
  );
}

export function ShowDownloadItem({ download }: { download: DownloadContent }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(downloads)/[tmdbId]",
          params: { tmdbId: download.media.tmdbId },
        })
      }
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
          <YStack gap="$1">
            <Text fontWeight="$bold" ellipse flexGrow={1} fontSize="$5">
              {download.media.title}
            </Text>
            <Text fontSize="$2">
              {download.downloads.length} Episode
              {download.downloads.length > 1 ? "s" : ""} |{" "}
              {formatBytes(
                download.downloads.reduce(
                  (acc, curr) => acc + curr.fileSize,
                  0,
                ),
              )}
            </Text>
          </YStack>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
}
