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

export async function getVideoUrl(media: ScrapeMedia): Promise<Stream | null> {
  const providers = makeProviders({
    fetcher: makeStandardFetcher(fetch),
    target: targets.NATIVE,
    consistentIpForRequests: true,
  });

  const options: RunnerOptions = {
    media,
  };

  const results = await providers.runAll(options);
  if (!results) return null;
  return results.stream;
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
