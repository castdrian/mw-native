import type { LoginResponse } from "./types";
import { f } from "./fetch";

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
  return f<LoginResponse>("/auth/login", {
    method: "POST",
    body: {
      id,
      device: deviceName,
    },
    baseUrl: url,
  });
}
