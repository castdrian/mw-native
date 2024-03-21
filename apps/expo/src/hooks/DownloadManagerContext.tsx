import type { Asset } from "expo-media-library";
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useToastController } from "@tamagui/toast";

import { loadDownloadHistory, saveDownloadHistory } from "~/settings";

export interface DownloadItem {
  id: string;
  filename: string;
  progress: number;
  speed: number;
  fileSize: number;
  downloaded: number;
  url: string;
  type: "mp4" | "hls";
  isFinished: boolean;
  statusText?: string;
  asset?: Asset;
}

interface DownloadManagerContextType {
  downloads: DownloadItem[];
  startDownload: (url: string, type: "mp4" | "hls") => Promise<void>;
  removeDownload: (id: string) => void;
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
  const toastController = useToastController();

  useEffect(() => {
    const initializeDownloads = async () => {
      const storedDownloads = await loadDownloadHistory();
      if (storedDownloads) {
        setDownloads(storedDownloads);
      }
    };

    void initializeDownloads();
  }, []);

  useEffect(() => {
    void saveDownloadHistory(downloads.slice(0, 10));
  }, [downloads]);

  const startDownload = async (
    url: string,
    type: "mp4" | "hls",
    headers?: Record<string, string>,
  ) => {
    toastController.show("Download started", {
      burntOptions: { preset: "none" },
      native: true,
    });

    const newDownload: DownloadItem = {
      id: `download-${Date.now()}-${Math.random().toString(16).slice(2)}`,
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
      await downloadMP4(url, newDownload.id, headers ?? {});
    } else if (type === "hls") {
      // HLS stuff later
    }
  };

  const updateDownloadItem = (id: string, updates: Partial<DownloadItem>) => {
    setDownloads((currentDownloads) =>
      currentDownloads.map((download) =>
        download.id === id ? { ...download, ...updates } : download,
      ),
    );
  };

  const downloadMP4 = async (
    url: string,
    downloadId: string,
    headers: Record<string, string>,
  ) => {
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

      updateDownloadItem(downloadId, {
        progress,
        speed,
        fileSize: downloadProgress.totalBytesExpectedToWrite,
        downloaded: bytesWritten,
      });

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
      { headers },
      callback,
    );

    try {
      const result = await downloadResumable.downloadAsync();
      if (result) {
        console.log("Finished downloading to ", result.uri);
        await saveFileToMediaLibraryAndDeleteOriginal(result.uri, downloadId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveFileToMediaLibraryAndDeleteOriginal = async (
    fileUri: string,
    downloadId: string,
  ) => {
    try {
      updateDownloadItem(downloadId, { statusText: "Importing" });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== MediaLibrary.PermissionStatus.GRANTED) {
        throw new Error("MediaLibrary permission not granted");
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await FileSystem.deleteAsync(fileUri);

      updateDownloadItem(downloadId, {
        statusText: undefined,
        asset,
        isFinished: true,
      });
      console.log("File saved to media library and original deleted");
      toastController.show("Download finished", {
        burntOptions: { preset: "done" },
        native: true,
      });
    } catch (error) {
      console.error("Error saving file to media library:", error);
      toastController.show("Download failed", {
        burntOptions: { preset: "error" },
        native: true,
      });
    }
  };

  const removeDownload = (id: string) => {
    const updatedDownloads = downloads.filter((download) => download.id !== id);
    setDownloads(updatedDownloads);
    void saveDownloadHistory(updatedDownloads);
  };

  return (
    <DownloadManagerContext.Provider
      value={{ downloads, startDownload, removeDownload }}
    >
      {children}
    </DownloadManagerContext.Provider>
  );
};
