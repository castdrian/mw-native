import { parse, types } from "hls-parser";
import { default as toWebVTT } from "srt-webvtt";

import type {
  FileBasedStream,
  Qualities,
  RunnerOptions,
  ScrapeMedia,
  Stream,
} from "@movie-web/providers";
import {
  makeProviders,
  makeStandardFetcher,
  targets,
} from "@movie-web/providers";

export interface InitEvent {
  sourceIds: string[];
}

export interface UpdateEvent {
  id: string;
  percentage: number;
  status: UpdateEventStatus;
  error?: unknown;
  reason?: string;
}

export type UpdateEventStatus = "success" | "failure" | "notfound" | "pending";

export interface DiscoverEmbedsEvent {
  sourceId: string;
  embeds: {
    id: string;
    embedScraperId: string;
  }[];
}

export type RunnerEvent =
  | string
  | InitEvent
  | UpdateEvent
  | DiscoverEmbedsEvent;

export async function getVideoStream({
  media,
  forceVTT,
  onEvent,
}: {
  media: ScrapeMedia;
  forceVTT?: boolean;
  onEvent?: (event: RunnerEvent) => void;
}): Promise<Stream | null> {
  const providers = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.NATIVE,
    consistentIpForRequests: true,
  });

  const options: RunnerOptions = {
    media,
    events: {
      init: onEvent,
      update: onEvent,
      discoverEmbeds: onEvent,
      start: onEvent,
    },
  };

  const result = await providers.runAll(options);
  if (!result) return null;

  if (forceVTT) {
    if (result.stream.captions && result.stream.captions.length > 0) {
      for (const caption of result.stream.captions) {
        if (caption.type === "srt") {
          const response = await fetch(caption.url);
          const srtSubtitle = await response.blob();
          const vttSubtitleUrl = await toWebVTT(srtSubtitle);
          caption.url = vttSubtitleUrl;
          caption.type = "vtt";
        }
      }
    }
  }
  return result.stream;
}

export function findHighestQuality(
  stream: FileBasedStream,
): Qualities | undefined {
  const qualityOrder: Qualities[] = [
    "4k",
    "1080",
    "720",
    "480",
    "360",
    "unknown",
  ];
  for (const quality of qualityOrder) {
    if (stream.qualities[quality]) {
      return quality;
    }
  }
  return undefined;
}

export async function extractTracksFromHLS(
  playlistUrl: string,
  headers: Record<string, string>,
) {
  try {
    const response = await fetch(playlistUrl, { headers }).then((res) =>
      res.text(),
    );
    const playlist = parse(response);
    if (!playlist.isMasterPlaylist) return null;
    if (!(playlist instanceof types.MasterPlaylist)) return null;

    const tracks = playlist.variants.map((variant) => {
      return {
        video: variant.video,
        audio: variant.audio,
        subtitles: variant.subtitles,
      };
    });
    return tracks;
  } catch (e) {
    return null;
  }
}
