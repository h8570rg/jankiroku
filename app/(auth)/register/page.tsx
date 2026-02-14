import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { linkVariants } from "@/components/link";
import { serverServices } from "@/lib/services/server";
import { RegisterForm } from "./_components/register-form";
import { signOut } from "./_components/register-form/actions";

export const metadata: Metadata = {
  title: "ユーザー情報登録",
};

export default async function RegisterPage() {
  const { getUserProfile } = await serverServices();
  const user = await getUserProfile();

  if (user.name && user.displayId) {
    redirect("/matches");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mx-auto mb-4 w-fit text-lg">ユーザー情報登録</h1>
      <p className="mb-6 text-sm text-muted">
        ユーザーIDと名前を決めてください。
        <br />
        ユーザーIDはユーザー検索に、名前は成績表に使用されます。
      </p>
      <RegisterForm userId={user.id} />
      <div className="mt-10 flex justify-center">
        <button
          className={linkVariants().base()}
          type="button"
          onClick={signOut}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
