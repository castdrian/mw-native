import type { MovieDetails, TvShowDetails } from "tmdb-ts";

import { tmdb } from "./util";

export async function fetchMediaDetails(
  id: string,
  type: "movie" | "tv",
): Promise<
  { type: "movie" | "tv"; result: TvShowDetails | MovieDetails } | undefined
> {
  try {
    let result: TvShowDetails | MovieDetails;

    switch (type) {
      case "tv":
        result = await tmdb.tvShows.details(parseInt(id, 10));
        break;
      case "movie":
        result = await tmdb.movies.details(parseInt(id, 10));
        break;
      default:
        return undefined;
    }

    return { type, result };
  } catch (ex) {
    return undefined;
  }
}
