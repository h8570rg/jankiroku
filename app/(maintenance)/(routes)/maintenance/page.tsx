"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export default function MaintenancePage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-center text-large">メンテナンス中</h1>
        <Alert
          color="warning"
          title="申し訳ありませんが、現在メンテナンス中です。しばらくしてから再度お試しください。"
          endContent={
            <div className="flex items-center justify-center self-stretch"></div>
          }
        />
        <Button
          color="default"
          variant="flat"
          startContent={
            !isRefreshing && <Icon className="size-5" name="refresh" />
          }
          onPress={() => {
            router.refresh();
            setIsRefreshing(true);
            setTimeout(() => setIsRefreshing(false), 1000);
          }}
          isLoading={isRefreshing}
        >
          再読み込み
        </Button>
      </div>
    </main>
  );
}
