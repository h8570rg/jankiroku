"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { Input } from "~/components/Input";
import { NAME_MAX_LENGTH } from "~/lib/utils/schemas";
import { addAnonymousPlayer } from "./actions";

export function AnonymousPlayerSelect({ matchId }: { matchId: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [{ errors, success }, formAction] = useFormState(
    addAnonymousPlayer.bind(null, matchId),
    {
      success: false,
    },
  );

  // TODO: 見直し。サーバー側でできないか
  useEffect(() => {
    if (success) {
      const params = new URLSearchParams(searchParams);
      params.delete("mode");
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [pathname, router, searchParams, success]);

  return (
    <form className="pt-1" action={formAction} noValidate>
      <div className="flex  gap-3">
        <Avatar className="mt-2 shrink-0" />
        <Input
          name="name"
          type="text"
          placeholder="プレイヤー名を入力してください"
          maxLength={NAME_MAX_LENGTH}
          errorMessage={errors?.name}
        />
      </div>
      <Button className="mt-4" fullWidth type="submit" color="primary">
        決定
      </Button>
    </form>
  );
}
