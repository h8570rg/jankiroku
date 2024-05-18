import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import { Suspense } from "react";
import { Link } from "~/components/Link";
import Logo from "~/components/Logo";
import { Skeleton } from "~/components/Skeleton";
import { NavbarAvatar } from "./Avatar";

export default function Navbar() {
  return (
    <NextUINavbar shouldHideOnScroll>
      <NavbarContent>
        <NavbarBrand>
          <Link color="foreground" href="/">
            <Logo className="text-large" />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
          <NavbarAvatar />
        </Suspense>
      </NavbarContent>
    </NextUINavbar>
  );
}
