import React from "react";
import { Progress, Text, View } from "tamagui";

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
    <View marginBottom={16} borderRadius={8} borderColor="white" padding={16}>
      <Text marginBottom={4} fontSize={16}>
        {filename}
      </Text>
      <Progress value={60} height={10} backgroundColor="$progressBackground">
        <Progress.Indicator
          animation="bounce"
          backgroundColor="$progressFilled"
        />
      </Progress>
      <View
        marginTop={8}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize={12} color="gray">
          {percentage}% - {formattedDownloaded} of {formattedFileSize}
        </Text>
        <Text fontSize={12} color="gray">
          {speed} MB/s
        </Text>
      </View>
    </View>
  );
};
