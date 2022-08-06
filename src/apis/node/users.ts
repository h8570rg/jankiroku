import { FIRESTORE } from "@/constants";
import { User } from "@/types";
import { firestore } from "src/firebase/admin";

export const fetchUser = async (uid: string) => {
  const doc = await firestore
    .collection(FIRESTORE.COLLECTION.USERS)
    .doc(uid)
    .get();
  return doc.data() as User; // TODO
};

export const createUser = async (user: User) => {
  return firestore
    .collection(FIRESTORE.COLLECTION.USERS)
    .doc(user.uid)
    .set(user);
};
