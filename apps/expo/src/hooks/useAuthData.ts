import { useCallback } from "react";

import type {
  BookmarkResponse,
  LoginResponse,
  ProgressResponse,
  SessionResponse,
  SettingsResponse,
  UserResponse,
} from "@movie-web/api";
import type { ScrapeMedia } from "@movie-web/provider-utils";

import type { ItemData } from "~/components/item/item";
import type { WatchHistoryItem } from "~/stores/settings";
import type { ThemeStoreOption } from "~/stores/theme";
import {
  useAuthStore,
  useBookmarkStore,
  useWatchHistoryStore,
} from "~/stores/settings";
import { useThemeStore } from "~/stores/theme";

export function useAuthData() {
  const loggedIn = !!useAuthStore((s) => s.account);
  const setAccount = useAuthStore((s) => s.setAccount);
  const removeAccount = useAuthStore((s) => s.removeAccount);
  const setBookmarks = useBookmarkStore((s) => s.setBookmarks);
  const setProxySet = useAuthStore((s) => s.setProxySet);
  const setWatchHistory = useWatchHistoryStore((s) => s.setWatchHistory);
  const clearBookmarks = useCallback(() => setBookmarks([]), [setBookmarks]);
  const clearProgress = useCallback(
    () => setWatchHistory([]),
    [setWatchHistory],
  );
  const replaceBookmarks = useCallback(
    (bookmarks: ItemData[]) => setBookmarks(bookmarks),
    [setBookmarks],
  );
  const replaceItems = useCallback(
    (items: WatchHistoryItem[]) => setWatchHistory(items),
    [setWatchHistory],
  );
  const setTheme = useThemeStore((s) => s.setTheme);

  // const setAppLanguage = useLanguageStore((s) => s.setLanguage);
  // const importSubtitleLanguage = useSubtitleStore(
  // 	(s) => s.importSubtitleLanguage,
  // );

  const login = useCallback(
    (
      loginResponse: LoginResponse,
      user: UserResponse,
      session: SessionResponse,
      seed: string,
    ) => {
      const account = {
        token: loginResponse.token,
        userId: user.id,
        sessionId: loginResponse.session.id,
        deviceName: session.device,
        profile: user.profile,
        seed,
      };
      setAccount(account);
      return account;
    },
    [setAccount],
  );

  const logout = useCallback(() => {
    removeAccount();
    clearBookmarks();
    clearProgress();
  }, [removeAccount, clearBookmarks, clearProgress]);

  const syncData = useCallback(
    (
      _user: UserResponse,
      _session: SessionResponse,
      progress: ProgressResponse[],
      bookmarks: BookmarkResponse[],
      settings: SettingsResponse,
    ) => {
      const bookmarkResponseToItemData = (
        bookmarks: BookmarkResponse[],
      ): ItemData[] => {
        return bookmarks.map((bookmark) => ({
          id: bookmark.tmdbId,
          title: bookmark.meta.title,
          type: bookmark.meta.type === "show" ? "tv" : "movie",
          year: bookmark.meta.year,
          posterUrl: bookmark.meta.poster ?? "",
        }));
      };

      const progressResponseToWatchHistoryItem = (
        progress: ProgressResponse[],
      ): WatchHistoryItem[] => {
        return progress.map((entry) => {
          const isShow = entry.meta.type === "show";
          const commonMedia = {
            title: entry.meta.title,
            releaseYear: entry.meta.year,
            tmdbId: entry.tmdbId,
          };

          const media: ScrapeMedia = isShow
            ? {
                ...commonMedia,
                type: "show",
                season: {
                  number: entry.season.number ?? 0,
                  tmdbId: entry.season.id ?? "",
                },
                episode: {
                  number: entry.episode.number ?? 0,
                  tmdbId: entry.episode.id ?? "",
                },
              }
            : {
                ...commonMedia,
                type: "movie",
              };

          return {
            item: {
              id: entry.tmdbId,
              title: entry.meta.title,
              type: entry.meta.type === "show" ? "tv" : "movie",
              season: entry.season.number,
              episode: entry.episode.number,
              year: entry.meta.year,
              posterUrl: entry.meta.poster ?? "",
            },
            media: media,
            positionMillis: parseInt(entry.watched, 10),
          };
        });
      };

      replaceBookmarks(bookmarkResponseToItemData(bookmarks));
      replaceItems(progressResponseToWatchHistoryItem(progress));

      // if (settings.applicationLanguage) {
      // 	setAppLanguage(settings.applicationLanguage);
      // }

      // if (settings.defaultSubtitleLanguage) {
      // 	importSubtitleLanguage(settings.defaultSubtitleLanguage);
      // }

      if (settings.applicationTheme) {
        setTheme(settings.applicationTheme as unknown as ThemeStoreOption);
      }

      if (settings.proxyUrls) {
        setProxySet(settings.proxyUrls);
      }
    },
    [replaceBookmarks, replaceItems, setTheme, setProxySet],
  );

  return {
    loggedIn,
    login,
    logout,
    syncData,
  };
}
