"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Text,
} from "recharts";
import { MatchResult } from "~/lib/utils/matchResult";

const radius = 5;

export function RankCountChart({
  matchResult,
  userProfileId,
}: {
  matchResult: MatchResult;
  userProfileId: string;
}) {
  const data = matchResult[userProfileId].rankCounts.map((count, index) => ({
    name: `${index + 1}`,
    value: count,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <XAxis dataKey="value" type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
          unit={"着"}
          interval={0}
          tick={<CustomTick />}
          width={28}
        />
        <Bar
          className="fill-secondary"
          dataKey="value"
          radius={[0, radius, radius, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTick(props: any) {
  return (
    <Text {...props} className="fill-default-400 text-tiny">
      {`${props.payload.value}着`}
    </Text>
  );
}
