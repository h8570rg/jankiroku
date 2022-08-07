import { UserCredential } from "firebase/auth";
import {
  createAccountWithEmailAndPassword,
  signInWithGoogle,
} from "~/repositories/auth";

export const signup = {
  email: async (email: string, password: string) => {
    try {
      const userCredential: UserCredential =
        await createAccountWithEmailAndPassword(email, password);
    } catch {
      throw new Error("aaaaaa");
    }
  },
};

export const signin = {
  google: async () => {
    try {
      await signInWithGoogle();
    } catch {
      throw new Error("bbbbb");
    }
  },
};
