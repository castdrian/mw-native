import React from "react";
import { Text, View } from "react-native";
import { Bar as ProgressBar } from "react-native-progress";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

export interface DownloadItemProps {
  filename: string;
  progress: number;
  speed: number;
  fileSize: number;
  downloaded: number;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const DownloadItem: React.FC<DownloadItemProps> = ({
  filename,
  progress,
  speed,
  fileSize,
  downloaded,
}) => {
  const percentage = (progress * 100).toFixed(0);
  const formattedFileSize = formatBytes(fileSize);
  const formattedDownloaded = formatBytes(downloaded);

  return (
    <View className="mb-4 rounded-lg border border-white p-4">
      <Text className="mb-2 text-lg text-white">{filename}</Text>
      <ProgressBar
        progress={progress}
        width={null}
        color={defaultTheme.extend.colors.download.progressFilled}
        unfilledColor={defaultTheme.extend.colors.download.progress}
        borderWidth={0}
        height={10}
        borderRadius={5}
      />
      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-sm text-gray-600">
          {percentage}% - {formattedDownloaded} of {formattedFileSize}
        </Text>
        <Text className="text-sm text-gray-600">{speed} MB/s</Text>
      </View>
    </View>
  );
};
