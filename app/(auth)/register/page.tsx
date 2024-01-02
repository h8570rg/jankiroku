import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "~/components/Button";
import { signOut } from "~/lib/actions/signOut";
import { serverServices } from "~/lib/services";
import { Form } from "./Form";

export const metadata: Metadata = {
  title: "ユーザー情報登録",
};

export default async function Register() {
  const { getUserProfile } = serverServices();
  const user = await getUserProfile();

  if (user.name && user.janrecoId) {
    redirect("/");
  }

  return (
    <>
      <h1 className="mx-auto mb-2 w-fit text-large font-bold">
        ユーザー情報登録
      </h1>
      <p className="mb-6 mt-4 text-small text-foreground-light">
        ユーザーIDと名前を決めてください。
        <br />
        ユーザーIDはユーザー検索に、名前は成績表に使用されます。
      </p>
      <Form userId={user.id} />
      <form className="mt-10 flex justify-center" action={signOut}>
        <Button
          isLoading={false}
          variant="light"
          type="submit"
          className="text-foreground-light underline"
        >
          ログアウト
        </Button>
      </form>
    </>
  );
}
