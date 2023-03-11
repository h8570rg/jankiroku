"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useSessionGet } from "~/lib/hooks/useAuth";

export default function EmailConfirm() {
  const router = useRouter();
  const { trigger: getSession } = useSessionGet();
  const [success, setSuccess] = useState<boolean>();

  const isValidating = success === undefined;
  const failed = !isValidating && !success;

  const verify = useCallback(async () => {
    const session = await getSession();
    setSuccess(!!session);
  }, [getSession]);

  useEffect(() => {
    verify();
  }, [verify]);

  useEffect(() => {
    if (!isValidating && !!success) {
      router.push("/dashboard");
    }
  }, [isValidating, router, success]);

  if (failed) {
    return <div>認証に失敗しました</div>;
  }

  return <div>認証中</div>;
}
