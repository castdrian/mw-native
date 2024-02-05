import type { MovieDetails, TvShowDetails } from "tmdb-ts";

import { tmdb } from "./util";

export async function fetchMediaDetails(
  id: string,
  type: "movie" | "tv",
): Promise<
  { type: "movie" | "tv"; result: TvShowDetails | MovieDetails } | undefined
> {
  try {
    const result =
      type === "movie"
        ? await tmdb.movies.details(parseInt(id, 10), ["external_ids"])
        : await tmdb.tvShows.details(parseInt(id, 10), ["external_ids"]);

    return {
      type,
      result,
    };
  } catch (ex) {
    return undefined;
  }
}
