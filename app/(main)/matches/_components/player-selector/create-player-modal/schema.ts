import { z } from "zod";
import { schema } from "@/lib/utils/schema";

export const createPlayerSchema = z.object({
  name: schema.name,
});
