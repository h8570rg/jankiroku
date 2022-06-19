/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-firebase
 */

import { firestore } from "@/utils/firebase/admin";

export const getProfileData = async (username: string) => {
  const profileCollection = firestore.collection("profile");
  const profileDoc = await profileCollection.doc(username).get();

  if (!profileDoc.exists) {
    return null;
  }

  return profileDoc.data();
};
