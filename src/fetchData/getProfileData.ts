/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-firebase
 */

import admin from "@/utils/firebase/nodeApp";

export const getProfileData = async (username: string) => {
  const db = admin.firestore();
  const profileCollection = db.collection("profile");
  const profileDoc = await profileCollection.doc(username).get();

  if (!profileDoc.exists) {
    return null;
  }

  return profileDoc.data();
};
