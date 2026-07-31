import { useSettingsStore } from "@/store/settingsStore";

const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

// Last-resort fallback so local dev works with no configuration. DEMO_KEY is rate
// limited to a handful of requests per hour *per IP address*, shared with every
// other caller on that IP, so it is not viable for shipped builds.
const FALLBACK_API_KEY = 'DEMO_KEY';

// Inlined at build time by babel-preset-expo. Supplied by `.env` locally and by an
// EAS environment variable in CI — see the note in CLAUDE.md.
const BUNDLED_API_KEY = process.env.EXPO_PUBLIC_API_KEY;

interface FetchOptions {
  params?: Record<string, string>;
}

export const httpClient = {
  get: async <T>(endpoint: string, options?: FetchOptions): Promise<T> => {
    const url = new URL(`${BASE_URL}${endpoint}`);

    const apiKey =
      useSettingsStore.getState().apiKeyOverride || BUNDLED_API_KEY || FALLBACK_API_KEY;
    url.searchParams.append('api_key', apiKey);

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}