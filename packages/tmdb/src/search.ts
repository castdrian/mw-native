import type { MovieDetails, TvShowDetails } from "tmdb-ts";
import { TMDB } from "tmdb-ts";

const TMDB_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYTM1ZTgyMzE4OTc0NTgxNDJmZjljZTE4ODExNWRlNiIsInN1YiI6IjY0OTM0ZDQ1ODliNTYxMDExYzliZDVhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AzWnIcxPNgDwGdzeIZ_C3mRC_5_qy-Z-SRPglLjzlNc";
const tmdb = new TMDB(TMDB_API_KEY);

export async function searchTitle(query: string): Promise<unknown[]> {
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

    return results;
  } catch (ex) {
    throw new Error(`Error searching for title: ${(ex as Error).message}`);
  }
}

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

export function getMediaPoster(posterPath: string): string {
  return `https://image.tmdb.org/t/p/w185/${posterPath}`;
}
