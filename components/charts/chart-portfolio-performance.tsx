"use client";

import * as React from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const chartData = [
  { date: "2024-04-01", value: 5000 },
  { date: "2024-04-02", value: 4950 },
  { date: "2024-04-03", value: 5100 },
  { date: "2024-04-04", value: 5300 },
  { date: "2024-04-05", value: 5250 },
  { date: "2024-04-06", value: 5400 },
  { date: "2024-04-07", value: 5200 },
  { date: "2024-04-08", value: 5450 },
  { date: "2024-04-09", value: 5600 },
  { date: "2024-04-10", value: 5350 },
  { date: "2024-04-11", value: 5500 },
  { date: "2024-04-12", value: 5700 },
  { date: "2024-04-13", value: 5900 },
  { date: "2024-04-14", value: 5750 },
  { date: "2024-04-15", value: 6000 },
  { date: "2024-04-16", value: 5800 },
  { date: "2024-04-17", value: 5600 },
  { date: "2024-04-18", value: 5850 },
  { date: "2024-04-19", value: 6100 },
  { date: "2024-04-20", value: 5900 },
  { date: "2024-04-21", value: 6050 },
  { date: "2024-04-22", value: 6300 },
  { date: "2024-04-23", value: 6200 },
  { date: "2024-04-24", value: 6450 },
  { date: "2024-04-25", value: 6100 },
  { date: "2024-04-26", value: 6000 },
  { date: "2024-04-27", value: 6150 },
  { date: "2024-04-28", value: 5900 },
  { date: "2024-04-29", value: 6100 },
  { date: "2024-04-30", value: 6350 },
  { date: "2024-05-01", value: 6200 },
  { date: "2024-05-02", value: 6400 },
  { date: "2024-05-03", value: 6600 },
  { date: "2024-05-04", value: 6450 },
  { date: "2024-05-05", value: 6800 },
  { date: "2024-05-06", value: 7000 },
  { date: "2024-05-07", value: 6750 },
  { date: "2024-05-08", value: 6900 },
  { date: "2024-05-09", value: 6700 },
  { date: "2024-05-10", value: 7050 },
  { date: "2024-05-11", value: 7250 },
  { date: "2024-05-12", value: 7400 },
  { date: "2024-05-13", value: 7100 },
  { date: "2024-05-14", value: 6950 },
  { date: "2024-05-15", value: 7150 },
  { date: "2024-05-16", value: 7350 },
  { date: "2024-05-17", value: 7600 },
  { date: "2024-05-18", value: 7300 },
  { date: "2024-05-19", value: 7450 },
  { date: "2024-05-20", value: 7200 },
  { date: "2024-05-21", value: 7000 },
  { date: "2024-05-22", value: 6800 },
  { date: "2024-05-23", value: 7100 },
  { date: "2024-05-24", value: 7300 },
  { date: "2024-05-25", value: 7600 },
  { date: "2024-05-26", value: 7400 },
  { date: "2024-05-27", value: 7700 },
  { date: "2024-05-28", value: 7950 },
  { date: "2024-05-29", value: 7650 },
  { date: "2024-05-30", value: 7400 },
  { date: "2024-05-31", value: 7600 },
  { date: "2024-06-01", value: 7800 },
  { date: "2024-06-02", value: 8100 },
  { date: "2024-06-03", value: 8300 },
  { date: "2024-06-04", value: 8000 },
  { date: "2024-06-05", value: 8200 },
  { date: "2024-06-06", value: 8450 },
  { date: "2024-06-07", value: 8250 },
  { date: "2024-06-08", value: 8000 },
  { date: "2024-06-09", value: 7700 },
  { date: "2024-06-10", value: 7500 },
  { date: "2024-06-11", value: 7750 },
  { date: "2024-06-12", value: 7950 },
  { date: "2024-06-13", value: 7700 },
  { date: "2024-06-14", value: 7900 },
  { date: "2024-06-15", value: 7600 },
  { date: "2024-06-16", value: 7350 },
  { date: "2024-06-17", value: 7100 },
  { date: "2024-06-18", value: 7350 },
  { date: "2024-06-19", value: 7550 },
  { date: "2024-06-20", value: 7800 },
  { date: "2025-06-21", value: 8100 },
  { date: "2024-06-22", value: 7900 },
  { date: "2024-06-23", value: 7650 },
  { date: "2024-06-24", value: 7850 },
  { date: "2024-06-25", value: 8100 },
  { date: "2024-06-26", value: 8350 },
  { date: "2024-06-27", value: 8600 },
  { date: "2024-06-28", value: 8400 },
  { date: "2024-06-29", value: 8650 },
  { date: "2024-06-30", value: 8800 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
};

export function ChartPortfolioPerformance() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const isUp =
    filteredData.length > 1 &&
    filteredData[filteredData.length - 1].value >= filteredData[0].value;
  const strokeColor = isUp ? "#16a34a" : "#dc2626";
  const gradientId = isUp ? "fillGreen" : "fillRed";

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Portfolio Value</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Your portfolio performance over time
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
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
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={60}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill={`url(#${gradientId})`}
              stroke={strokeColor}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
