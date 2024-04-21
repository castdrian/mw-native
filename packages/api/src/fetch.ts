export interface FetcherOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  method?: "HEAD" | "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  readHeaders?: string[];
  body?: Record<string, any>;
}

export type FullUrlOptions = Pick<FetcherOptions, "query" | "baseUrl">;

export function makeFullUrl(url: string, ops?: FullUrlOptions): string {
  // glue baseUrl and rest of url together
  let leftSide = ops?.baseUrl ?? "";
  let rightSide = url;

  // left side should always end with slash, if its set
  if (leftSide.length > 0 && !leftSide.endsWith("/")) leftSide += "/";

  // right side should never start with slash
  if (rightSide.startsWith("/")) rightSide = rightSide.slice(1);

  const fullUrl = leftSide + rightSide;
  if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://"))
    throw new Error(
      `Invald URL -- URL doesn't start with a http scheme: '${fullUrl}'`,
    );

  const parsedUrl = new URL(fullUrl);
  Object.entries(ops?.query ?? {}).forEach(([k, v]) => {
    parsedUrl.searchParams.set(k, v);
  });

  return parsedUrl.toString();
}

export async function f<T>(url: string, ops?: FetcherOptions): Promise<T> {
  const fullUrl = makeFullUrl(url, ops);
  const response = await fetch(fullUrl, {
    method: ops?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...ops?.headers,
    },
    body: ops?.body ? JSON.stringify(ops.body) : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch '${fullUrl}' -- ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as T;
  return data;
}
