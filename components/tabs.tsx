"use client";

import { cn } from "@heroui/react";
import { Children, createContext, isValidElement, use, useMemo } from "react";

/**
 * HeroUI Tabs の代替。
 * HeroUI は react-aria-components の SelectionIndicator を使うが、SSR + StrictMode で
 * 初期選択が先頭タブ以外だと underline がずれたままになる。
 * @see https://github.com/adobe/react-spectrum/issues/10570
 */

type TabsContextValue = {
  selectedKey: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = use(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within <Tabs>");
  }
  return context;
}

type TabsRootProps = {
  children: React.ReactNode;
  className?: string;
  selectedKey: string;
  variant?: "primary" | "secondary";
};

function TabsRoot({ children, className, selectedKey, variant: _variant }: TabsRootProps) {
  const value = useMemo(() => ({ selectedKey }), [selectedKey]);

  return (
    <TabsContext value={value}>
      <div className={className}>{children}</div>
    </TabsContext>
  );
}

type TabsListContainerProps = {
  children: React.ReactNode;
  className?: string;
};

function TabsListContainer({ children, className }: TabsListContainerProps) {
  return <div className={cn("border-b border-border", className)}>{children}</div>;
}

type TabsListProps = {
  "aria-label": string;
  children: React.ReactNode;
  className?: string;
};

function TabsList({ "aria-label": ariaLabel, children, className }: TabsListProps) {
  const { selectedKey } = useTabsContext();
  const tabs = Children.toArray(children).filter(isTabElement);
  const selectedIndex = Math.max(
    tabs.findIndex((tab) => tab.props.id === selectedKey),
    0,
  );

  return (
    <div aria-label={ariaLabel} className={cn("relative flex", className)} role="tablist">
      {children}
      {tabs.length > 0 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 h-0.5 bg-accent transition-transform duration-250 ease-out motion-reduce:transition-none"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${selectedIndex * 100}%)`,
          }}
        />
      ) : null}
    </div>
  );
}

function isTabElement(child: React.ReactNode): child is React.ReactElement<{ id: string }> {
  return isValidElement<{ id?: string }>(child) && typeof child.props.id === "string";
}

type TabDomProps = {
  "aria-current"?: "page";
  children: React.ReactNode;
  className?: string;
  "data-selected"?: true;
  href: string;
};

type TabsTabProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  id: string;
  render?: (domProps: TabDomProps) => React.ReactNode;
};

function TabsTab({ children, className, href, id, render }: TabsTabProps) {
  const { selectedKey } = useTabsContext();
  const isSelected = selectedKey === id;
  const domProps: TabDomProps = {
    href,
    className: cn(
      "relative z-1 flex h-8 w-full items-center justify-center px-4 text-center text-sm font-medium outline-none no-highlight",
      "transition-[color,opacity] duration-150 motion-reduce:transition-none",
      "focus-visible:status-focused",
      isSelected ? "text-foreground opacity-100" : "text-muted opacity-100 hover:opacity-70",
      className,
    ),
    children,
    ...(isSelected ? { "aria-current": "page" as const, "data-selected": true as const } : {}),
  };

  return render ? render(domProps) : <a {...domProps}>{children}</a>;
}

type TabsIndicatorProps = {
  className?: string;
};

function TabsIndicator(_props: TabsIndicatorProps) {
  // 移動アニメーションは Tabs.List 側の1本の underline で行う。
  return null;
}

export const Tabs = Object.assign(TabsRoot, {
  ListContainer: TabsListContainer,
  List: TabsList,
  Tab: TabsTab,
  Indicator: TabsIndicator,
});
