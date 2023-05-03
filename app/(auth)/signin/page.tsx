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

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  useSigninEmail,
  signinEmailSchema,
  SigninEmailSchema,
  useSigninGoogle,
} from "~/lib/hooks/auth";

export default function Signin() {
  const router = useRouter();
  const { trigger: signinEmail } = useSigninEmail();
  const { trigger: signinGoogle } = useSigninGoogle();

  const { register, handleSubmit } = useForm<SigninEmailSchema>({
    resolver: zodResolver(signinEmailSchema),
  });

  const onSubmit: SubmitHandler<SigninEmailSchema> = async (data) => {
    await signinEmail(data);
    router.push("/");
  };

  const handleSigninGoogleClick = async () => {
    await signinGoogle();
    router.push("/");
  };

  return (
    <>
      <div>
        <button onClick={handleSigninGoogleClick}>google</button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section>
            <label htmlFor="email">email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              {...register("email")}
            />
          </section>
          <section>
            <label htmlFor="current-password">password</label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              required
              {...register("password")}
            />
          </section>
          <button>signin</button>
        </form>
        <Link href="/signup">新規登録</Link>
      </div>
    </>
  );
}
