import { ScrollView } from "react-native-gesture-handler";

import type { DownloadItemProps } from "~/components/DownloadItem";
import { DownloadItem } from "~/components/DownloadItem";
import ScreenLayout from "~/components/layout/ScreenLayout";

export default function DownloadsScreen() {
  const downloads: DownloadItemProps[] = [
    {
      filename: "episode.mp4",
      progress: 0.3,
      speed: 1.2,
      fileSize: 500 * 1024 * 1024,
      downloaded: 150 * 1024 * 1024,
    },
    {
      filename: "episode.m3u8",
      progress: 0.7,
      speed: 0.8,
      fileSize: 200 * 1024 * 1024,
      downloaded: 140 * 1024 * 1024,
    },
  ];

  return (
    <ScreenLayout title="Downloads">
      <ScrollView>
        {downloads.map((item, index) => (
          <DownloadItem key={index} {...item} />
        ))}
      </ScrollView>
    </ScreenLayout>
  );
}
