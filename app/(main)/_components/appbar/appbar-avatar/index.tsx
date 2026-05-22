import { Dropdown, Text } from "@heroui/react";
import { UserAvatar } from "@/components/user-avatar";
import { serverServices } from "@/lib/services/server";
import { AppbarAvatarMenu } from "./appbar-avatar-menu";

/**
 * @see https://heroui.com/docs/react/components/dropdown#custom-trigger
 */
export async function AppbarAvatar() {
  const { getUserProfile } = await serverServices();
  const profile = await getUserProfile();

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
              <Text type="body-sm" className="leading-5 font-medium">
                {profile.name}
              </Text>
              <Text type="body-xs" color="muted" className="leading-none">
                @{profile.displayId}
              </Text>
            </div>
          </div>
        </div>
        <AppbarAvatarMenu />
      </Dropdown.Popover>
    </Dropdown>
  );
}
