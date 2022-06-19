import { FIRESTORE } from "@/constants";
import { User } from "@/types";
import { firestore } from "@/utils/firebase/client";

export const fetchUser = async (uid: string) =>
  firestore.getDoc<User>(FIRESTORE.COLLECTION.USERS, uid);

export const createUser = async (user: User) =>
  firestore.setDoc<User>(user, FIRESTORE.COLLECTION.USERS, user.uid);
