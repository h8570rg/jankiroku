import {
  Avatar as HeroUiAvatar,
  type AvatarProps as HeroUiAvatarProps,
} from "@heroui/react";
import { User } from "lucide-react";

export function AvatarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        flex -space-x-2
        *:ring-2 *:ring-background
      "
    >
      {children}
    </div>
  );
}

export type AvatarProps = HeroUiAvatarProps;

export function Avatar({ ...props }: AvatarProps) {
  return (
    <HeroUiAvatar {...props}>
      <User />
    </HeroUiAvatar>
  );
}
