import { User as FirebaseAuthUser } from "firebase/auth";
import { User } from "@types";

export const convertFirebaseAuthUserToUser = (user: FirebaseAuthUser): User => {
  const { uid, email, displayName, photoURL } = user;
  return {
    uid,
    email,
    name: displayName,
    photoURL,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUser = (user: any): user is User => {
  return (
    user.uid !== undefined &&
    user.name !== undefined &&
    user.email !== undefined &&
    user.photoURL !== undefined
  );
};
