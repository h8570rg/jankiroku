"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "~/components/Card";

export function MatchCard({ id, date }: { id: string; date: string }) {
  const { push } = useRouter();

  return (
    <Card fullWidth isPressable onPress={() => push(`/matches/${id}`)}>
      <CardHeader>{date}</CardHeader>
    </Card>
  );
}
