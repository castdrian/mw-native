import type { Asset } from "expo-media-library";
import React from "react";
import { Alert, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { isDevelopmentProvisioningProfile } from "modules/check-ios-certificate";
import { useTheme, YStack } from "tamagui";



import type { ScrapeMedia } from "@movie-web/provider-utils";



import { DownloadItem } from "~/components/DownloadItem";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { useDownloadManager } from "~/hooks/DownloadManagerContext";
import { usePlayerStore } from "~/stores/player/store";


const DownloadsScreen: React.FC = () => {
  const { startDownload, downloads } = useDownloadManager();
  const resetVideo = usePlayerStore((state) => state.resetVideo);
  const setAsset = usePlayerStore((state) => state.setAsset);
  const router = useRouter();
  const theme = useTheme();

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

  const handlePress = (asset?: Asset) => {
    if (!asset) return;
    resetVideo();
    setAsset(asset);
    router.push({
      pathname: "/videoPlayer",
    });
  };

  const exampleShowMedia: ScrapeMedia = {
    type: "show",
    title: "Example Show Title",
    releaseYear: 2022,
    imdbId: "tt1234567",
    tmdbId: "12345",
    season: {
      number: 1,
      tmdbId: "54321",
    },
    episode: {
      number: 3,
      tmdbId: "98765",
    },
  };

  console.log(isDevelopmentProvisioningProfile());

  return (
    <ScreenLayout>
      <YStack gap={2} style={{ padding: 10 }}>
        <MWButton
          type="secondary"
          backgroundColor="$sheetItemBackground"
          icon={
            <MaterialCommunityIcons
              name="download"
              size={24}
              color={theme.buttonSecondaryText.val}
            />
          }
          onPress={async () => {
            await startDownload(
              "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
              "mp4",
              exampleShowMedia,
            ).catch(console.error);
          }}
        >
          test download (mp4)
        </MWButton>
        <MWButton
          type="secondary"
          backgroundColor="$sheetItemBackground"
          icon={
            <MaterialCommunityIcons
              name="download"
              size={24}
              color={theme.buttonSecondaryText.val}
            />
          }
          onPress={async () => {
            await startDownload(
              "http://sample.vodobox.com/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
              "hls",
              exampleShowMedia,
            ).catch(console.error);
          }}
        >
          test download (hls)
        </MWButton>
      </YStack>
      <ScrollView>
        {downloads.map((item) => (
          <DownloadItem
            key={item.id}
            {...item}
            onPress={() => handlePress(item.asset)}
          />
        ))}
      </ScrollView>
    </ScreenLayout>
  );
};

export default DownloadsScreen;