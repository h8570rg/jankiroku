import { Button } from "~/components/Button";
import { Skeleton } from "~/components/Skeleton";
import { User } from "~/components/User";
import { serverServices } from "~/lib/services";
import { addFriends } from "./actions";

export async function List({
  query,
  skeleton = false,
}: {
  query: string;
  skeleton?: boolean;
}) {
  const { searchProfiles } = serverServices();

  const profiles = !skeleton
    ? await searchProfiles({ text: query })
    : Array.from({ length: 1 }).map((_, i) => ({
        id: `${i}`,
        name: "",
        janrecoId: "",
        isFriend: false,
      }));

  return (
    <ul className="space-y-2">
      {profiles?.map(({ id, name, janrecoId, isFriend }) => (
        <li key={id} className="flex items-center justify-between py-2">
          <User skeleton={skeleton} name={name} janrecoId={janrecoId} />
          {isFriend ? (
            <div className="w-16 text-center text-tiny text-foreground-500">
              追加済み
            </div>
          ) : (
            <Skeleton className="rounded-small" isLoaded={!skeleton}>
              <form action={addFriends.bind(null, id)}>
                <Button color="primary" size="sm" type="submit">
                  追加
                </Button>
              </form>
            </Skeleton>
          )}
        </li>
      ))}
      {!!query && profiles?.length === 0 && (
        <p className="mt-10 text-center text-small text-foreground-light">
          見つかりませんでした
        </p>
      )}
    </ul>
  );
}
