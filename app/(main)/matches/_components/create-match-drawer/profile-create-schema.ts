import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const createProfileSchema = z.object({
  name: schema.name,
});
