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

export async function getVideoStream({
  media,
  forceVTT,
}: {
  media: ScrapeMedia;
  forceVTT?: boolean;
}): Promise<Stream | null> {
  const providers = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.NATIVE,
    consistentIpForRequests: true,
  });

  const options: RunnerOptions = {
    media,
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
