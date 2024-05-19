import { redirect } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { serverServices } from "@/lib/services/server";
import { NavbarAvatarMenu } from "./Menu";

export async function NavbarAvatar() {
  const { getUserProfile } = serverServices();
  const [profile] = await Promise.all([getUserProfile()]);

  // TODO: isUnregisteredで扱う。ts制御
  if (!profile.janrecoId || !profile.name) {
    redirect("/register");
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          as="button"
          className="transition-transform"
          color="secondary"
          size="sm"
        />
      </DropdownTrigger>
      <NavbarAvatarMenu name={profile.name} janrecoId={profile.janrecoId} />
    </Dropdown>
  );
}
