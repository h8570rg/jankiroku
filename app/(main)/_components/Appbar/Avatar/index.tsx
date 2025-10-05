import { redirect } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { serverServices } from "@/lib/services/server";
import { AppbarAvatarMenu } from "./Menu";

export async function AppbarAvatar() {
	const { getUserProfile } = await serverServices();
	const [profile] = await Promise.all([getUserProfile()]);

	// TODO: isUnregisteredで扱う。ts制御
	if (!profile.displayId || !profile.name) {
		redirect("/register");
	}

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar as="button" className="transition-transform" size="sm" />
			</DropdownTrigger>
			<AppbarAvatarMenu name={profile.name} displayId={profile.displayId} />
		</Dropdown>
	);
}
