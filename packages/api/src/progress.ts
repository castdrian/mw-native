import type {
  AccountWithToken,
  ProgressInput,
  ProgressMediaItem,
  ProgressResponse,
  ProgressUpdateItem,
} from "./types";
import { getAuthHeaders } from "./auth";
import { f } from "./fetch";

export function progressUpdateItemToInput(
  item: ProgressUpdateItem,
): ProgressInput {
  return {
    duration: item.progress?.duration ?? 0,
    watched: item.progress?.watched ?? 0,
    tmdbId: item.tmdbId,
    meta: {
      title: item.title ?? "",
      type: item.type ?? "",
      year: item.year ?? NaN,
      poster: item.poster,
    },
    episodeId: item.episodeId,
    seasonId: item.seasonId,
    episodeNumber: item.episodeNumber,
    seasonNumber: item.seasonNumber,
  };
}

export function progressMediaItemToInputs(
  tmdbId: string,
  item: ProgressMediaItem,
): ProgressInput[] {
  if (item.type === "show") {
    return Object.entries(item.episodes).flatMap(([_, episode]) => ({
      duration: item.progress?.duration ?? episode.progress.duration,
      watched: item.progress?.watched ?? episode.progress.watched,
      tmdbId,
      meta: {
        title: item.title ?? "",
        type: item.type ?? "",
        year: item.year ?? NaN,
        poster: item.poster,
      },
      episodeId: episode.id,
      seasonId: episode.seasonId,
      episodeNumber: episode.number,
      seasonNumber: item.seasons[episode.seasonId]?.number,
      updatedAt: new Date(episode.updatedAt).toISOString(),
    }));
  }
  return [
    {
      duration: item.progress?.duration ?? 0,
      watched: item.progress?.watched ?? 0,
      tmdbId,
      updatedAt: new Date(item.updatedAt).toISOString(),
      meta: {
        title: item.title ?? "",
        type: item.type ?? "",
        year: item.year ?? NaN,
        poster: item.poster,
      },
    },
  ];
}

export async function setProgress(
  url: string,
  account: AccountWithToken,
  input: ProgressInput,
) {
  return f<ProgressResponse>(
    `/users/${account.userId}/progress/${input.tmdbId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(account.token),
      baseUrl: url,
      body: input,
    },
  );
}

export async function removeProgress(
  url: string,
  account: AccountWithToken,
  id: string,
  episodeId?: string,
  seasonId?: string,
) {
  await f(`/users/${account.userId}/progress/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(account.token),
    baseUrl: url,
    body: {
      episodeId,
      seasonId,
    },
  });
}
