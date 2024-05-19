"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Text,
} from "recharts";

// Override console.error
// This is a hack to suppress the warning about missing defaultProps in recharts library as of version 2.12
// @link https://github.com/recharts/recharts/issues/3615
// eslint-disable-next-line no-console
const error = console.error;
// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const radius = 5;

export function RankCountChart({
  matchResult,
  userProfileId,
}: {
  matchResult: {
    [profileId: string]: {
      rankCounts: number[];
      averageRank: number;
      totalPoints: number;
    };
  };
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
