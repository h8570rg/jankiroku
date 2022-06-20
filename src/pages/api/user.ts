// TODO: 見直す
import { NextApiHandler } from "next";
import { createUser } from "@/apis/node/users";
import { handler } from "@/utils/api";
import { isUser } from "@/utils/user";

const postHandler: NextApiHandler = async (req, res) => {
  const body = JSON.parse(req.body);
  const { user } = body;
  if (!isUser(user)) {
    res.status(400).json({ error: "Invalid User" });
  }
  try {
    const result = await createUser(user);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export default handler({ postHandler });
