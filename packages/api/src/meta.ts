import { ofetch } from "ofetch";

import type { MetaResponse } from "./types";

export async function getBackendMeta(url: string): Promise<MetaResponse> {
  return ofetch<MetaResponse>("/meta", {
    baseURL: url,
  });
}
