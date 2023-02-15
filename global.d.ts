declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SERVICE_NAME: string;
      NEXT_PUBLIC_SUPABASE_API_URL: string;
      NEXT_PUBLIC_SUPABASE_API_KEY: string;
    }
  }
}

export {};
