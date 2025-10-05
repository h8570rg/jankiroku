"use client";

import classNames from "classnames";
import { Button } from "@/components/Button";
import { GoogleIcon } from "@/components/SocialProviderIcon";
import { getIsWebview } from "@/lib/utils/userAgent";
import { signInWithGoogle } from "../LoginForm/actions";

export function SocialProviders({ className }: { className?: string }) {
	const handleGoogleClick = () => {
		const isWebview = getIsWebview();
		if (isWebview) {
			window.alert(
				"アプリ内ブラウザではGoogleログインを利用できません。他のブラウザでお試しください。",
			);
			return;
		}
		signInWithGoogle().catch((e) => {
			throw e;
		});
	};

	return (
		<ul className={classNames("space-y-2", className)}>
			<li className="w-full">
				<Button
					fullWidth
					className="flex items-center justify-center gap-3"
					variant="bordered"
					onPress={handleGoogleClick}
				>
					<GoogleIcon className="w-5" />
					<span>Google でログイン</span>
				</Button>
			</li>
			<li className="w-full">
				<Button
					fullWidth
					variant="bordered"
					onPress={() => alert("開発中です、しばらくお待ちください")}
				>
					<span>ログインせずに始める</span>
				</Button>
			</li>
		</ul>
	);
}
