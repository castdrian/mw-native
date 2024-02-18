import type { Item } from "parse-hls";
import hls from "parse-hls";
import { default as toWebVTT } from "srt-webvtt";

import type {
  EmbedOutput,
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
  sourceId,
  media,
  forceVTT,
  onEvent,
}: {
  sourceId?: string;
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

  let stream: Stream | null = null;

  if (sourceId) {
    onEvent && onEvent({ sourceIds: [sourceId] });

    let embedOutput: EmbedOutput | undefined;

    const sourceResult = await providers
      .runSourceScraper({
        id: sourceId,
        media,
      })
      .catch((error: Error) => {
        onEvent &&
          onEvent({ id: sourceId, percentage: 0, status: "failure", error });
        return undefined;
      });

    if (sourceResult) {
      onEvent && onEvent({ id: sourceId, percentage: 50, status: "pending" });

      for (const embed of sourceResult.embeds) {
        const embedResult = await providers
          .runEmbedScraper({
            id: embed.embedId,
            url: embed.url,
          })
          .catch(() => undefined);

        if (embedResult) {
          embedOutput = embedResult;
          onEvent &&
            onEvent({ id: embed.embedId, percentage: 100, status: "success" });
        }
      }
    }

    if (embedOutput) {
      stream = embedOutput.stream[0] ?? null;
    } else if (sourceResult) {
      stream = sourceResult.stream?.[0] ?? null;
    }

    if (stream) {
      onEvent && onEvent({ id: sourceId, percentage: 100, status: "success" });
    } else {
      onEvent && onEvent({ id: sourceId, percentage: 100, status: "notfound" });
    }
  } else {
    stream = await providers
      .runAll(options)
      .then((result) => result?.stream ?? null);
  }

  if (!stream) return null;

  if (forceVTT) {
    if (stream.captions && stream.captions.length > 0) {
      for (const caption of stream.captions) {
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
  return stream;
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

export interface HLSTracks {
  video: Item[];
  audio: Item[];
  subtitles: Item[];
}

export async function extractTracksFromHLS(
  playlistUrl: string,
  headers: Record<string, string>,
): Promise<HLSTracks | null> {
  try {
    const response = await fetch(playlistUrl, { headers }).then((res) =>
      res.text(),
    );
    const playlist = hls.parse(response);
    return {
      video: playlist.streamRenditions,
      audio: playlist.audioRenditions,
      subtitles: playlist.subtitlesRenditions,
    };
  } catch (e) {
    return null;
  }
}
