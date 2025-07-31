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
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioData {
  date: string;
  value: number;
}

export function PerformanceChart() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<PortfolioData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/portfolio/linechart"
        );
        if (!response.ok) throw new Error("Failed to fetch portfolio data");

        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dateRangeLabels: Record<string, string> = {
    "7d": "past week",
    "30d": "past month",
    "90d": "past 3 months",
    "365d": "past year",
    nd: "all time",
  };

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (timeRange === "nd" || chartData.length === 0) return chartData;

    const referenceDate = new Date(chartData[chartData.length - 1].date);
    let daysToSubtract = 90;

    if (timeRange === "365d") daysToSubtract = 365;
    else if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [chartData, timeRange]);

  // Calculate performance metrics
  const { totalChange, percentageChange } = React.useMemo(() => {
    if (filteredData.length === 0)
      return { totalChange: 0, percentageChange: 0 };

    const firstValue = filteredData[0].value;
    const lastValue = filteredData[filteredData.length - 1].value;
    const totalChange = lastValue - firstValue;
    const percentageChange =
      firstValue !== 0 ? (totalChange / firstValue) * 100 : 0;

    return { totalChange, percentageChange };
  }, [filteredData]);

  const isPositive = totalChange >= 0;
  const changeColor = isPositive ? "#0f9d58" : "#db4437"; // Green for gains, red for losses

  if (loading) return <Skeleton className="w-full h-full" />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (chartData.length === 0)
    return <div className="p-4">No portfolio data available</div>;

  return (
    <Card className="pt-0 h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>
            Performance over the {dateRangeLabels[timeRange]}
          </CardDescription>
          <div style={{ color: changeColor, fontSize: 14 }}>
            {totalChange >= 0 ? "+" : "-"}${Math.abs(totalChange).toFixed(2)} (
            {percentageChange >= 0 ? "+" : "-"}
            {Math.abs(percentageChange).toFixed(2)}%)
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
          <ToggleGroupItem value="nd">All</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{ value: { label: "Portfolio Value", color: changeColor } }}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={changeColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={changeColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f0f0f0"
            />
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
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={60}
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;

                return (
                  <div className="bg-white p-3 rounded shadow border">
                    <p className="font-medium">
                      {new Date(label).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm">
                      Value: ${payload[0].value?.toFixed(2)}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={changeColor}
              strokeWidth={2}
              fill="url(#fillValue)"
              fillOpacity={1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
