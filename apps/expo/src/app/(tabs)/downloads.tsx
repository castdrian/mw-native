import type { Asset } from "expo-media-library";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

import { DownloadItem } from "~/components/DownloadItem";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { useDownloadManager } from "~/hooks/DownloadManagerContext";
import { usePlayerStore } from "~/stores/player/store";

const DownloadsScreen: React.FC = () => {
  const { downloads, removeDownload } = useDownloadManager();
  const resetVideo = usePlayerStore((state) => state.resetVideo);
  const router = useRouter();

  const handlePress = (asset?: Asset) => {
    if (!asset) return;
    resetVideo();
    router.push({
      pathname: "/videoPlayer",
      params: { data: JSON.stringify(asset) },
    });
  };

  return (
    <ScreenLayout title="Downloads">
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
