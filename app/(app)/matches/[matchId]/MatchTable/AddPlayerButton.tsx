"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";

export function AddPlayerButton() {
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
      className="w-full"
      size="sm"
      radius="md"
      variant="solid"
      color="primary"
      isIconOnly
      startContent={<Icon className="size-4 fill-current" name="add" />}
      href={pathname + "?" + createQueryString("mode", "player-add")}
    >
      追加
    </Button>
  );
}
