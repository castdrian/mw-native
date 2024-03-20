import React from "react";
import { ScrollView } from "react-native-gesture-handler";

import { DownloadItem } from "~/components/DownloadItem";
import ScreenLayout from "~/components/layout/ScreenLayout";
import { useDownloadManager } from "~/hooks/DownloadManagerContext";

const DownloadsScreen: React.FC = () => {
  const { downloads } = useDownloadManager();

  return (
    <ScreenLayout title="Downloads">
      <ScrollView>
        {downloads.map((item) => (
          <DownloadItem key={item.id} {...item} />
        ))}
      </ScrollView>
    </ScreenLayout>
  );
};

export default DownloadsScreen;
