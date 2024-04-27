import type { StateStorage } from "zustand/middleware";
import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ScrapeMedia } from "@movie-web/provider-utils";

import type { ReactStyleStateSetter } from "..";
import type { ItemData } from "~/components/item/item";
import type { DownloadContent } from "~/hooks/useDownloadManager";
import type { ThemeStoreOption } from "~/stores/theme";

const storage = new MMKV();

const zustandStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

interface ThemeStoreState {
  theme: ThemeStoreOption;
  setTheme: (theme: ThemeStoreOption) => void;
}

export const useThemeSettingsStore = create<
  ThemeStoreState,
  [["zustand/persist", ThemeStoreState]]
>(
  persist(
    (set) => ({
      theme: "main",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-settings",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

interface PlayerStoreState {
  gestureControls: boolean;
  setGestureControls: (enabled: boolean) => void;
  autoPlay: boolean;
  setAutoPlay: (enabled: boolean) => void;
}

export const usePlayerSettingsStore = create<
  PlayerStoreState,
  [["zustand/persist", PlayerStoreState]]
>(
  persist(
    (set) => ({
      gestureControls: Platform.select({
        ios: true,
        android: false,
        default: true,
      }),
      setGestureControls: (enabled) => set({ gestureControls: enabled }),
      autoPlay: true,
      setAutoPlay: (enabled) => set({ autoPlay: enabled }),
    }),
    {
      name: "player-settings",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

interface DownloadHistoryStoreState {
  downloads: DownloadContent[];
  setDownloads: (downloads: ReactStyleStateSetter<DownloadContent[]>) => void;
}

export const useDownloadHistoryStore = create<
  DownloadHistoryStoreState,
  [["zustand/persist", DownloadHistoryStoreState]]
>(
  persist(
    (set) => ({
      downloads: [],
      setDownloads: (newDownloadsOrSetterFn) => {
        set(({ downloads }) => {
          if (Array.isArray(newDownloadsOrSetterFn)) {
            const newArr = newDownloadsOrSetterFn;
            return { downloads: newArr };
          }
          const setterFn = newDownloadsOrSetterFn;
          return {
            downloads: setterFn(downloads),
          };
        });
      },
    }),
    {
      name: "download-history",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

interface BookmarkStoreState {
  bookmarks: ItemData[];
  setBookmarks: (bookmarks: ItemData[]) => void;
  addBookmark: (item: ItemData) => void;
  removeBookmark: (item: ItemData) => void;
  isBookmarked: (item: ItemData) => boolean;
}

export const useBookmarkStore = create<
  BookmarkStoreState,
  [["zustand/persist", BookmarkStoreState]]
>(
  persist(
    (set, get) => ({
      bookmarks: [],
      setBookmarks: (bookmarks) => set({ bookmarks }),
      addBookmark: (item) =>
        set((state) => ({
          bookmarks: [...state.bookmarks, item],
        })),
      removeBookmark: (item: ItemData) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (bookmark) => bookmark.id !== item.id,
          ),
        })),
      isBookmarked: (item) =>
        Boolean(get().bookmarks.find((bookmark) => bookmark.id === item.id)),
    }),
    {
      name: "bookmarks",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export interface WatchHistoryItem {
  item: ItemData;
  media: ScrapeMedia;
  positionMillis: number;
}

interface WatchHistoryStoreState {
  watchHistory: WatchHistoryItem[];
  hasWatchHistoryItem: (item: ItemData) => boolean;
  getWatchHistoryItem: (media: ScrapeMedia) => WatchHistoryItem | undefined;
  setWatchHistory: (watchHistory: WatchHistoryItem[]) => void;
  updateWatchHistory: (
    item: ItemData,
    media: ScrapeMedia,
    positionMillis: number,
  ) => void;
  removeFromWatchHistory: (item: ItemData) => void;
}

export const useWatchHistoryStore = create<
  WatchHistoryStoreState,
  [["zustand/persist", WatchHistoryStoreState]]
>(
  persist(
    (set, get) => ({
      watchHistory: [],
      hasWatchHistoryItem: (item) =>
        Boolean(
          get().watchHistory.find(
            (historyItem) => historyItem.item.id === item.id,
          ),
        ),
      getWatchHistoryItem: (media) =>
        get().watchHistory.find((historyItem) => {
          if (historyItem.media.type === "movie" && media.type === "movie") {
            return historyItem.media.tmdbId === media.tmdbId;
          } else if (
            historyItem.media.type === "show" &&
            media.type === "show"
          ) {
            return (
              historyItem.media.tmdbId === media.tmdbId &&
              historyItem.media.season === media.season &&
              historyItem.media.episode === media.episode
            );
          }
        }),
      setWatchHistory: (watchHistory) => set({ watchHistory }),
      updateWatchHistory: (
        item: ItemData,
        media: ScrapeMedia,
        positionMillis: number,
      ) =>
        set((state) => ({
          watchHistory: [
            ...state.watchHistory.filter(
              (historyItem) => historyItem.item.id !== item.id,
            ),
            {
              item,
              media,
              positionMillis,
            },
          ],
        })),
      removeFromWatchHistory: (item) =>
        set((state) => ({
          watchHistory: state.watchHistory.filter(
            (historyItem) => historyItem.item.id !== item.id,
          ),
        })),
    }),
    {
      name: "watch-history",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export enum DefaultQuality {
  Lowest = "Lowest",
  Highest = "Highest",
}

interface NetworkSettingsStoreState {
  allowMobileData: boolean;
  setAllowMobileData: (enabled: boolean) => void;
  wifiDefaultQuality: DefaultQuality;
  setWifiDefaultQuality: (quality: DefaultQuality) => void;
  mobileDataDefaultQuality: DefaultQuality;
  setMobileDataDefaultQuality: (quality: DefaultQuality) => void;
}

export const useNetworkSettingsStore = create<
  NetworkSettingsStoreState,
  [["zustand/persist", NetworkSettingsStoreState]]
>(
  persist(
    (set) => ({
      allowMobileData: false,
      setAllowMobileData: (enabled) => set({ allowMobileData: enabled }),
      wifiDefaultQuality: DefaultQuality.Highest,
      setWifiDefaultQuality: (quality) => set({ wifiDefaultQuality: quality }),
      mobileDataDefaultQuality: DefaultQuality.Lowest,
      setMobileDataDefaultQuality: (quality) =>
        set({ mobileDataDefaultQuality: quality }),
    }),
    {
      name: "network-settings",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export interface Account {
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export type AccountWithToken = Account & {
  sessionId: string;
  userId: string;
  token: string;
  seed: string;
  deviceName: string;
};

interface AuthStoreState {
  account: null | AccountWithToken;
  backendUrl: string;
  proxySet: null | string[];
  removeAccount(): void;
  setAccount(acc: AccountWithToken): void;
  updateDeviceName(deviceName: string): void;
  updateAccount(acc: Account): void;
  setAccountProfile(acc: Account["profile"]): void;
  setBackendUrl(url: string): void;
  setProxySet(urls: null | string[]): void;
}

export const useAuthStore = create<
  AuthStoreState,
  [["zustand/persist", AuthStoreState]]
>(
  persist(
    (set) => ({
      account: null,
      backendUrl: "https://mw-backend.lonelil.ru",
      proxySet: null,
      setAccount: (acc) => set((s) => ({ ...s, account: acc })),
      removeAccount: () => set((s) => ({ ...s, account: null })),
      setBackendUrl: (v) => set((s) => ({ ...s, backendUrl: v })),
      setProxySet: (urls) => set((s) => ({ ...s, proxySet: urls })),
      setAccountProfile: (profile) =>
        set((s) => ({
          ...s,
          account: s.account ? { ...s.account, profile } : s.account,
        })),
      updateAccount: (acc) =>
        set((s) =>
          s.account ? { ...s, account: { ...s.account, ...acc } } : s,
        ),
      updateDeviceName: (deviceName) =>
        set((s) =>
          s.account ? { ...s, account: { ...s.account, deviceName } } : s,
        ),
    }),
    {
      name: "account-settings",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
