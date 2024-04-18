import { ofetch } from "ofetch";

import type { AccountWithToken, BookmarkInput, ProgressInput } from "./types";
import { getAuthHeaders } from "./auth";

export function importProgress(
  url: string,
  account: AccountWithToken,
  progressItems: ProgressInput[],
) {
  return ofetch<void>(`/users/${account.userId}/progress/import`, {
    method: "PUT",
    body: progressItems,
    baseURL: url,
    headers: getAuthHeaders(account.token),
  });
}

export function importBookmarks(
  url: string,
  account: AccountWithToken,
  bookmarks: BookmarkInput[],
) {
  return ofetch<void>(`/users/${account.userId}/bookmarks`, {
    method: "PUT",
    body: bookmarks,
    baseURL: url,
    headers: getAuthHeaders(account.token),
  });
}
