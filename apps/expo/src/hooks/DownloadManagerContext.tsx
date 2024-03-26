import type { Asset } from "expo-media-library";
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import VideoManager from "@salihgun/react-native-video-processor";
import { useToastController } from "@tamagui/toast";

import { extractSegmentsFromHLS } from "@movie-web/provider-utils";

import { useDownloadHistoryStore } from "~/stores/settings";

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
  isHLS?: boolean;
  downloadResumable?: FileSystem.DownloadResumable;
}

interface DownloadManagerContextType {
  downloads: DownloadItem[];
  startDownload: (url: string, type: "mp4" | "hls") => Promise<Asset | void>;
  removeDownload: (id: string) => void;
  cancelDownload: (id: string) => Promise<void>;
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
    const initializeDownloads = () => {
      const { downloads: storedDownloads } = useDownloadHistoryStore.getState();
      if (storedDownloads) {
        setDownloads(storedDownloads);
      }
    };

    void initializeDownloads();
  }, []);

  useEffect(() => {
    useDownloadHistoryStore.setState({ downloads });
  }, [downloads]);

  const cancellationFlags: Record<string, boolean> = {};

  const setCancellationFlag = (downloadId: string, flag: boolean): void => {
    cancellationFlags[downloadId] = flag;
  };

  const getCancellationFlag = (downloadId: string): boolean => {
    return cancellationFlags[downloadId] ?? false;
  };

  const cancelDownload = async (downloadId: string): Promise<void> => {
    setCancellationFlag(downloadId, true);
    const downloadItem = downloads.find((d) => d.id === downloadId);
    if (downloadItem?.downloadResumable) {
      await downloadItem.downloadResumable.cancelAsync();
    }
  };

  const startDownload = async (
    url: string,
    type: "mp4" | "hls",
    headers?: Record<string, string>,
  ): Promise<Asset | void> => {
    toastController.show("Download started", {
      burntOptions: { preset: "none" },
      native: true,
      duration: 500,
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
      isHLS: type === "hls",
    };

    setDownloads((currentDownloads) => [newDownload, ...currentDownloads]);

    if (type === "mp4") {
      const asset = await downloadMP4(url, newDownload.id, headers ?? {});
      return asset;
    } else if (type === "hls") {
      const asset = await downloadHLS(url, newDownload.id, headers ?? {});
      return asset;
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

    const fileUri = FileSystem.cacheDirectory
      ? FileSystem.cacheDirectory + url.split("/").pop()
      : null;
    if (!fileUri) {
      console.error("Cache directory is unavailable");
      return;
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      { headers },
      callback,
    );
    updateDownloadItem(downloadId, { downloadResumable });

    try {
      const result = await downloadResumable.downloadAsync();
      if (result) {
        console.log("Finished downloading to ", result.uri);
        const asset = await saveFileToMediaLibraryAndDeleteOriginal(
          result.uri,
          downloadId,
        );
        return asset;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const downloadHLS = async (
    url: string,
    downloadId: string,
    headers: Record<string, string>,
  ) => {
    const segments = await extractSegmentsFromHLS(url, headers);

    if (!segments || segments.length === 0) {
      return removeDownload(downloadId);
    }

    const totalSegments = segments.length;
    let segmentsDownloaded = 0;

    const segmentDir = FileSystem.cacheDirectory + "segments/";
    await ensureDirExists(segmentDir);

    const updateProgress = () => {
      const progress = segmentsDownloaded / totalSegments;
      updateDownloadItem(downloadId, {
        progress,
        downloaded: segmentsDownloaded,
        fileSize: totalSegments,
      });
    };

    const localSegmentPaths = [];

    for (const [index, segment] of segments.entries()) {
      if (getCancellationFlag(downloadId)) {
        await FileSystem.deleteAsync(segmentDir, { idempotent: true });
        break;
      }

      const segmentFile = `${segmentDir}${index}.ts`;
      localSegmentPaths.push(segmentFile);
      const downloadResumable = FileSystem.createDownloadResumable(
        segment,
        segmentFile,
        { headers },
      );

      try {
        await downloadResumable.downloadAsync();
        segmentsDownloaded++;
        updateProgress();
      } catch (e) {
        console.error(e);
        if (getCancellationFlag(downloadId)) {
          break;
        }
      }
    }

    if (getCancellationFlag(downloadId)) {
      return removeDownload(downloadId);
    }

    updateDownloadItem(downloadId, { statusText: "Merging" });
    const uri = await VideoManager.mergeVideos(
      localSegmentPaths,
      `${FileSystem.cacheDirectory}output.mp4`,
    );
    const asset = await saveFileToMediaLibraryAndDeleteOriginal(
      uri,
      downloadId,
    );
    return asset;
  };

  async function ensureDirExists(dir: string) {
    await FileSystem.deleteAsync(dir, { idempotent: true });
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  const saveFileToMediaLibraryAndDeleteOriginal = async (
    fileUri: string,
    downloadId: string,
  ): Promise<Asset | void> => {
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
        duration: 500,
      });
      return asset;
    } catch (error) {
      console.error("Error saving file to media library:", error);
      toastController.show("Download failed", {
        burntOptions: { preset: "error" },
        native: true,
        duration: 500,
      });
    }
  };

  const removeDownload = (id: string) => {
    const updatedDownloads = downloads.filter((download) => download.id !== id);
    setDownloads(updatedDownloads);
    useDownloadHistoryStore.setState({ downloads: updatedDownloads });
  };

  return (
    <DownloadManagerContext.Provider
      value={{ downloads, startDownload, removeDownload, cancelDownload }}
    >
      {children}
    </DownloadManagerContext.Provider>
  );
};
