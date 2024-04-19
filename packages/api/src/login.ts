import type {
  ChallengeTokenResponse,
  LoginInput,
  LoginResponse,
} from "./types";
import { f } from "./fetch";

export async function getLoginChallengeToken(
  url: string,
  publicKey: string,
): Promise<ChallengeTokenResponse> {
  return f<ChallengeTokenResponse>("/auth/login/start", {
    method: "POST",
    body: {
      publicKey,
    },
    baseUrl: url,
  });
}

export async function loginAccount(
  url: string,
  data: LoginInput,
): Promise<LoginResponse> {
  return f<LoginResponse>("/auth/login/complete", {
    method: "POST",
    body: {
      namespace: "movie-web",
      ...data,
    },
    baseUrl: url,
  });
}
