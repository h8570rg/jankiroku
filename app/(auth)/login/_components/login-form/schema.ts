import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const requestOtpSchema = coerceFormValue(
  z.object({
    email: schema.email,
  }),
);
