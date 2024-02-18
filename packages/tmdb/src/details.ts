import type { MovieDetails, SeasonDetails, TvShowDetails } from "tmdb-ts";

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

export async function fetchSeasonDetails(
  id: string,
  season: number,
): Promise<SeasonDetails | undefined> {
  try {
    const result = await tmdb.tvSeasons.details(
      { tvShowID: parseInt(id, 10), seasonNumber: season },
      ["external_ids"],
    );
    return result;
  } catch (ex) {
    return undefined;
  }
}
