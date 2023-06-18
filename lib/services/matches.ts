import "server-only";

import { repositories } from "~/lib/repositories";

export const matches = {
  get: async () => {
    const { data } = await repositories.matches().select();
    if (!data) {
      throw new Error("Matches not found");
    }
    return data;
  },
  create: async () => {
    const { data } = await repositories.matches().insert({}).select();
    if (!data) {
      throw new Error("Match not created");
    }
    return data;
  },
};
