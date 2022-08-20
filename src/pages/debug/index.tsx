import { GetServerSideProps } from "next";
import nookies from "nookies";
import { useCallback } from "react";
// import { fetchUser } from "@/apis/node/users";
import { useToast } from "~/hooks/toast";
import { auth as authAdmin } from "~/lib/firebase/admin";
import { User } from "~/types";

// type ServerSideProps = {
//   user: User;
// };

// export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
//   ctx
// ) => {
//   /**
//    * @see https://colinhacks.com/essays/nextjs-firebase-authentication
//    */
//   try {
//     const cookies = nookies.get(ctx);
//     const token = await authAdmin.verifyIdToken(cookies.token);

//     // the user is authenticated!
//     const { uid } = token;
//     const user = await fetchUser(uid);

//     // FETCH STUFF HERE!! 🚀

//     return {
//       props: {
//         user,
//       },
//     };
//   } catch (err) {
//     console.log(err);
//     // either the `token` cookie didn't exist
//     // or token verification failed
//     // either way: redirect to the login page
//     ctx.res.writeHead(302, { Location: "/signin" });
//     ctx.res.end();

//     // `as never` prevents inference issues
//     // with InferGetServerSidePropsType.
//     // The props returned here don't matter because we've
//     // already redirected the user.
//     return { props: {} as never };
//   }
// };

const Home = () => {
  // const { loadingUser, user, signOut, signedIn } = useAuth();
  const toast = useToast();
  const addToast = useCallback(() => {
    toast.add({ content: "test" });
  }, [toast]);
  return (
    <>
      <main>
        {/* <div className="mt-5">
          <p>{`ログイン状態: ${signedIn}`}</p>
          <p className="">{`loadingUser: ${loadingUser}`}</p>
          <p className="break-all">{`user: ${JSON.stringify(user)}`}</p>
        </div>
        <button onClick={signOut}>ログアウト</button>
        <button onClick={addToast}>add toast</button>
        <p>{message}</p> */}
      </main>
    </>
  );
};

export default Home;
