import { config } from "~/lib/config";
import { auth } from "~/lib/server/firebase";

export const verifyAuthToken = (authToken: string) =>
  auth.verifyIdToken(authToken);

/**
 * @see https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
 */
export const refreshAuthToken = async (refreshToken: string) => {
  const res = await (
    await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${config.public.firebase.apiKey}`,
      {
        method: "post",
        body: JSON.stringify({
          grant_type: "refresh_token",
          refreshToken,
        }),
      }
    )
  ).json();
  if (!res) {
    throw new Error("Refresh token failed.");
  }
  const authToken = res.id_token;
  if (typeof authToken !== "string") {
    throw new Error("Type of refreshed authToken is not string.");
  }
  return authToken;
};
