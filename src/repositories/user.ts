import { User } from "@types";
import { firestore } from "src/firebase/client";

export const fetchUser = async (uid: string) =>
  firestore.getDoc<User>("users", uid);

export const createUser = async (user: User) => {
  // todo;
};
