import { Avatar } from "@heroui/react";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
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
        <Avatar className="transition-transform" size="sm">
          <Avatar.Fallback>
            <UserRound />
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-60">
        <AppbarAvatarMenu name={profile.name} displayId={profile.displayId} />
      </Dropdown.Popover>
    </Dropdown>
  );
}
