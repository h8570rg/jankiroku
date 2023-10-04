import classNames from "classnames";
import { debounce } from "lodash-es";
import { ChangeEventHandler, useCallback } from "react";
import { useAddFriend } from "~/lib/hooks/api/friends";
import { useProfilesSearch } from "~/lib/hooks/api/profiles";
import { Profile } from "~/lib/services/profile";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Input } from "../Input";
import { ScrollShadow } from "../ScrollShadow";
import { Skeleton } from "../Skeleton";
import { User } from "../User";

export function ProfilesSearch({
  inputClassName,
  listClassName,
  mode = "select",
  onSelect,
  excludeProfileIds = [],
}: {
  inputClassName?: string;
  listClassName?: string;
  mode?: "addFriend" | "select";
  onSelect?: (profileId: string) => void;
  excludeProfileIds?: string[];
}) {
  const { data: profiles, trigger, isMutating, reset } = useProfilesSearch();

  const selectableProfiles = profiles?.filter(
    (profile) => !excludeProfileIds.includes(profile.id),
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = debounce((e) => {
    const value = e.target.value;
    if (value === "") {
      reset();
      return;
    }
    trigger({ text: value });
  }, 200);

  const handleAddFriend = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
      <Input
        className={inputClassName}
        placeholder="IDもしくは名前で検索"
        autoFocus
        startContent={<Icon className="h-5 w-5 fill-current" name="search" />}
        onChange={handleChange}
        isClearable
        onClear={reset}
      />
      <ScrollShadow className={classNames(listClassName, "mt-3")}>
        <ul className="space-y-2">
          {isMutating && (
            <li className="flex items-center justify-between py-2">
              <User skeleton />
              <Skeleton className="rounded-small">
                <Button color="primary" size="sm">
                  追加
                </Button>
              </Skeleton>
            </li>
          )}
          {!isMutating &&
            selectableProfiles?.map((profile) => (
              <ListItem
                key={profile.id}
                profile={profile}
                onAddFriend={handleAddFriend}
                mode={mode}
                onSelect={onSelect}
              />
            ))}
          {!isMutating &&
            selectableProfiles &&
            selectableProfiles?.length === 0 && (
              <p className="py-3 text-center text-sm text-foreground-500">
                見つかりませんでした
              </p>
            )}
        </ul>
      </ScrollShadow>
    </>
  );
}

function ListItem({
  profile,
  onAddFriend,
  mode,
  onSelect,
}: {
  profile: Profile;
  onAddFriend: () => void;
  mode: "addFriend" | "select";
  onSelect?: (profileId: string) => void;
}) {
  const { trigger: addFriend, isMutating: isFriendAdding } = useAddFriend();

  const handleAddClick = useCallback(async () => {
    await addFriend({ profileId: profile.id });
    onAddFriend();
  }, [addFriend, onAddFriend, profile.id]);

  const handleSelect = useCallback(() => {
    onSelect?.(profile.id);
  }, [onSelect, profile.id]);

  return (
    <li className="flex items-center justify-between py-2">
      <User {...profile} />
      {mode === "addFriend" && (
        <>
          {profile.isFriend ? (
            <div className="w-16 text-center text-xs text-foreground-500">
              追加済み
            </div>
          ) : (
            <Button
              color="primary"
              size="sm"
              onClick={handleAddClick}
              isLoading={isFriendAdding}
            >
              追加
            </Button>
          )}
        </>
      )}
      {mode === "select" && (
        <Button size="sm" color="primary" onClick={handleSelect}>
          決定
        </Button>
      )}
    </li>
  );
}
