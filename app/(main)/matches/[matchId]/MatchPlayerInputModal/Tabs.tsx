"use client";

import { Tab, Tabs } from "@/components/Tabs";

export function PlayerTypeTabs({
  userTab,
  anonymousTab,
}: {
  userTab: React.ReactNode;
  anonymousTab: React.ReactNode;
}) {
  return (
    <Tabs
      classNames={{
        panel: "min-h-0",
      }}
      fullWidth
      radius="lg"
      aria-label="プレイヤー選択の選択肢"
    >
      <Tab key="friends" title="ユーザー">
        {userTab}
      </Tab>
      <Tab key="anonymous" title="一般">
        {anonymousTab}
      </Tab>
    </Tabs>
  );
}
