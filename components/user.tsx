import { Avatar, type AvatarProps, cn } from "@heroui/react";
import { UserRound } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { Skeleton } from "@/components/skeleton";

export type UserProps = ComponentPropsWithoutRef<"div"> & {
  name?: string | null;
  displayId?: string | null;
  skeleton?: boolean;
  avatarProps?: AvatarProps;
  classNames?: {
    base?: string;
    wrapper?: string;
    name?: string;
    description?: string;
  };
};

export const User = forwardRef<HTMLDivElement, UserProps>(
  (
    {
      name,
      displayId,
      skeleton,
      avatarProps,
      className,
      classNames,
      ...restProps
    },
    ref,
  ) => {
    if (skeleton) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-sm",
            className,
          )}
        >
          <Skeleton className="size-10 rounded-full" />
          <div className="inline-flex flex-col items-start gap-1">
            <Skeleton className="h-4 w-20 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
        </div>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          `
            inline-flex items-center justify-center gap-2 rounded-sm
            outline-transparent outline-solid
          `,
          `
            data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2
            data-[focus-visible=true]:outline-offset-2
            data-[focus-visible=true]:outline-focus
          `,
          classNames?.base,
          className,
        )}
        {...restProps}
      >
        <Avatar {...avatarProps}>
          <Avatar.Fallback>
            <UserRound />
          </Avatar.Fallback>
        </Avatar>
        <div
          className={cn(
            "inline-flex flex-col items-start",
            classNames?.wrapper,
          )}
        >
          <span className={cn("text-sm text-inherit", classNames?.name)}>
            {name}
          </span>
          {displayId && (
            <span className={cn("text-xs text-muted", classNames?.description)}>
              @{displayId}
            </span>
          )}
        </div>
      </div>
    );
  },
);
User.displayName = "User";
