import type { MovieDetails, TvShowDetails } from "tmdb-ts";

import type { ScrapeMedia } from "@movie-web/providers";

export function transformSearchResultToScrapeMedia(
  type: "tv" | "movie",
  result: TvShowDetails | MovieDetails,
  season?: number,
  episode?: number,
): ScrapeMedia {
  if (type === "tv") {
    const tvResult = result as TvShowDetails;
    return {
      type: "show",
      tmdbId: tvResult.id.toString(),
      title: tvResult.name,
      releaseYear: new Date(tvResult.first_air_date).getFullYear(),
      season: {
        number: season ?? tvResult.seasons[0]?.season_number ?? 1,
        tmdbId: season
          ? tvResult.seasons
              .find((s) => s.season_number === season)
              ?.id.toString() ?? ""
          : tvResult.seasons[0]?.id.toString() ?? "",
      },
      episode: {
        number: episode ?? 1,
        tmdbId: "",
      },
    };
  }
  if (type === "movie") {
    const movieResult = result as MovieDetails;
    return {
      type: "movie",
      tmdbId: movieResult.id.toString(),
      title: movieResult.title,
      releaseYear: new Date(movieResult.release_date).getFullYear(),
    };
  }

  throw new Error("Invalid type parameter");
}
