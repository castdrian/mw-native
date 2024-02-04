import type { MovieWithMediaType, TVWithMediaType } from "tmdb-ts";

import { tmdb } from "./util";

export async function searchTitle(query: string) {
  try {
    const rawResults = await tmdb.search.multi({
      query,
      page: 1,
      include_adult: false,
    });
    const results = rawResults.results.filter(
      (result) => result.media_type === "tv" || result.media_type === "movie",
    );

    if (!results.length) throw new Error("No results found");

    return results as unknown as MovieWithMediaType[] | TVWithMediaType[];
  } catch (ex) {
    throw new Error(`Error searching for title: ${(ex as Error).message}`);
  }
}
