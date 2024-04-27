import type { AccountWithToken, BookmarkInput, ProgressInput } from "./types";
import { getAuthHeaders } from "./auth";
import { f } from "./fetch";

export function importProgress(
  url: string,
  account: AccountWithToken,
  progressItems: ProgressInput[],
) {
  return f<void>(`/users/${account.userId}/progress/import`, {
    method: "PUT",
    body: progressItems,
    baseUrl: url,
    headers: getAuthHeaders(account.token),
  });
}

export function importBookmarks(
  url: string,
  account: AccountWithToken,
  bookmarks: BookmarkInput[],
) {
  return f<void>(`/users/${account.userId}/bookmarks`, {
    method: "PUT",
    body: bookmarks,
    baseUrl: url,
    headers: getAuthHeaders(account.token),
  });
}
