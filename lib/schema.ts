import { z } from "zod";

export const commonSchema = {
  email: z.string().email(),
  password: z.string(),
};
