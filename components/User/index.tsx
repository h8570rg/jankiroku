import { User as NextUiUser, UserProps } from "@nextui-org/react";
import { Skeleton } from "~/components/Skeleton";

export function User({
  name,
  janrecoId,
  skeleton,
  ...restProps
}: {
  name?: string;
  janrecoId?: string;
  skeleton?: boolean;
} & Omit<UserProps, "name">) {
  if (skeleton) {
    return (
      <div className="inline-flex items-center justify-center gap-2 rounded-small">
        <Skeleton className="size-10 rounded-full" />
        <div className="inline-flex flex-col items-start gap-1">
          <Skeleton className="h-4 w-20 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
    );
  }
  return (
    <NextUiUser
      name={name}
      description={`@${janrecoId}`}
      avatarProps={{
        name: "",
      }}
      {...restProps}
    />
  );
}
