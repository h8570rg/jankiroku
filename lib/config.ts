export const config = {
  public: {
    vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME,
    supabase: {
      apiURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
} as const;

export type Config = typeof config;
