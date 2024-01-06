"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "~/components/Avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";
import { Link } from "~/components/Link";
import Logo from "~/components/Logo";
import { signOut } from "./actions";

export default function Navbar({
  name,
  janrecoId,
}: {
  name: string;
  janrecoId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleProfileMenuAction(key: unknown) {
    switch (key) {
      case "friends":
        router.push("/friends");
        break;
      case "signOut":
        signOut();
        break;
    }
  }

  const menuItems = [
    {
      label: "ダッシュボード",
      href: "/",
    },
    {
      label: "フレンド",
      href: "/friends",
    },
  ];

  /**
   * @see https://nextjs.org/docs/app/api-reference/functions/use-router#router-events
   */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <NextUINavbar
      classNames={{
        wrapper: "px-5",
      }}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          icon={<Icon name={isMenuOpen ? "close" : "menu"} />}
        />
        <NavbarBrand>
          <Link color="foreground" href="/">
            <Logo className="text-large" />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              color="secondary"
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu
            className="max-w-[70vw]"
            aria-label="プロフィール"
            variant="flat"
            onAction={handleProfileMenuAction}
          >
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              textValue={`${name}@${janrecoId}`}
            >
              <p className="text-wrap break-all font-semibold">{name}</p>
              <p className="text-wrap break-all font-semibold">@{janrecoId}</p>
            </DropdownItem>
            <DropdownItem key="friends">フレンド</DropdownItem>
            <DropdownItem key="signOut" color="danger">
              ログアウト
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color="foreground"
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
}
