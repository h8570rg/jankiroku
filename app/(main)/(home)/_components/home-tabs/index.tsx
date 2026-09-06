"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs } from "@/components/tabs";

const TABS = [
  { id: "matches", href: "/matches", label: "成績表" },
  { id: "friends", href: "/friends", label: "フレンド" },
] as const;

export function HomeTabs() {
  const pathname = usePathname();
  const selectedKey = pathname === "/friends" ? "friends" : "matches";

  return (
    <Tabs className="mb-4" selectedKey={selectedKey} variant="secondary">
      <Tabs.ListContainer>
        <Tabs.List aria-label="ホーム">
          {TABS.map((tab) => (
            <Tabs.Tab
              key={tab.id}
              href={tab.href}
              id={tab.id}
              render={(domProps) => <Link {...(domProps as React.ComponentProps<typeof Link>)} />}
            >
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
