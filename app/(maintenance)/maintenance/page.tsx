"use client";

import { Alert, Typography } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import Logo from "@/components/logo";
import { Navbar, NavbarBrand } from "@/components/navbar";

export default function MaintenancePage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  return (
    <main className="relative flex min-h-dvh flex-col">
      <Navbar>
        <NavbarBrand>
          <Logo className="text-lg" />
        </NavbarBrand>
      </Navbar>
      <div className="flex grow items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Typography type="h1" align="center" className="text-lg">
            メンテナンス中
          </Typography>
          <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>
                申し訳ありませんが、現在メンテナンス中です。しばらくしてから再度お試しください。
              </Alert.Title>
            </Alert.Content>
          </Alert>
          <Button
            variant="secondary"
            onPress={() => {
              router.refresh();
              setIsRefreshing(true);
              setTimeout(() => setIsRefreshing(false), 1000);
            }}
            isPending={isRefreshing}
          >
            再読み込み
          </Button>
        </div>
      </div>
    </main>
  );
}
