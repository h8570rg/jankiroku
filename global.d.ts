declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SERVICE_ENV: "local" | "development" | "production";
      NEXT_PUBLIC_VERCEL_URL: string | undefined;
      NEXT_PUBLIC_SITE_URL: string | undefined;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

export {};
