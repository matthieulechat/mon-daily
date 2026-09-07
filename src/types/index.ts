export interface Track {
  id: string;
  name: string;
  artistNames: string[];
  uri: string;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface User {
  id: string;
  platform: "spotify";
  platformUserId: string;
}
