import { Suspense } from "react";
import { Link } from "@/components/Link";
import Logo from "@/components/Logo";
import { Navbar, NavbarBrand, NavbarContent } from "@/components/Navbar";
import { Skeleton } from "@/components/Skeleton";
import { AppbarAvatar } from "./Avatar";

export default function Appbar() {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarContent>
        <NavbarBrand>
          <Link color="foreground" href="/matches">
            <Logo className="text-large" />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
          <AppbarAvatar />
        </Suspense>
      </NavbarContent>
    </Navbar>
  );
}
