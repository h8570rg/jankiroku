import { NextApiHandler } from "next";
// import { z } from "zod";

// import { withZod } from "~/lib/routes/api";
// import { commonSchema } from "~/lib/schema";
// import { createClient } from "~/lib/utils/supabase-api";

// export namespace schema {
//   export const post = z.object({
//     body: z.object({
//       email: commonSchema.email,
//       password: commonSchema.password,
//     }),
//   });
//   export type Post = z.infer<typeof post>;
// }

// const handlePost = withZod(schema.post, async (req, res, { body }) => {
//   const { email, password } = body;
//   const supabase = createClient(req, res);

//   const { data } = await supabase.auth.signUp({
//     email,
//     password,
//     // options: {
//     //   emailRedirectTo: `${config.public.basePath}/`,
//     // },
//   });

//   res.status(200).send(data);
// });

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    // case "POST":
    //   return handlePost(req, res);
    default:
      res.status(405).json({ message: "Method Not Allowed" });
      return;
  }
};

export default handler;
