import { Avatar, type AvatarProps } from "@heroui/react";
import { UserRound } from "lucide-react";

export function UserAvatar({
  avatarUrl,
  name,
  ...avatarProps
}: {
  avatarUrl: string | null;
  name: string | null;
} & AvatarProps) {
  return (
    <Avatar {...avatarProps}>
      {avatarUrl ? (
        <Avatar.Image src={avatarUrl} alt={name ?? "匿名ユーザー"} />
      ) : (
        <Avatar.Fallback>
          <UserRound />
        </Avatar.Fallback>
      )}
    </Avatar>
  );
}
