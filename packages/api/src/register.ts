import { ofetch } from "ofetch";

import type {
  ChallengeTokenResponse,
  RegisterInput,
  SessionResponse,
  UserResponse,
} from "./types";

export async function getRegisterChallengeToken(
  url: string,
  captchaToken?: string,
): Promise<ChallengeTokenResponse> {
  return ofetch<ChallengeTokenResponse>("/auth/register/start", {
    method: "POST",
    body: {
      captchaToken,
    },
    baseURL: url,
  });
}

export interface RegisterResponse {
  user: UserResponse;
  session: SessionResponse;
  token: string;
}

export async function registerAccount(
  url: string,
  data: RegisterInput,
): Promise<RegisterResponse> {
  return ofetch<RegisterResponse>("/auth/register/complete", {
    method: "POST",
    body: {
      namespace: "movie-web",
      ...data,
    },
    baseURL: url,
  });
}
