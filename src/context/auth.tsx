/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-firebase
 */
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, createContext, ReactNode } from "react";
import { fetchUser } from "@/apis/client/users";
import Splash from "@/components/splash";
import { Auth, User } from "@/types";
import { auth } from "@/utils/firebase/client";

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid } = user;
          const data = await fetchUser(uid);
          if (data) {
            setUser(data);
          } else {
            // TODO: リダイレクト
          }
        }
      } finally {
        setLoadingUser(false);
      }
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
