import type {
  AccountWithToken,
  BookmarkInput,
  BookmarkMediaItem,
  BookmarkResponse,
} from "./types";
import { getAuthHeaders } from "./auth";
import { f } from "./fetch";

export function bookmarkMediaToInput(
  tmdbId: string,
  item: BookmarkMediaItem,
): BookmarkInput {
  return {
    meta: {
      title: item.title,
      type: item.type,
      poster: item.poster,
      year: item.year ?? 0,
    },
    tmdbId,
  };
}

export async function addBookmark(
  url: string,
  account: AccountWithToken,
  input: BookmarkInput,
) {
  return f<BookmarkResponse>(
    `/users/${account.userId}/bookmarks/${input.tmdbId}`,
    {
      method: "POST",
      headers: getAuthHeaders(account.token),
      baseUrl: url,
      body: input,
    },
  );
}

export async function removeBookmark(
  url: string,
  account: AccountWithToken,
  id: string,
) {
  return f<{ tmdbId: string }>(`/users/${account.userId}/bookmarks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(account.token),
    baseUrl: url,
  });
}
