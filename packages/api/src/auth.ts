import { ofetch } from "ofetch";

import type { LoginResponse } from "./types";

export function getAuthHeaders(token: string): Record<string, string> {
  return {
    authorization: `Bearer ${token}`,
  };
}

export async function accountLogin(
  url: string,
  id: string,
  deviceName: string,
): Promise<LoginResponse> {
  return ofetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: {
      id,
      device: deviceName,
    },
    baseURL: url,
  });
}
