import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/Button";
import { serverServices } from "@/lib/services/server";
import { RegisterForm } from "./_components/RegisterForm";
import { signOut } from "./_components/RegisterForm/actions";

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
		<>
			<h1 className="mx-auto mb-2 w-fit text-large">ユーザー情報登録</h1>
			<p className="mb-6 mt-4 text-small text-default-500">
				ユーザーIDと名前を決めてください。
				<br />
				ユーザーIDはユーザー検索に、名前は成績表に使用されます。
			</p>
			<RegisterForm userId={user.id} />
			<form className="mt-10 flex justify-center" action={signOut}>
				<Button
					isLoading={false}
					variant="light"
					type="submit"
					className="text-default-500 underline"
				>
					ログアウト
				</Button>
			</form>
		</>
	);
}
