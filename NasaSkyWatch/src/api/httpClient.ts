const BASE_URL = 'https://api.nasa.gov/new/rest/v1';
const DEFAULT_API_KEY = 'DEMO_KEY';

interface FetchOptions {
  params?: Record<string, string>;
}

export const httpClient = {
  get: async <T>(endpoint: string, options?: FetchOptions): Promise<T> => {
    const url = new URL(`${BASE_URL}${endpoint}`);

    url.searchParams.append('api_key', DEFAULT_API_KEY);

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