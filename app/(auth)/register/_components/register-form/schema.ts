import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const updateProfileSchema = z.object({
  name: schema.name,
  displayId: schema.displayId,
});
