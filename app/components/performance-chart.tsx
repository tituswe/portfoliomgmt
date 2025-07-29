"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", value: 222, mobile: 150 },
  { date: "2024-04-02", value: 97, mobile: 180 },
  { date: "2024-04-03", value: 167, mobile: 120 },
  { date: "2024-04-04", value: 242, mobile: 260 },
  { date: "2024-04-05", value: 373, mobile: 290 },
  { date: "2024-04-06", value: 301, mobile: 340 },
  { date: "2024-04-07", value: 245, mobile: 180 },
  { date: "2024-04-08", value: 409, mobile: 320 },
  { date: "2024-04-09", value: 59, mobile: 110 },
  { date: "2024-04-10", value: 261, mobile: 190 },
  { date: "2024-04-11", value: 327, mobile: 350 },
  { date: "2024-04-12", value: 292, mobile: 210 },
  { date: "2024-04-13", value: 342, mobile: 380 },
  { date: "2024-04-14", value: 137, mobile: 220 },
  { date: "2024-04-15", value: 120, mobile: 170 },
  { date: "2024-04-16", value: 138, mobile: 190 },
  { date: "2024-04-17", value: 446, mobile: 360 },
  { date: "2024-04-18", value: 364, mobile: 410 },
  { date: "2024-04-19", value: 243, mobile: 180 },
  { date: "2024-04-20", value: 89, mobile: 150 },
  { date: "2024-04-21", value: 137, mobile: 200 },
  { date: "2024-04-22", value: 224, mobile: 170 },
  { date: "2024-04-23", value: 138, mobile: 230 },
  { date: "2024-04-24", value: 387, mobile: 290 },
  { date: "2024-04-25", value: 215, mobile: 250 },
  { date: "2024-04-26", value: 75, mobile: 130 },
  { date: "2024-04-27", value: 383, mobile: 420 },
  { date: "2024-04-28", value: 122, mobile: 180 },
  { date: "2024-04-29", value: 315, mobile: 240 },
  { date: "2024-04-30", value: 454, mobile: 380 },
  { date: "2024-05-01", value: 165, mobile: 220 },
  { date: "2024-05-02", value: 293, mobile: 310 },
  { date: "2024-05-03", value: 247, mobile: 190 },
  { date: "2024-05-04", value: 385, mobile: 420 },
  { date: "2024-05-05", value: 481, mobile: 390 },
  { date: "2024-05-06", value: 498, mobile: 520 },
  { date: "2024-05-07", value: 388, mobile: 300 },
  { date: "2024-05-08", value: 149, mobile: 210 },
  { date: "2024-05-09", value: 227, mobile: 180 },
  { date: "2024-05-10", value: 293, mobile: 330 },
  { date: "2024-05-11", value: 335, mobile: 270 },
  { date: "2024-05-12", value: 197, mobile: 240 },
  { date: "2024-05-13", value: 197, mobile: 160 },
  { date: "2024-05-14", value: 448, mobile: 490 },
  { date: "2024-05-15", value: 473, mobile: 380 },
  { date: "2024-05-16", value: 338, mobile: 400 },
  { date: "2024-05-17", value: 499, mobile: 420 },
  { date: "2024-05-18", value: 315, mobile: 350 },
  { date: "2024-05-19", value: 235, mobile: 180 },
  { date: "2024-05-20", value: 177, mobile: 230 },
  { date: "2024-05-21", value: 82, mobile: 140 },
  { date: "2024-05-22", value: 81, mobile: 120 },
  { date: "2024-05-23", value: 252, mobile: 290 },
  { date: "2024-05-24", value: 294, mobile: 220 },
  { date: "2024-05-25", value: 201, mobile: 250 },
  { date: "2024-05-26", value: 213, mobile: 170 },
  { date: "2024-05-27", value: 420, mobile: 460 },
  { date: "2024-05-28", value: 233, mobile: 190 },
  { date: "2024-05-29", value: 78, mobile: 130 },
  { date: "2024-05-30", value: 340, mobile: 280 },
  { date: "2024-05-31", value: 178, mobile: 230 },
  { date: "2024-06-01", value: 178, mobile: 200 },
  { date: "2024-06-02", value: 470, mobile: 410 },
  { date: "2024-06-03", value: 103, mobile: 160 },
  { date: "2024-06-04", value: 439, mobile: 380 },
  { date: "2024-06-05", value: 88, mobile: 140 },
  { date: "2024-06-06", value: 294, mobile: 250 },
  { date: "2024-06-07", value: 323, mobile: 370 },
  { date: "2024-06-08", value: 385, mobile: 320 },
  { date: "2024-06-09", value: 438, mobile: 480 },
  { date: "2024-06-10", value: 155, mobile: 200 },
  { date: "2024-06-11", value: 92, mobile: 150 },
  { date: "2024-06-12", value: 492, mobile: 420 },
  { date: "2024-06-13", value: 81, mobile: 130 },
  { date: "2024-06-14", value: 426, mobile: 380 },
  { date: "2024-06-15", value: 307, mobile: 350 },
  { date: "2024-06-16", value: 371, mobile: 310 },
  { date: "2024-06-17", value: 475, mobile: 520 },
  { date: "2024-06-18", value: 107, mobile: 170 },
  { date: "2024-06-19", value: 341, mobile: 290 },
  { date: "2024-06-20", value: 408, mobile: 450 },
  { date: "2024-06-21", value: 169, mobile: 210 },
  { date: "2024-06-22", value: 317, mobile: 270 },
  { date: "2024-06-23", value: 480, mobile: 530 },
  { date: "2024-06-24", value: 132, mobile: 180 },
  { date: "2024-06-25", value: 141, mobile: 190 },
  { date: "2024-06-26", value: 434, mobile: 380 },
  { date: "2024-06-27", value: 448, mobile: 490 },
  { date: "2024-06-28", value: 149, mobile: 200 },
  { date: "2024-06-29", value: 103, mobile: 160 },
  { date: "2024-06-30", value: 446, mobile: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  value: {
    label: "value",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function PerformanceChart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const dateRangeLabels: Record<string, string> = {
  "7d": "past 1 week",
  "30d": "past 1 month",
  "90d": "past 3 months",
  "365d": "past year",
  "nd": "since inception",
};

  const filteredData = chartData.filter((item) => {
    if (timeRange === "nd") {
      return chartData; // Return all data if "max" is selected
    }

    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange == "365d") {
      daysToSubtract = 365;
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const yAxisDomain = (data: { value: number; }[]) => {
    let minY = Infinity;
    let maxY = -Infinity;

    if (data.length > 0) {
        data.forEach((item: { value: number; }) => {
            minY = Math.min(minY, item.value);
            maxY = Math.max(maxY, item.value);
        });

        const buffer = (maxY - minY) * 0.1;
        minY = Math.floor(minY - buffer);
        maxY = Math.ceil(maxY + buffer);

    } else {
        minY = 0;
        maxY = 100;
    }

    const buffer = (maxY - minY) * 0.1;
    minY = Math.max(Math.floor(minY - buffer), 0);
    maxY = Math.ceil(maxY + buffer);

    // Generate 5 evenly spaced ticks
    const tickCount = 5;
    const range = maxY - minY;
    const step = Math.ceil(range / (tickCount - 1));
    const ticks = Array.from({ length: tickCount }, (_, i) => minY + i * step).map(tick => Math.round(tick / 10) * 10);

    return {
      domain: [0, maxY],
      ticks,
    };
  }

  const firstValue = filteredData[0].value;
  const lastValue = filteredData[filteredData.length - 1].value;
  const isGain = lastValue >= firstValue;
  const totalGain = lastValue - firstValue;
  const percentageGain = firstValue !== 0 ? (totalGain / firstValue) * 100 : 0;

  const gainColor = isGain ? "#0f9d58" : "#db4437";

  return (
    <Card className="pt-0 h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>
            Total return over the {dateRangeLabels[timeRange]}
          </CardDescription>
          <div style={{ color: gainColor, fontSize: 14}}>
            {totalGain >= 0 ? "+" : "-"}${Math.abs(totalGain).toFixed(2)} (
            {percentageGain >= 0 ? "+" : "-"}
            {Math.abs(percentageGain).toFixed(2)}%)
          </div>
        </div>
        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={setTimeRange}
          className="flex *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:hidden"
        >
          <ToggleGroupItem value="7d">1W</ToggleGroupItem>
          <ToggleGroupItem value="30d">1M</ToggleGroupItem>
          <ToggleGroupItem value="90d">3M</ToggleGroupItem>
          <ToggleGroupItem value="365d">1Y</ToggleGroupItem>
          <ToggleGroupItem value="nd">Max</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillvalue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stroke={gainColor}
                  fill={gainColor}
                  fillOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stroke={gainColor}
                  fill={gainColor}
                  fillOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
            <YAxis 
              domain={yAxisDomain(filteredData).domain} 
              ticks={yAxisDomain(filteredData).ticks}
            /> 
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;

              // payload[0] contains the hovered data point info
              const value = payload[0].value;

              // Format date label
              const date = new Date(label).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  style={{
                    background: "white",
                    padding: "8px 12px",
                    borderRadius: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    fontSize: 12,
                    color: "#000",
                    pointerEvents: "none",
                  }}
                >
                  <div>{date}</div>
                  <div>${value} USD</div>
                </div>
              );
            }}
            />
            <Area
              dataKey="value"
              type="natural"
              stroke={gainColor}
              fill={gainColor}
              fillOpacity={0.2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
