import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const signInEmailSchema = coerceFormValue(
  z.object({
    email: schema.email,
    password: schema.password,
  }),
);
