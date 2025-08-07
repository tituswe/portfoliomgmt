"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";

export const description = "A bar chart showing holdings' performance";

const chartConfig = {
  percentage_change: {
    label: "Change (%)",
  },
} satisfies ChartConfig;

export function ChartHoldings({
  chartData: chartPromise,
}: {
  chartData: Promise<
    {
      ticker: string;
      value: number;
      prev_value: number;
      fixed_change: number;
      percentage_change: number;
    }[]
  >;
}) {
  const chartData = React.use(chartPromise);
  const { percentage_change: largestPercentageChange, ticker: largestTicker } =
    chartData.reduce(
      (max, item) => {
        const currentMagnitude = Math.abs(item.percentage_change);
        const maxMagnitude = Math.abs(max.percentage_change);
        return currentMagnitude > maxMagnitude ? item : max;
      },
      { percentage_change: 0, ticker: "" }
    );

  return (
    <Card className="h-[480px]">
      <CardHeader>
        <CardTitle>Top 5 Performers</CardTitle>
        <CardDescription>Percentage change in the last month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="ticker" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel hideIndicator />}
            />
            <Bar dataKey="percentage_change">
              <LabelList
                dataKey="percentage_change"
                position="top"
                formatter={(val: number) => `${val}%`}
              />
              {chartData.map((item) => (
                <Cell
                  key={item.ticker}
                  fill={item.percentage_change >= 0 ? "#16a34a" : "#dc2626"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm mt-auto">
        <div className="flex gap-2 leading-none font-medium">
          {`${largestTicker} had a ${
            largestPercentageChange >= 0 ? "+" : ""
          }${largestPercentageChange}% change last month`}
          {largestPercentageChange >= 0 ? (
            <TrendingUp className="h-4 w-4" color="#16a34a" />
          ) : (
            <TrendingDown className="h-4 w-4" color="#dc2626" />
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing percentage change across top holdings
        </div>
      </CardFooter>
    </Card>
  );
}
