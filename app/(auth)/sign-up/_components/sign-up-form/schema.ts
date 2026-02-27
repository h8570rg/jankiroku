import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const signUpSchema = z.object({
  email: schema.email,
  password: schema.password,
});
