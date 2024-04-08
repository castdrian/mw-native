import type { DownloadTask } from "@kesha-antonov/react-native-background-downloader";
import type { Asset } from "expo-media-library";
import { useCallback, useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Network from "expo-network";
import { NetworkStateType } from "expo-network";
import {
  checkForExistingDownloads,
  completeHandler,
  download,
  setConfig,
} from "@kesha-antonov/react-native-background-downloader";
import VideoManager from "@salihgun/react-native-video-processor";

import type { ScrapeMedia } from "@movie-web/provider-utils";
import { extractSegmentsFromHLS } from "@movie-web/provider-utils";

import { useToast } from "~/hooks/useToast";
import {
  useDownloadHistoryStore,
  useNetworkSettingsStore,
} from "~/stores/settings";

interface DownloadProgress {
  bytesDownloaded: number;
  bytesTotal: number;
}

export interface Download {
  id: string;
  progress: number;
  speed: number;
  fileSize: number;
  downloaded: number;
  url: string;
  type: "mp4" | "hls";
  status:
    | "downloading"
    | "finished"
    | "error"
    | "merging"
    | "cancelled"
    | "importing";
  localPath?: string;
  media: ScrapeMedia;
  downloadTask?: DownloadTask;
}

export interface DownloadContent {
  media: Pick<ScrapeMedia, "title" | "releaseYear" | "type" | "tmdbId">;
  downloads: Download[];
}

// @ts-expect-error - types are not up to date
setConfig({
  isLogsEnabled: false,
  progressInterval: 250,
});

export const useDownloadManager = () => {
  const cancellationFlags = useState<Record<string, boolean>>({})[0];

  const downloads = useDownloadHistoryStore((state) => state.downloads);
  const setDownloads = useDownloadHistoryStore((state) => state.setDownloads);
  const { showToast } = useToast();

  const setCancellationFlag = (downloadId: string, flag: boolean): void => {
    cancellationFlags[downloadId] = flag;
  };

  const getCancellationFlag = useCallback(
    (downloadId: string): boolean => {
      return cancellationFlags[downloadId] ?? false;
    },
    [cancellationFlags],
  );

  const cancelDownload = (download: Download) => {
    setCancellationFlag(download.id, true);
    if (download?.downloadTask) {
      download.downloadTask.stop();
    }
    showToast("Download cancelled", {
      burntOptions: { preset: "done" },
    });
  };

  const updateDownloadItem = useCallback(
    (downloadId: string, download: Partial<Download>) => {
      setDownloads((prev) => {
        const updatedDownloads = prev.map((content) => {
          const updatedDownloadsArray = content.downloads.map((d) =>
            d.id === downloadId
              ? {
                  ...d,
                  ...download,
                }
              : d,
          );

          return {
            ...content,
            downloads: updatedDownloadsArray,
          };
        });

        return updatedDownloads;
      });
    },
    [setDownloads],
  );

  const removeDownload = useCallback(
    (download: Download) => {
      if (download.media.type === "movie") {
        setDownloads((prev) =>
          prev.filter((d) => d.media.tmdbId !== download.media.tmdbId),
        );
        return;
      } else if (download.media.type === "show") {
        setDownloads((prev) => {
          const existingDownload = prev.find(
            (d) => d.media.tmdbId === download.media.tmdbId,
          );
          if (existingDownload?.downloads.length === 1) {
            return prev.filter((d) => d.media.tmdbId !== download.media.tmdbId);
          } else {
            return prev.map((content) => {
              return {
                ...content,
                downloads: content.downloads.filter(
                  (d) => d.id !== download.id,
                ),
              };
            });
          }
        });
      }
    },
    [setDownloads],
  );

  const saveFileToMediaLibraryAndDeleteOriginal = useCallback(
    async (fileUri: string, download: Download): Promise<Asset | void> => {
      console.log(
        "Saving file to media library and deleting original",
        fileUri,
      );
      try {
        updateDownloadItem(download.id, { status: "importing" });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const { localUri } = await MediaLibrary.getAssetInfoAsync(asset);
        await FileSystem.deleteAsync(fileUri);

        updateDownloadItem(download.id, {
          status: "finished",
          localPath: localUri,
        });
        console.log("File saved to media library and original deleted");
        showToast("Download finished", {
          burntOptions: { preset: "done" },
        });
        return asset;
      } catch (error) {
        console.error("Error saving file to media library:", error);
        showToast("Download failed", {
          burntOptions: { preset: "error" },
        });
      }
    },
    [updateDownloadItem, showToast],
  );

  const downloadMP4 = useCallback(
    (
      url: string,
      downloadItem: Download,
      headers: Record<string, string>,
    ): Promise<Asset> => {
      return new Promise<Asset>((resolve, reject) => {
        let lastBytesWritten = 0;
        let lastTimestamp = Date.now();

        const updateProgress = (downloadProgress: DownloadProgress) => {
          const currentTime = Date.now();
          const timeElapsed = (currentTime - lastTimestamp) / 1000;

          if (timeElapsed === 0) return;

          const newBytes = downloadProgress.bytesDownloaded - lastBytesWritten;
          const speed = newBytes / timeElapsed / 1024 / 1024;
          const progress =
            downloadProgress.bytesDownloaded / downloadProgress.bytesTotal;

          updateDownloadItem(downloadItem.id, {
            progress,
            speed,
            fileSize: downloadProgress.bytesTotal,
            downloaded: downloadProgress.bytesDownloaded,
          });

          lastBytesWritten = downloadProgress.bytesDownloaded;
          lastTimestamp = currentTime;
        };

        const fileUri =
          FileSystem.cacheDirectory + "movie-web"
            ? FileSystem.cacheDirectory + "movie-web" + url.split("/").pop()
            : null;
        if (!fileUri) {
          console.error("Cache directory is unavailable");
          reject(new Error("Cache directory is unavailable"));
          return;
        }

        const downloadTask = download({
          id: downloadItem.id,
          url,
          destination: fileUri,
          headers,
          isNotificationVisible: true,
        })
          .begin(() => {
            updateDownloadItem(downloadItem.id, { downloadTask });
          })
          .progress(({ bytesDownloaded, bytesTotal }) => {
            updateProgress({ bytesDownloaded, bytesTotal });
          })
          .done(() => {
            saveFileToMediaLibraryAndDeleteOriginal(fileUri, downloadItem)
              .then((asset) => {
                if (asset) {
                  resolve(asset);
                } else {
                  reject(new Error("No asset returned"));
                }
              })
              .catch((error) => reject(error));
          })
          .error(({ error, errorCode }) => {
            console.error(`Download error: ${errorCode} - ${error}`);
            reject(new Error(`Download error: ${errorCode} - ${error}`));
          });
      });
    },
    [saveFileToMediaLibraryAndDeleteOriginal, updateDownloadItem],
  );

  const cleanupDownload = useCallback(
    async (segmentDir: string, download: Download) => {
      await FileSystem.deleteAsync(segmentDir, { idempotent: true });
      removeDownload(download);
    },
    [removeDownload],
  );

  const downloadHLS = useCallback(
    async (
      url: string,
      download: Download,
      headers: Record<string, string>,
    ) => {
      const segments = await extractSegmentsFromHLS(url, headers);

      if (!segments || segments.length === 0) {
        return removeDownload(download);
      }

      const totalSegments = segments.length;
      let segmentsDownloaded = 0;

      const segmentDir = FileSystem.cacheDirectory + "movie-web/segments/";
      await ensureDirExists(segmentDir);

      const updateProgress = () => {
        const progress = segmentsDownloaded / totalSegments;
        updateDownloadItem(download.id, {
          progress,
          downloaded: segmentsDownloaded,
          fileSize: totalSegments,
        });
      };

      const localSegmentPaths = [];

      for (const [index, segment] of segments.entries()) {
        if (getCancellationFlag(download.id)) {
          await cleanupDownload(segmentDir, download);
          return;
        }

        const segmentFile = `${segmentDir}${index}.ts`;
        localSegmentPaths.push(segmentFile);

        try {
          await downloadSegment(download.id, segment, segmentFile, headers);

          if (getCancellationFlag(download.id)) {
            await cleanupDownload(segmentDir, download);
            return;
          }

          segmentsDownloaded++;
          updateProgress();
        } catch (e) {
          console.error(e);
          if (getCancellationFlag(download.id)) {
            await cleanupDownload(segmentDir, download);
            return;
          }
        }
      }

      if (getCancellationFlag(download.id)) {
        return removeDownload(download);
      }

      updateDownloadItem(download.id, { status: "merging" });
      const uri = await VideoManager.mergeVideos(
        localSegmentPaths,
        `${FileSystem.cacheDirectory}movie-web/output.mp4`,
      );
      const asset = await saveFileToMediaLibraryAndDeleteOriginal(
        uri,
        download,
      );
      return asset;
    },
    [
      cleanupDownload,
      getCancellationFlag,
      removeDownload,
      saveFileToMediaLibraryAndDeleteOriginal,
      updateDownloadItem,
    ],
  );

  const startDownload = useCallback(
    async (
      url: string,
      type: "mp4" | "hls",
      media: ScrapeMedia,
      headers?: Record<string, string>,
    ): Promise<Asset | void> => {
      const { allowMobileData } = useNetworkSettingsStore.getState();

      const { type: networkType } = await Network.getNetworkStateAsync();

      if (networkType === NetworkStateType.CELLULAR && !allowMobileData) {
        showToast("Mobile data downloads are disabled", {
          burntOptions: { preset: "error" },
        });
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== MediaLibrary.PermissionStatus.GRANTED) {
        showToast("Permission denied", {
          burntOptions: { preset: "error" },
        });
        return;
      }

      const existingDownload = downloads.find(
        (d) => d.media.tmdbId === media.tmdbId,
      );

      if (existingDownload && media.type === "movie") {
        showToast("Download already exists", {
          burntOptions: { preset: "error" },
        });
        return;
      }

      if (existingDownload && media.type === "show") {
        const existingEpisode = existingDownload.downloads.find(
          (d) =>
            d.media.type === "show" &&
            d.media.episode.tmdbId === media.episode.tmdbId,
        );

        if (existingEpisode) {
          showToast("Download already exists", {
            burntOptions: { preset: "error" },
          });
          return;
        }
      }
      showToast("Download started", {
        burntOptions: { preset: "none" },
      });

      const newDownload: Download = {
        id: `download-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        progress: 0,
        speed: 0,
        fileSize: 0,
        downloaded: 0,
        type,
        url,
        status: "downloading",
        media,
      };

      if (existingDownload) {
        existingDownload.downloads.push(newDownload);
        setDownloads((prev) => {
          return prev.map((d) =>
            d.media.tmdbId === media.tmdbId ? existingDownload : d,
          );
        });
      } else {
        setDownloads((prev) => {
          return [...prev, { media, downloads: [newDownload] }];
        });
      }

      if (type === "mp4") {
        const asset = await downloadMP4(url, newDownload, headers ?? {});
        return asset;
      } else if (type === "hls") {
        const asset = await downloadHLS(url, newDownload, headers ?? {});
        return asset;
      }
    },
    [downloadHLS, downloadMP4, downloads, setDownloads, showToast],
  );

  const downloadSegment = async (
    downloadId: string,
    segmentUrl: string,
    segmentFile: string,
    headers: Record<string, string>,
  ) => {
    return new Promise<void>((resolve, reject) => {
      const task = download({
        id: `${downloadId}-${segmentUrl.split("/").pop()}`,
        url: segmentUrl,
        destination: segmentFile,
        headers: headers,
      });

      task
        .done(() => {
          resolve();
        })
        .error((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  async function ensureDirExists(dir: string) {
    await FileSystem.deleteAsync(dir, { idempotent: true });
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  useEffect(() => {
    const checkRunningTasks = async () => {
      const existingTasks = await checkForExistingDownloads();
      existingTasks.forEach((task) => {
        task
          .progress(({ bytesDownloaded, bytesTotal }) => {
            const progress = bytesDownloaded / bytesTotal;
            updateDownloadItem(task.id, { progress });
          })
          .done(() => {
            completeHandler(task.id);
          })
          .error(({ error, errorCode }) => {
            console.error(`Download error: ${errorCode} - ${error}`);
          });
      });
    };

    void checkRunningTasks();
  }, [updateDownloadItem]);

  return {
    startDownload,
    removeDownload,
    cancelDownload,
  };
};
