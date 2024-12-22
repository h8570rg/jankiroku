"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import Logo from "@/components/Logo";

export default function MaintenancePage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  return (
    <main className="relative flex min-h-screen flex-col">
      <NextUINavbar position="static" className="absolute inset-x-0 top-0">
        <NavbarContent>
          <NavbarBrand>
            <Link color="foreground" href="/">
              <Logo className="text-large" />
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </NextUINavbar>
      <div className="flex grow items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
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
      </div>
    </main>
  );
}
