"use client";

import { Button } from "@nextui-org/react";

export default function MatchAddButton({ className }: { className?: string }) {
  return (
    <Button className={className} fullWidth color="primary">
      結果を入力する
    </Button>
  );
}
