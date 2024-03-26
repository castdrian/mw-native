import type { Asset } from "expo-media-library";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme, YStack } from "tamagui";

import { DownloadItem } from "~/components/DownloadItem";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { useDownloadManager } from "~/hooks/DownloadManagerContext";
import { usePlayerStore } from "~/stores/player/store";

const DownloadsScreen: React.FC = () => {
  const { startDownload, downloads, removeDownload } = useDownloadManager();
  const resetVideo = usePlayerStore((state) => state.resetVideo);
  const setAsset = usePlayerStore((state) => state.setAsset);
  const router = useRouter();
  const theme = useTheme();

  const handlePress = (asset?: Asset) => {
    if (!asset) return;
    resetVideo();
    setAsset(asset);
    router.push({
      pathname: "/videoPlayer",
    });
  };

  return (
    <ScreenLayout>
      <YStack space={2} style={{ padding: 10 }}>
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
            onLongPress={removeDownload}
          />
        ))}
      </ScrollView>
    </ScreenLayout>
  );
};

export default DownloadsScreen;
