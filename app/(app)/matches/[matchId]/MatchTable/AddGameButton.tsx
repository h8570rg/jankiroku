"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "~/components/Button";

export function AddGameButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * @see https://nextjs.org/docs/app/api-reference/functions/use-search-params#examples
   */
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  return (
    <Button
      as={Link}
      fullWidth
      color="primary"
      href={pathname + "?" + createQueryString("mode", "game-input")}
    >
      結果を入力する
    </Button>
  );
}
