import { User } from "@/types";
import { firestore } from "@/utils/firebase/admin";

export const fetchUser = async (uid: string) => {
  const doc = await firestore.collection("users").doc(uid).get();
  return doc.data() as User; // TODO
};
