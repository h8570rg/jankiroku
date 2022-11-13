/**
 * @see https://zenn.dev/takepepe/articles/nextjs-typesafe-api-routes
 */

import { NextApiHandler, NextApiResponse } from "next";

const noMethodResponse = (res: NextApiResponse) =>
  res
    .status(405)
    .json({ error: { httpStatus: 405, message: "Method Not Allowed" } });

export const handler = ({
  getHandler,
  postHandler,
  putHandler,
}: {
  getHandler?: NextApiHandler;
  postHandler?: NextApiHandler;
  putHandler?: NextApiHandler;
}): NextApiHandler => {
  return (req, res) => {
    switch (req.method) {
      case "GET":
        if (getHandler) {
          getHandler(req, res);
        } else {
          noMethodResponse(res);
        }
        break;
      case "POST":
        if (postHandler) {
          postHandler(req, res);
        } else {
          noMethodResponse(res);
        }
        break;
      case "PUT":
        if (putHandler) {
          putHandler(req, res);
        } else {
          noMethodResponse(res);
        }
        break;
      default:
        res
          .status(405)
          .json({ error: { httpStatus: 405, message: "Method Not Allowed" } });
    }
  };
};
