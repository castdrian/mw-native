import { ofetch } from "ofetch";

import { getAuthHeaders } from "./auth";

export interface SessionResponse {
  id: string;
  userId: string;
  createdAt: string;
  accessedAt: string;
  device: string;
  userAgent: string;
}

export interface SessionUpdate {
  deviceName: string;
}

interface Account {
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export type AccountWithToken = Account & {
  sessionId: string;
  userId: string;
  token: string;
  seed: string;
  deviceName: string;
};

export async function getSessions(url: string, account: AccountWithToken) {
  return ofetch<SessionResponse[]>(`/users/${account.userId}/sessions`, {
    headers: getAuthHeaders(account.token),
    baseURL: url,
  });
}

export async function updateSession(
  url: string,
  account: AccountWithToken,
  update: SessionUpdate,
) {
  return ofetch<SessionResponse[]>(`/sessions/${account.sessionId}`, {
    method: "PATCH",
    headers: getAuthHeaders(account.token),
    body: update,
    baseURL: url,
  });
}

export async function removeSession(
  url: string,
  token: string,
  sessionId: string,
) {
  return ofetch<SessionResponse[]>(`/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
    baseURL: url,
  });
}
