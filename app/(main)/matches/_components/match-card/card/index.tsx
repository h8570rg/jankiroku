"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/card";

export function NavigationCard({
  matchId,
  children,
}: {
  matchId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Card
      fullWidth
      isPressable
      onPress={() => router.push(`/matches/${matchId}`)}
    >
      {children}
    </Card>
  );
}
