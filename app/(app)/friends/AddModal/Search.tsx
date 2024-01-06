/**
 * @see https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
 */
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";

export function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("add_query", term);
    } else {
      params.delete("add_query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      placeholder="ユーザーIDもしくは名前で検索"
      autoFocus
      startContent={<Icon className="h-5 w-5 fill-current" name="search" />}
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get("add_query")?.toString()}
    />
  );
}
