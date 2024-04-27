import type { AppendToResponse, MovieDetails, TvShowDetails } from "tmdb-ts";

import type { ScrapeMedia } from "@movie-web/providers";

import type { HLSTracks } from "./video";
import { constructFullUrl, providers } from "./video";

export function getMetaData() {
  return [...providers.listSources(), ...providers.listEmbeds()];
}

export function transformSearchResultToScrapeMedia<T extends "tv" | "movie">(
  type: T,
  result: T extends "tv"
    ? AppendToResponse<TvShowDetails, "external_ids"[], "tvShow">
    : AppendToResponse<MovieDetails, "external_ids"[], "movie">,
  season?: number,
  episode?: number,
): ScrapeMedia {
  if (type === "tv") {
    const tvResult = result as AppendToResponse<
      TvShowDetails,
      "external_ids"[],
      "tvShow"
    >;
    return {
      type: "show",
      tmdbId: tvResult.id.toString(),
      imdbId: tvResult.external_ids.imdb_id,
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
    const movieResult = result as AppendToResponse<
      MovieDetails,
      "external_ids"[],
      "movie"
    >;
    return {
      type: "movie",
      tmdbId: movieResult.id.toString(),
      imdbId: movieResult.external_ids.imdb_id,
      title: movieResult.title,
      releaseYear: new Date(movieResult.release_date).getFullYear(),
    };
  }

  throw new Error("Invalid type parameter");
}

interface AudioTrack {
  uri: string;
  name: string;
  language: string;
  active?: boolean;
}

export function filterAudioTracks(tracks: HLSTracks, playlist: string) {
  const audioTracks: AudioTrack[] = tracks.audio.map((track) => ({
    uri: constructFullUrl(playlist, track.uri),
    name: track.properties[0]?.attributes.name?.toString() ?? "Unknown",
    language: track.properties[0]?.attributes.language?.toString() ?? "Unknown",
    active: Boolean(track.properties[0]?.attributes.default) ?? false,
  }));

  const uniqueTracks = new Set(audioTracks.map((t) => t.language));

  const filteredAudioTracks = audioTracks.filter((track) => {
    if (uniqueTracks.has(track.language)) {
      uniqueTracks.delete(track.language);
      return true;
    }
    return false;
  });

  return filteredAudioTracks;
}
