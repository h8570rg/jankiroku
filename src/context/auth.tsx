/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-firebase
 */
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { auth } from "src/firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";
import { Auth, User } from "src/types";
import { createUser, fetchUser } from "src/apis/auth";

export const AuthContext = createContext<Auth>({
  loadingUser: true,
  signedIn: false,
  signOut: () => auth.signOut(),
  user: undefined,
});

const AuthContextComp = ({ children }: { children: ReactNode }) => {
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
          if (!!data) {
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
      } catch (error) {
        throw error;
        // Most probably a connection error. Handle appropriately.
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

// Custom hook that shorthands the context!
export const useAuth = () => useContext(AuthContext);

export default AuthContextComp;
