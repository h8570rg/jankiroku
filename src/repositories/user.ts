import { firestore } from "@lib/firebase/client";
import { User } from "@types";

export const fetchUser = async (uid: string) =>
  firestore.getDoc<User>("users", uid);

export const createUser = async (user: User) => {
  // todo;
};
