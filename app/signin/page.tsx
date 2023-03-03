// const AnonymousSelectionOverlay = ({
//   className,
//   onSigninButtonClick,
//   onAnonymousSigninButtonClick,
// }: {
//   className?: string;
//   onSigninButtonClick?: VoidFunction;
//   onAnonymousSigninButtonClick?: VoidFunction;
//   loading: boolean;
// }) => {
//   return (
//     <div className={classNames("relative h-full", className)}>
//       <div className="absolute inset-0"></div>
//       <Image
//         src={MahJong1Image}
//         objectFit="cover"
//         className="animate-expansion"
//         alt="mahjong"
//       />
//       <div className="absolute inset-0 opacity-95"></div>
//       <div className="absolute inset-0 flex items-center">
//         <div className="max-w-sm">
//           <Logo className="mx-auto mb-10 w-fit" />
//           <div className="space-y-4">
//             <button
//               className="rounded-full font-bold"
//               onClick={onSigninButtonClick}
//             >
//               ログイン/新規登録
//             </button>
//             <button
//               className="rounded-full font-bold"
//               onClick={onAnonymousSigninButtonClick}
//             >
//               ログインせずに始める
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useSupabase } from "~/components/SupabaseProvider";

export default function Signin() {
  const { supabase } = useSupabase();

  const handleSignup = async () => {
    await supabase.auth.signUp({
      email: "test@gmail.com",
      password: "aaaaa11111",
    });
  };

  const handleEmailLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: "test@gmail.com",
      password: "aaaaa11111",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <button onClick={handleSignup}>signup</button>
      <button onClick={handleEmailLogin}>Email Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
