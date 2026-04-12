import { Avatar, Dropdown } from "@heroui/react";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { serverServices } from "@/lib/services/server";
import { AppbarAvatarMenu } from "./appbar-avatar-menu";

export async function AppbarAvatar() {
  const { getUserProfile } = await serverServices();
  const [profile] = await Promise.all([getUserProfile()]);

  // TODO: isUnregisteredで扱う。ts制御
  if (!profile.displayId || !profile.name) {
    redirect("/register");
  }

  return (
    <Dropdown>
      <Dropdown.Trigger aria-label="プロフィールメニュー">
        <Avatar className="transition-transform" size="sm">
          {profile.avatarUrl ? (
            <Avatar.Image src={profile.avatarUrl} alt="プロフィール画像" />
          ) : (
            <Avatar.Fallback>
              <UserRound />
            </Avatar.Fallback>
          )}
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-60">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              {profile.avatarUrl ? (
                <Avatar.Image src={profile.avatarUrl} alt="プロフィール画像" />
              ) : (
                <Avatar.Fallback>
                  <UserRound />
                </Avatar.Fallback>
              )}
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm/5 font-medium">{profile.name}</p>
              <p className="text-xs leading-none text-muted">
                @{profile.displayId}
              </p>
            </div>
          </div>
        </div>
        <AppbarAvatarMenu />
      </Dropdown.Popover>
    </Dropdown>
  );
}
