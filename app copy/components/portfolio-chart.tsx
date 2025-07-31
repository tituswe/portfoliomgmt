"use client";

import { Pie, PieChart, Cell } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface HoldingData {
  ticker: string;
  value: number;
}

const COLORS = [
  "#8884d8", // Blue
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff8042", // Orange
  "#a4de6c", // Light Green
  "#d0ed57", // Lime
  "#83a6ed", // Light Blue
];

export function PortfolioChart() {
  const [chartData, setChartData] = useState<HoldingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/portfolio/distribution"
        );
        if (!response.ok) throw new Error("Failed to fetch distribution data");

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

  const generateChartConfig = (data: HoldingData[]): ChartConfig => {
    const config: ChartConfig = {
      value: {
        label: "Value",
      },
    };

    data.forEach((item) => {
      config[item.ticker] = {
        label: item.ticker,
        color: COLORS[data.indexOf(item) % COLORS.length],
      };
    });
    return config;
  };

  const chartConfig = generateChartConfig(chartData);
  const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);

  if (loading) return <Skeleton className="w-full h-full" />;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (chartData.length === 0)
    return <div className="p-4">No holdings data available</div>;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Portfolio Distribution</CardTitle>
        <CardDescription>Current holdings by value</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[320px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;

                const value = payload[0].value;
                const ticker = payload[0].name;

                if (typeof value !== "number" || !ticker) return null;
                const percentage =
                  totalValue > 0
                    ? ((value / totalValue) * 100).toFixed(1)
                    : "0.0";

                return (
                  <div className="bg-background p-3 rounded shadow border">
                    <strong>{ticker}</strong>
                    <div>
                      $
                      {value?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div>{percentage}% of Portfolio</div>
                  </div>
                );
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="ticker"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              label={({ ticker }) => (
                <text fontSize={12} x={0} y={0} textAnchor="middle">
                  {ticker}
                </text>
              )}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="ticker" />}
              className="mt-4 flex-wrap justify-center gap-4"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
