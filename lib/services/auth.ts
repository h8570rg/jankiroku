import "server-only";

import { repositories } from "~/lib/repositories";

export const auth = {
  getSession: async () => {
    const { data } = await repositories.auth().getSession();
    return data;
  },
};
