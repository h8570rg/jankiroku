import { Dropdown, Typography } from "@heroui/react";
import { UserAvatar } from "@/components/user-avatar";
import { getUserProfile } from "@/lib/data/user";
import { AppbarAvatarMenu } from "./appbar-avatar-menu";

/**
 * @see https://heroui.com/docs/react/components/dropdown#custom-trigger
 */
export async function AppbarAvatar() {
  const userProfile = await getUserProfile();

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full" aria-label="プロフィールメニュー">
        <UserAvatar avatarUrl={userProfile.avatarUrl} name={userProfile.name} size="sm" />
      </Dropdown.Trigger>
      <Dropdown.Popover className="min-w-60">
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <UserAvatar avatarUrl={userProfile.avatarUrl} name={userProfile.name} />
            <div className="flex flex-col gap-0">
              <Typography type="body-sm" className="leading-5 font-medium">
                {userProfile.name}
              </Typography>
              <Typography type="body-xs" color="muted" className="leading-none">
                @{userProfile.displayId}
              </Typography>
            </div>
          </div>
        </div>
        <AppbarAvatarMenu />
      </Dropdown.Popover>
    </Dropdown>
  );
}
