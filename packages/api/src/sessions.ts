import type { AccountWithToken, SessionResponse, SessionUpdate } from "./types";
import { getAuthHeaders } from "./auth";
import { f } from "./fetch";

export async function getSessions(url: string, account: AccountWithToken) {
  return f<SessionResponse[]>(`/users/${account.userId}/sessions`, {
    headers: getAuthHeaders(account.token),
    baseUrl: url,
  });
}

export async function updateSession(
  url: string,
  account: AccountWithToken,
  update: SessionUpdate,
) {
  return f<SessionResponse[]>(`/sessions/${account.sessionId}`, {
    method: "PATCH",
    headers: getAuthHeaders(account.token),
    body: update,
    baseUrl: url,
  });
}

export async function removeSession(
  url: string,
  token: string,
  sessionId: string,
) {
  return f<SessionResponse[]>(`/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
    baseUrl: url,
  });
}
