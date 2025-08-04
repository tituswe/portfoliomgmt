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

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
};

export function ChartPortfolioPerformance({
  chartData: chartPromise,
}: {
  chartData: Promise<{ date: string; value: number }[]>;
}) {
  const chartData = React.use(chartPromise);
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = (() => {
    if (timeRange === "5y" || chartData.length === 0) return chartData;

    const referenceDate = new Date(chartData[chartData.length - 1].date);
    let daysToSubtract = 365;

    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    referenceDate.setDate(referenceDate.getDate() - daysToSubtract);

    return chartData.filter((item) => new Date(item.date) >= referenceDate);
  })();

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
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="1y">Last 1 year</ToggleGroupItem>
            <ToggleGroupItem value="5y">Last 5 years</ToggleGroupItem>
          </ToggleGroup>
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
