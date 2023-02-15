export const config = {
  public: {
    serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME,
  },
} as const;

export type Config = typeof config;
