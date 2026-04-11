import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const updateNameSchema = z.object({
  name: schema.name,
});
