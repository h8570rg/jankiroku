import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodSchema } from "zod";

import { createClient } from "../utils/supabase-api";

export function withZod<T extends ZodSchema>(
  schema: T,
  next: (
    req: NextApiRequest,
    res: NextApiResponse,
    data: z.infer<T>
  ) => unknown | Promise<unknown>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const parsed = schema.safeParse({
      body: JSON.parse(req.body),
      query: req.query,
    });

    if (!parsed.success) {
      // 共通のバリデーションエラーレスポンスとして処理
      res.status(400).json({
        message: "Bad Request",
        issues: JSON.parse(parsed.error.message),
      });
      return;
    }

    const data: z.infer<T> = {
      body: req.body,
      query: req.query,
    };

    return next(req, res, data);
  };
}

export function withSession<T extends ZodSchema>(
  schema: T,
  next: (
    req: NextApiRequest,
    res: NextApiResponse,
    data: z.infer<T>
  ) => unknown | Promise<unknown>
) {
  return withZod(schema, async (req, res, data) => {
    const supabase = createClient(req, res);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({
        error: "not_authenticated",
        description:
          "The user does not have an active session or is not authenticated",
      });
    }

    return next(req, res, data);
  });
}
