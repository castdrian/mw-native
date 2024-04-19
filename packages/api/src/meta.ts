import type { MetaResponse } from "./types";
import { f } from "./fetch";

export function getBackendMeta(url: string): Promise<MetaResponse> {
  return f<MetaResponse>("/meta", {
    baseUrl: url,
  });
}
