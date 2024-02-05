import type {
	FileBasedStream,
	Qualities,
	RunnerOptions,
	ScrapeMedia} from '@movie-web/providers';
import {
	makeProviders,
	makeStandardFetcher,
	targets,
  } from '@movie-web/providers';

export async function getVideoUrl(media: ScrapeMedia): Promise<string|null> {
	const providers = makeProviders({
		fetcher: makeStandardFetcher(fetch),
		target: targets.NATIVE,
		consistentIpForRequests: true,
	  });

	const options: RunnerOptions = {
		media
	};

	const results = await providers.runAll(options);
	if (!results) return null;

	let highestQuality;
	let url;
	
	switch (results.stream.type) {
		case 'file':
			highestQuality = findHighestQuality(results.stream);
			url = highestQuality ? results.stream.qualities[highestQuality]?.url : null;
			return url ?? null;
		case 'hls':
			return results.stream.playlist;
	}
}

function findHighestQuality(stream: FileBasedStream): Qualities | undefined {
	const qualityOrder: Qualities[] = ['4k', '1080', '720', '480', '360', 'unknown'];
	for (const quality of qualityOrder) {
		if (stream.qualities[quality]) {
			return quality;
		}
	}
	return undefined;
}