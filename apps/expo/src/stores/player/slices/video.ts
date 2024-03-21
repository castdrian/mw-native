import type { AVPlaybackStatus, Video } from "expo-av";
import type { Asset } from "expo-media-library";

import type { ScrapeMedia } from "@movie-web/provider-utils";

import type { MakeSlice } from "./types";
import { PlayerStatus } from "./interface";

export interface PlayerMetaEpisode {
  number: number;
  tmdbId: string;
  title?: string;
}

export interface PlayerMeta {
  type: "movie" | "show";
  title: string;
  tmdbId: string;
  imdbId?: string;
  releaseYear: number;
  poster?: string;
  episodes?: PlayerMetaEpisode[];
  episode?: PlayerMetaEpisode;
  season?: {
    number: number;
    tmdbId: string;
    title?: string;
  };
}

export interface VideoSlice {
  videoRef: Video | null;
  status: AVPlaybackStatus | null;
  meta: PlayerMeta | null;
  asset: Asset | null;

  setVideoRef(ref: Video | null): void;
  setStatus(status: AVPlaybackStatus | null): void;
  setMeta(meta: PlayerMeta | null): void;
  setAsset(asset: Asset | null): void;
  resetVideo(): void;
}

export const convertMetaToScrapeMedia = (meta: PlayerMeta): ScrapeMedia => {
  if (meta.type === "movie") {
    return {
      title: meta.title,
      releaseYear: meta.releaseYear,
      type: "movie",
      tmdbId: meta.tmdbId,
      imdbId: meta.imdbId,
    };
  }
  if (meta.type === "show") {
    return {
      title: meta.title,
      releaseYear: meta.releaseYear,
      type: "show",
      tmdbId: meta.tmdbId,
      season: meta.season!,
      episode: meta.episode!,
      imdbId: meta.imdbId,
    };
  }
  throw new Error("Invalid meta type");
};

export const createVideoSlice: MakeSlice<VideoSlice> = (set) => ({
  videoRef: null,
  status: null,
  meta: null,
  asset: null,

  setVideoRef: (ref) => {
    set({ videoRef: ref });
  },
  setStatus: (status) => {
    set((s) => {
      s.status = status;
    });
  },
  setMeta: (meta) => {
    set((s) => {
      s.interface.playerStatus = PlayerStatus.SCRAPING;
      s.meta = meta;
    });
  },
  setAsset: (asset) => {
    set((s) => {
      s.asset = asset;
    });
  },
  resetVideo() {
    set({ videoRef: null, status: null, meta: null, asset: null });
    set((s) => {
      s.interface.playerStatus = PlayerStatus.SCRAPING;
    });
  },
});
