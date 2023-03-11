"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useSessionGet } from "~/lib/hooks/auth";

export default function EmailConfirm() {
  const router = useRouter();
  const { trigger: getSession } = useSessionGet();
  const [failed, setFailed] = useState<boolean>(false);

  const verify = useCallback(async () => {
    const session = await getSession();
    if (!session) {
      setFailed(true);
    }
    router.push("/");
  }, [getSession, router]);

  useEffect(() => {
    verify();
  }, [verify]);

  if (failed) {
    return <div>認証に失敗しました</div>;
  }

  return <div>認証中</div>;
}
