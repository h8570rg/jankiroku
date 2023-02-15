export const config = {
  public: {
    serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME,
    supabase: {
      apiURL: process.env.NEXT_PUBLIC_SUPABASE_API_URL,
      apiKey: process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
    },
  },
} as const;

export type Config = typeof config;
