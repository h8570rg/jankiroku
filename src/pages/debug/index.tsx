import { useCallback } from "react";
import { useAuth } from "@/hooks/auth";
import { useToast } from "@/hooks/toast";

const Home = () => {
  const { loadingUser, user, signOut, signedIn } = useAuth();
  const toast = useToast();
  const addToast = useCallback(() => {
    toast.add({ content: "test" });
  }, [toast]);
  return (
    <>
      <main>
        <div className="mt-5">
          <p>{`ログイン状態: ${signedIn}`}</p>
          <p className="">{`loadingUser: ${loadingUser}`}</p>
          <p className="break-all">{`user: ${JSON.stringify(user)}`}</p>
        </div>
        <button onClick={signOut}>ログアウト</button>
        <button onClick={addToast}>add toast</button>
      </main>
    </>
  );
};

export default Home;
