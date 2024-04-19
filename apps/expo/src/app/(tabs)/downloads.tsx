import React from "react";
import { Alert, Platform } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isDevelopmentProvisioningProfile } from "modules/check-ios-certificate";
import { ScrollView, useTheme, YStack } from "tamagui";

import type { ScrapeMedia } from "@movie-web/provider-utils";

import { DownloadItem, ShowDownloadItem } from "~/components/DownloadItem";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { useDownloadManager } from "~/hooks/useDownloadManager";
import { PlayerStatus } from "~/stores/player/slices/interface";
import { usePlayerStore } from "~/stores/player/store";
import { useDownloadHistoryStore } from "~/stores/settings";

const exampleMovieMedia: ScrapeMedia = {
  type: "movie",
  title: "Avengers: Endgame",
  releaseYear: 2019,
  imdbId: "tt4154796",
  tmdbId: "299534",
};

const getExampleShowMedia = (seasonNumber: number, episodeNumber: number) =>
  ({
    type: "show",
    title: "Loki",
    releaseYear: 2021,
    imdbId: "tt9140554",
    tmdbId: "84958",
    season: {
      number: seasonNumber,
      tmdbId: seasonNumber.toString(),
    },
    episode: {
      number: episodeNumber,
      tmdbId: episodeNumber.toString(),
    },
  }) as const;

const TestDownloadButton = (props: {
  media: ScrapeMedia;
  type: "hls" | "mp4";
  url: string;
}) => {
  const { startDownload } = useDownloadManager();
  const theme = useTheme();
  return (
    <MWButton
      type="secondary"
      backgroundColor="$sheetItemBackground"
      icon={
        <MaterialCommunityIcons
          name="download"
          size={24}
          color={theme.silver300.val}
        />
      }
      onPress={async () => {
        await startDownload(props.url, props.type, props.media).catch(
          console.error,
        );
      }}
    >
      test download
      {props.type === "hls" ? " (hls)" : "(mp4)"}{" "}
      {props.media.type === "show" ? "show" : "movie"}
    </MWButton>
  );
};

const DownloadsScreen: React.FC = () => {
  const downloads = useDownloadHistoryStore((state) => state.downloads);
  const resetVideo = usePlayerStore((state) => state.resetVideo);
  const setVideoSrc = usePlayerStore((state) => state.setVideoSrc);
  const setIsLocalFile = usePlayerStore((state) => state.setIsLocalFile);
  const setPlayerStatus = usePlayerStore((state) => state.setPlayerStatus);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "ios" && !isDevelopmentProvisioningProfile()) {
        Alert.alert(
          "Production Certificate",
          "Download functionality is not available when the application is signed with a distribution certificate.",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        );
      }
    }, [router]),
  );

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
    <ScreenLayout>
      <YStack gap={2} style={{ padding: 10 }}>
        <TestDownloadButton
          media={exampleMovieMedia}
          type="mp4"
          url="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
        />
        <TestDownloadButton
          media={getExampleShowMedia(1, 1)}
          type="mp4"
          url="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
        />
        <TestDownloadButton
          media={getExampleShowMedia(1, 2)}
          type="mp4"
          url="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
        />
        <TestDownloadButton
          media={getExampleShowMedia(1, 1)}
          type="hls"
          url="http://sample.vodobox.com/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
        />
      </YStack>
      <ScrollView
        contentContainerStyle={{
          gap: "$4",
        }}
      >
        {downloads.map((download) => {
          if (download.downloads.length === 0) return null;
          if (download.media.type === "movie") {
            return (
              <DownloadItem
                key={download.media.tmdbId}
                item={download.downloads[0]!}
                onPress={() => handlePress(download.downloads[0]!.localPath)}
              />
            );
          } else {
            return (
              <ShowDownloadItem
                key={download.media.tmdbId}
                download={download}
              />
            );
          }
        })}
      </ScrollView>
    </ScreenLayout>
  );
};

export default DownloadsScreen;
