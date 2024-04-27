import { useEffect, useMemo } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { YStack } from "tamagui";

import { DownloadItem } from "~/components/DownloadItem";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { PlayerStatus } from "~/stores/player/slices/interface";
import { usePlayerStore } from "~/stores/player/store";
import { useDownloadHistoryStore } from "~/stores/settings";

export default function Page() {
  const { tmdbId } = useLocalSearchParams();
  const allDownloads = useDownloadHistoryStore((state) => state.downloads);
  const resetVideo = usePlayerStore((state) => state.resetVideo);
  const setVideoSrc = usePlayerStore((state) => state.setVideoSrc);
  const setIsLocalFile = usePlayerStore((state) => state.setIsLocalFile);
  const setPlayerStatus = usePlayerStore((state) => state.setPlayerStatus);
  const router = useRouter();

  const download = useMemo(() => {
    return allDownloads.find((download) => download.media.tmdbId === tmdbId);
  }, [allDownloads, tmdbId]);

  useEffect(() => {
    if (!download) router.back();
  }, [download, router]);

  const handlePress = (localPath?: string) => {
    if (!localPath) return;
    resetVideo();
    setIsLocalFile(true);
    setPlayerStatus(PlayerStatus.READY);
    setVideoSrc({
      uri: localPath,
    });
    router.push({
      pathname: "/videoPlayer",
    });
  };

  return (
    <ScreenLayout showHeader={false}>
      <Stack.Screen
        options={{
          title: download?.media.title ?? "Downloads",
        }}
      />
      <YStack gap="$4">
        {download?.downloads.map((download) => {
          return (
            <DownloadItem
              key={
                download.media.type === "show"
                  ? download.media.episode.tmdbId
                  : download.media.tmdbId
              }
              item={download}
              onPress={() => handlePress(download.localPath)}
            />
          );
        })}
      </YStack>
    </ScreenLayout>
  );
}
