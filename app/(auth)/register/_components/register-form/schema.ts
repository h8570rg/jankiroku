import { coerceFormValue } from "@conform-to/zod/v4/future";
import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const updateProfileSchema = coerceFormValue(
  z.object({
    name: schema.name,
    displayId: schema.displayId,
  }),
);
