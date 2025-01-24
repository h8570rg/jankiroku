"use client";

import {
  Link as HeroUiLink,
  LinkProps as HeroUiLinkProps,
} from "@heroui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef } from "react";

export const Link = forwardRef<
  HTMLAnchorElement,
  NextLinkProps & HeroUiLinkProps
>(function Link(props, ref) {
  return <HeroUiLink as={NextLink} ref={ref} {...props} />;
});
