import { ofetch } from "ofetch";

import type {
  ChallengeTokenResponse,
  LoginInput,
  LoginResponse,
} from "./types";

export async function getLoginChallengeToken(
  url: string,
  publicKey: string,
): Promise<ChallengeTokenResponse> {
  return ofetch<ChallengeTokenResponse>("/auth/login/start", {
    method: "POST",
    body: {
      publicKey,
    },
    baseURL: url,
  });
}

export async function loginAccount(
  url: string,
  data: LoginInput,
): Promise<LoginResponse> {
  return ofetch<LoginResponse>("/auth/login/complete", {
    method: "POST",
    body: {
      namespace: "movie-web",
      ...data,
    },
    baseURL: url,
  });
}
