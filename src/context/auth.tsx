/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-firebase
 */
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, createContext, ReactNode } from "react";
import { createUser, fetchUser } from "@/apis/auth";
import { auth } from "@/firebase/clientApp";
import { Auth, User } from "@/types";

export const AuthContext = createContext<Auth>({
  loadingUser: true,
  signedIn: false,
  signOut: () => auth.signOut(),
  user: undefined,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    // Listen authenticated user
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          const data = await fetchUser(uid);
          if (data) {
            setUser(data);
          } else {
            const _user: User = {
              uid,
              name: displayName,
              email,
              photoURL,
            };
            createUser(_user);
            setUser(_user);
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
