"use client";

import { linkVariants, Spinner } from "@heroui/react";
import { useTransition } from "react";
import { signOut } from "./register-form/actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={linkVariants().base()}
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signOut();
        });
      }}
    >
      {isPending && <Spinner color="current" size="sm" className="mr-1" />}
      ログアウト
    </button>
  );
}
