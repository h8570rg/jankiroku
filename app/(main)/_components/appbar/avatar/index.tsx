import { redirect } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { Dropdown } from "@/components/dropdown";
import { serverServices } from "@/lib/services/server";
import { AppbarAvatarMenu } from "./menu";

export async function AppbarAvatar() {
  const { getUserProfile } = await serverServices();
  const [profile] = await Promise.all([getUserProfile()]);

  // TODO: isUnregisteredで扱う。ts制御
  if (!profile.displayId || !profile.name) {
    redirect("/register");
  }

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Avatar className="transition-transform" size="sm" />
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-60">
        <AppbarAvatarMenu name={profile.name} displayId={profile.displayId} />
      </Dropdown.Popover>
    </Dropdown>
  );
}
