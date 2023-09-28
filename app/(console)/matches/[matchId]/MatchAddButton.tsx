"use client";

import { Button } from "@nextui-org/react";
import { Icon } from "~/components/Icon";

export default function MatchAddButton() {
  return (
    <Button fullWidth variant="ghost">
      <Icon className="h-6 w-6 fill-current" name="add" />
    </Button>
  );
}
