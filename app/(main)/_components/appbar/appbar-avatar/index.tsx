import { Dropdown } from "@heroui/react";
import { redirect } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";
import { serverServices } from "@/lib/services/server";
import { AppbarAvatarMenu } from "./appbar-avatar-menu";

/**
 * @see https://heroui.com/docs/react/components/dropdown#custom-trigger
 */
export async function AppbarAvatar() {
  const { getUserProfile } = await serverServices();
  const [profile] = await Promise.all([getUserProfile()]);

  // TODO: isUnregisteredで扱う。ts制御
  if (!profile.displayId || !profile.name) {
    redirect("/register");
  }

  return (
    <Dropdown>
      <Dropdown.Trigger
        className="rounded-full"
        aria-label="プロフィールメニュー"
      >
        <UserAvatar
          avatarUrl={profile.avatarUrl}
          name={profile.name}
          size="sm"
        />
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-60">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <UserAvatar avatarUrl={profile.avatarUrl} name={profile.name} />
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
