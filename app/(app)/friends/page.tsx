import { List } from "./List";
import { AddModal } from "./add/AddModal";

export default async function Page({
  searchParams,
}: {
  searchParams?: { add?: string; add_query?: string };
}) {
  const addQuery = searchParams?.add_query || "";

  return (
    <>
      <List />
      <AddModal isOpen={!!searchParams?.add} query={addQuery} />
    </>
  );
}
