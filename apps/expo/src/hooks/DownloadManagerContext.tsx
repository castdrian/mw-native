import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

interface DownloadItem {
  filename: string;
  progress: number;
  speed: number;
  fileSize: number;
  downloaded: number;
  url: string;
  type: "mp4" | "hls";
  isFinished: boolean;
}

interface DownloadManagerContextType {
  downloads: DownloadItem[];
  startDownload: (url: string, type: "mp4" | "hls") => Promise<void>;
}

const DownloadManagerContext = createContext<
  DownloadManagerContextType | undefined
>(undefined);

export const useDownloadManager = () => {
  const context = useContext(DownloadManagerContext);
  if (!context) {
    throw new Error(
      "useDownloadManager must be used within a DownloadManagerProvider",
    );
  }
  return context;
};

export const DownloadManagerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const startDownload = async (url: string, type: "mp4" | "hls") => {
    const newDownload: DownloadItem = {
      filename: url.split("/").pop() ?? "unknown",
      progress: 0,
      speed: 0,
      fileSize: 0,
      downloaded: 0,
      type,
      url,
      isFinished: false,
    };

	setDownloads((currentDownloads) => [newDownload, ...currentDownloads]);

    if (type === "mp4") {
      await downloadMP4(url);
    } else if (type === "hls") {
      // HLS stuff later
    }
  };

  const downloadMP4 = async (url: string) => {
    let lastBytesWritten = 0;
    let lastTimestamp = Date.now();

    const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - lastTimestamp) / 1000;

      if (timeElapsed === 0) return;

      const bytesWritten = downloadProgress.totalBytesWritten;
      const newBytes = bytesWritten - lastBytesWritten;
      const speed = newBytes / timeElapsed / 1024;

      const progress =
        bytesWritten / downloadProgress.totalBytesExpectedToWrite;

      setDownloads((currentDownloads) =>
        currentDownloads.map((item) =>
          item.url === url
            ? {
                ...item,
                progress,
                speed,
                fileSize: downloadProgress.totalBytesExpectedToWrite,
              }
            : item,
        ),
      );

      lastBytesWritten = bytesWritten;
      lastTimestamp = currentTime;
    };

    const fileUri = FileSystem.documentDirectory
      ? FileSystem.documentDirectory + url.split("/").pop()
      : null;
    if (!fileUri) {
      console.error("Document directory is unavailable");
      return;
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      callback,
    );

    try {
      const result = await downloadResumable.downloadAsync();
      if (result) {
        console.log("Finished downloading to ", result.uri);
        await saveFileToMediaLibraryAndDeleteOriginal(result.uri);

        setDownloads((currentDownloads) =>
          currentDownloads.map((item) =>
            item.url === url
              ? {
                  ...item,
                  progress: 1,
                  speed: 0,
                  downloaded: item.fileSize,
                  isFinished: true,
                }
              : item,
          ),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveFileToMediaLibraryAndDeleteOriginal = async (fileUri: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== MediaLibrary.PermissionStatus.GRANTED) {
        throw new Error("MediaLibrary permission not granted");
      }

      await MediaLibrary.saveToLibraryAsync(fileUri);
      await FileSystem.deleteAsync(fileUri);

      console.log("File saved to media library and original deleted");
    } catch (error) {
      console.error("Error saving file to media library:", error);
    }
  };

  return (
    <DownloadManagerContext.Provider value={{ downloads, startDownload }}>
      {children}
    </DownloadManagerContext.Provider>
  );
};
