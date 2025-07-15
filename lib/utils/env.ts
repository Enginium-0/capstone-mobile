import { makeRedirectUri } from "expo-auth-session";

export const APP_SCHEME = process.env.EXPO_PUBLIC_SCHEME;

export const BASE_URL = makeRedirectUri()
;


export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
// export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${BASE_URL}/api/auth/callback`;
export const GOOGLE_AUTH_URL = process.env.GOOGLE_AUTH_URL!;
