export interface SessionResponse {
  id: string;
  userId: string;
  createdAt: string;
  accessedAt: string;
  device: string;
  userAgent: string;
}
export interface LoginResponse {
  session: SessionResponse;
  token: string;
}

export interface BookmarkMetaInput {
  title: string;
  year: number;
  poster?: string;
  type: string;
}

export interface BookmarkInput {
  tmdbId: string;
  meta: BookmarkMetaInput;
}

export interface ChallengeTokenResponse {
  challenge: string;
}

export interface LoginResponse {
  session: SessionResponse;
  token: string;
}

export interface LoginInput {
  publicKey: string;
  challenge: {
    code: string;
    signature: string;
  };
  device: string;
}

export interface MetaResponse {
  version: string;
  name: string;
  description?: string;
  hasCaptcha: boolean;
  captchaClientKey?: string;
}

export interface RegisterInput {
  publicKey: string;
  challenge: {
    code: string;
    signature: string;
  };
  device: string;
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export interface ProgressInput {
  meta?: {
    title: string;
    year: number;
    poster?: string;
    type: string;
  };
  tmdbId: string;
  watched: number;
  duration: number;
  seasonId?: string;
  episodeId?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  updatedAt?: string;
}

export interface SessionResponse {
  id: string;
  userId: string;
  createdAt: string;
  accessedAt: string;
  device: string;
  userAgent: string;
}

export interface SessionUpdate {
  deviceName: string;
}

interface Account {
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export type AccountWithToken = Account & {
  sessionId: string;
  userId: string;
  token: string;
  seed: string;
  deviceName: string;
};

export interface SettingsInput {
  applicationLanguage?: string;
  applicationTheme?: string | null;
  defaultSubtitleLanguage?: string;
  proxyUrls?: string[] | null;
}

export interface SettingsResponse {
  applicationTheme?: string | null;
  applicationLanguage?: string | null;
  defaultSubtitleLanguage?: string | null;
  proxyUrls?: string[] | null;
}

export interface UserResponse {
  id: string;
  namespace: string;
  name: string;
  roles: string[];
  createdAt: string;
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export interface UserEdit {
  profile?: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export interface BookmarkMediaItem {
  title: string;
  year?: number;
  poster?: string;
  type: "show" | "movie";
  updatedAt: number;
}

export interface BookmarkResponse {
  tmdbId: string;
  meta: {
    title: string;
    year: number;
    poster?: string;
    type: "show" | "movie";
  };
  updatedAt: string;
}

export interface ProgressItem {
  watched: number;
  duration: number;
}

export interface ProgressSeasonItem {
  title: string;
  number: number;
  id: string;
}

export interface ProgressEpisodeItem {
  title: string;
  number: number;
  id: string;
  seasonId: string;
  updatedAt: number;
  progress: ProgressItem;
}

export interface ProgressMediaItem {
  title: string;
  year?: number;
  poster?: string;
  type: "show" | "movie";
  progress?: ProgressItem;
  updatedAt: number;
  seasons: Record<string, ProgressSeasonItem>;
  episodes: Record<string, ProgressEpisodeItem>;
}

export interface ProgressUpdateItem {
  title?: string;
  year?: number;
  poster?: string;
  type?: "show" | "movie";
  progress?: ProgressItem;
  tmdbId: string;
  id: string;
  episodeId?: string;
  seasonId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  action: "upsert" | "delete";
}

export interface ProgressResponse {
  tmdbId: string;
  season: {
    id?: string;
    number?: number;
  };
  episode: {
    id?: string;
    number?: number;
  };
  meta: {
    title: string;
    year: number;
    poster?: string;
    type: "show" | "movie";
  };
  duration: string;
  watched: string;
  updatedAt: string;
}
