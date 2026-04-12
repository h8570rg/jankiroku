import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const profileUpdateSchema = z.object({
  name: schema.name,
  avatarUrl: z.string().optional(),
});
