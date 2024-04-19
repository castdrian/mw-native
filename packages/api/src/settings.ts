import type {
  AccountWithToken,
  SettingsInput,
  SettingsResponse,
} from "./types";
import { getAuthHeaders } from "./auth";
import { f } from "./fetch";

export function updateSettings(
  url: string,
  account: AccountWithToken,
  settings: SettingsInput,
) {
  return f<SettingsResponse>(`/users/${account.userId}/settings`, {
    method: "PUT",
    body: settings,
    baseUrl: url,
    headers: getAuthHeaders(account.token),
  });
}

export function getSettings(url: string, account: AccountWithToken) {
  return f<SettingsResponse>(`/users/${account.userId}/settings`, {
    method: "GET",
    baseUrl: url,
    headers: getAuthHeaders(account.token),
  });
}
