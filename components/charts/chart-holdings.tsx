"use client";

import { TrendingUp } from "lucide-react";
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

export const description = "A bar chart showing holdings' performance";

const chartData = [
  {
    ticker: "AAPL",
    value: 32000,
    prev_value: 30000,
    fixed_change: 2000,
    percentage_change: 6.7,
  },
  {
    ticker: "TSLA",
    value: 24000,
    prev_value: 26000,
    fixed_change: -2000,
    percentage_change: -7.7,
  },
  {
    ticker: "GOOGL",
    value: 18000,
    prev_value: 17500,
    fixed_change: 500,
    percentage_change: 2.9,
  },
  {
    ticker: "AMZN",
    value: 15000,
    prev_value: 14500,
    fixed_change: 500,
    percentage_change: 3.4,
  },
  {
    ticker: "MSFT",
    value: 11000,
    prev_value: 12500,
    fixed_change: -1500,
    percentage_change: -12.0,
  },
];

const chartConfig = {
  percentage_change: {
    label: "Change (%)",
  },
} satisfies ChartConfig;

export function ChartHoldings() {
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
      <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
        <div className="flex gap-2 leading-none font-medium">
          Overall {overallChangePct}% change in portfolio this last month
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing percentage change across top holdings
        </div>
      </CardFooter>
    </Card>
  );
}
