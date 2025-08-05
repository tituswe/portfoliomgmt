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
  console.log("Chart Data:", chartData);
  const totalPrevValue = chartData.reduce(
    (sum, item) => sum + item.prev_value,
    0
  );
  const totalCurrentValue = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const overallChangePct = (
    ((totalCurrentValue - totalPrevValue) / totalPrevValue) *
    100
  ).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Holdings' Performance</CardTitle>
        <CardDescription>
          Showing percentage change from the last month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
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
          Overall {overallChangePct}% change in portfolio this last month
          {totalCurrentValue >= totalPrevValue ? (
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
