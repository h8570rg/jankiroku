"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";

export function NavigationCard({
  matchId,
  children,
}: {
  matchId: string;
  children: React.ReactNode;
}) {
  const { push } = useRouter();

  return (
    <Card fullWidth isPressable onPress={() => push(`/matches/${matchId}`)}>
      {children}
    </Card>
  );
}
