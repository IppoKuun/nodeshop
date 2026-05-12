const DEFAULT_API_URL = "http://localhost:4000";
const ENV_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL_PROD
    : process.env.NEXT_PUBLIC_API_URL_DEV);

export const API_BASE_URL = (
  ENV_API_URL?.trim() || DEFAULT_API_URL
).replace(/\/$/, "");
