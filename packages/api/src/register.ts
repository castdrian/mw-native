import type {
  ChallengeTokenResponse,
  RegisterInput,
  SessionResponse,
  UserResponse,
} from "./types";
import { f } from "./fetch";

export async function getRegisterChallengeToken(
  url: string,
  captchaToken?: string,
): Promise<ChallengeTokenResponse> {
  return f<ChallengeTokenResponse>("/auth/register/start", {
    method: "POST",
    body: {
      captchaToken,
    },
    baseUrl: url,
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
  return f<RegisterResponse>("/auth/register/complete", {
    method: "POST",
    body: {
      namespace: "movie-web",
      ...data,
    },
    baseUrl: url,
  });
}
