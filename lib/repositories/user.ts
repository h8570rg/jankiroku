import { firestore } from "~/lib/firebase/client";
import { User } from "~/lib/types";

export const fetchUser = (uid: string) => firestore.getDoc<User>("users", uid);

export const createUser = (user: User) => firestore.setDoc<User>(user, "users");
