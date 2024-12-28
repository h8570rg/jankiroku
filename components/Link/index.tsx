"use client";

import {
  Link as NextUILink,
  LinkProps as NextUILinkProps,
} from "@nextui-org/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { forwardRef } from "react";

export const Link = forwardRef<
  HTMLAnchorElement,
  NextLinkProps & NextUILinkProps
>(function Link(props, ref) {
  return <NextUILink as={NextLink} ref={ref} {...props} />;
});
