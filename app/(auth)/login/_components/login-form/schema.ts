import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const signInEmailSchema = z.object({
  email: schema.email,
  password: schema.password,
});
