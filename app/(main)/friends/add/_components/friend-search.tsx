"use client";

import { SearchField } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

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
      autoFocus
      onChange={handleSearch}
      defaultValue={defaultValue}
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder="ユーザーIDもしくは名前で検索" />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
