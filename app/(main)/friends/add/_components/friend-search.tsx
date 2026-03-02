"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchField } from "@/components/search-field";

type Props = {
  defaultValue: string;
};

export function FriendSearch({ defaultValue }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <SearchField
      variant="secondary"
      placeholder="ユーザーIDもしくは名前で検索"
      autoFocus
      onChange={handleSearch}
      defaultValue={defaultValue}
    />
  );
}
