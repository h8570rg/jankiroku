/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-firebase
 */
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, createContext, ReactNode } from "react";
import { createUser, fetchUser } from "@/apis/client/users";
import Splash from "@/components/splash";
import { Auth, User } from "@/types";
import { convertFirebaseAuthUserToUser } from "@/utils/user";
import { auth } from "src/firebase/client";

export const AuthContext = createContext<Auth>({
  loadingUser: true,
  signedIn: false,
  signOut: () => auth.signOut(),
  user: undefined,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Listen authenticated user
    const unsubscribe = onAuthStateChanged(auth, async (firebaseAuthUser) => {
      setLoadingUser(true);
      setUser(undefined);
      await (async () => {
        if (!firebaseAuthUser) {
          // TODO: https://nextjs.org/docs/going-to-production#logging
          return;
        }

        // ログイン済み(匿名含む)
        const { uid } = firebaseAuthUser;
        const user = await fetchUser(uid);

        // dbにユーザーデータがある場合それをセット
        if (user) {
          setUser(user);
          return;
        }

        // dbにユーザーデータがない場合create
        const newUser = convertFirebaseAuthUserToUser(firebaseAuthUser);
        const createdUser = await createUser(newUser);
        setUser(createdUser);
      })();
      setLoadingUser(false);
    });

    // Unsubscribe auth listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loadingUser,
        signedIn: !!user,
        signOut: () => auth.signOut(),
        user,
      }}
    >
      {loadingUser ? <Splash /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
