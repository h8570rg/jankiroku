"use client";

import { cn } from "@heroui/react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useRef,
  useState,
} from "react";

const hideOnScrollVariants = {
  visible: {
    y: 0,
    transition: {
      ease: [0.4, 0, 0.2, 1] as const, // easeOut
    },
  },
  hidden: {
    y: "-100%",
    transition: {
      ease: [0.4, 0, 1, 1] as const, // easeIn
    },
  },
} as const;

export const Navbar = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"header"> & {
    shouldHideOnScroll?: boolean;
  }
>(({ className, shouldHideOnScroll, children, ...restProps }, ref) => {
  const [isHidden, setIsHidden] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const prevScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (currentScrollY) => {
    if (shouldHideOnScroll && navRef.current) {
      const navHeight = navRef.current.offsetHeight;
      const isScrollingDown = currentScrollY > prevScrollY.current;
      const shouldHide = isScrollingDown && currentScrollY > navHeight;

      setIsHidden(shouldHide);
      prevScrollY.current = currentScrollY;
    }
  });

  // Extract only HTML attributes, excluding event handlers that conflict with motion
  const {
    onDrag,
    onDragEnd,
    onDragStart,
    onAnimationStart,
    onAnimationEnd,
    ...htmlProps
  } = restProps as Record<string, unknown>;

  if (shouldHideOnScroll) {
    return (
      <motion.header
        ref={(node) => {
          navRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          `
            sticky top-0 z-40 flex h-auto w-full items-center justify-center
            bg-background/70 backdrop-blur-lg backdrop-saturate-150
            data-[menu-open=true]:border-none
          `,
          className,
        )}
        animate={isHidden ? "hidden" : "visible"}
        initial={false}
        variants={hideOnScrollVariants}
        {...(htmlProps as Record<string, unknown>)}
      >
        <nav
          className="
          relative z-40 flex h-16 w-full flex-row flex-nowrap items-center
          justify-between gap-4 px-6
        "
        >
          {children}
        </nav>
      </motion.header>
    );
  }

  return (
    <header
      ref={ref}
      className={cn(
        `
          sticky top-0 z-40 flex h-auto w-full items-center justify-center
          bg-background/70 backdrop-blur-lg backdrop-saturate-150
          data-[menu-open=true]:border-none
        `,
        className,
      )}
      {...restProps}
    >
      <nav
        className="
        relative z-40 flex h-16 w-full flex-row flex-nowrap items-center
        justify-between gap-4 px-6
      "
      >
        {children}
      </nav>
    </header>
  );
});
Navbar.displayName = "Navbar";

export const NavbarBrand = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        `
          box-border flex grow basis-0 flex-row flex-nowrap items-center
          justify-start bg-transparent text-base whitespace-nowrap no-underline
        `,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
NavbarBrand.displayName = "NavbarBrand";

export function NavbarContent({
  className,
  as = "div",
  justify,
  children,
  ...props
}: {
  className?: string;
  as?: "div" | "ul";
  justify?: "start" | "center" | "end";
  children?: React.ReactNode;
  [key: string]: unknown;
}) {
  const Component = as as "div";
  const classNameValue = cn(
    "flex h-full flex-row flex-nowrap items-center gap-4",
    justify === "start" &&
      `
        data-[justify=start]:grow data-[justify=start]:basis-0
        data-[justify=start]:justify-start
      `,
    justify === "center" &&
      `
        data-[justify=center]:grow data-[justify=center]:basis-0
        data-[justify=center]:justify-center
      `,
    justify === "end" &&
      `
        data-[justify=end]:grow data-[justify=end]:basis-0
        data-[justify=end]:justify-end
      `,
    className,
  );

  return (
    <Component
      className={classNameValue}
      data-justify={justify}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}

export const NavbarItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<"li">
>(({ className, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn(
        `
          box-border list-none text-base whitespace-nowrap
          data-[active=true]:font-semibold
        `,
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
});
NavbarItem.displayName = "NavbarItem";
