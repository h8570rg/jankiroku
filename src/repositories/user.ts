import { firestore } from "~/lib/firebase";
import { User } from "~/types";

export const fetchUser = (uid: string) => firestore.getDoc<User>("users", uid);

export const createUser = (user: User) => firestore.setDoc<User>(user, "users");
