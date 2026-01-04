import { Suspense } from "react";
import { Link } from "@/components/link";
import Logo from "@/components/logo";
import { Navbar, NavbarBrand, NavbarContent } from "@/components/navbar";
import { Skeleton } from "@/components/skeleton";
import { AppbarAvatar } from "./avatar";

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
