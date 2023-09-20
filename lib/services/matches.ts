import "server-only";

import { repositories } from "~/lib/repositories";

export const matches = {
  get: async () => {
    const { data, error } = await repositories.matches().select();
    if (error) {
      throw error;
    }
    return data;
  },
  create: async () => {
    const { data, error } = await repositories.matches().insert({}).select();
    if (error) {
      throw error;
    }
    return data[0];
  },
};
