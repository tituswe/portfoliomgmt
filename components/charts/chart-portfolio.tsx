"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Legend, Pie, PieChart } from "recharts";

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

export const description = "A donut chart showing portfolio allocation";

const chartData = [
  { ticker: "AAPL", value: 32000, fill: "var(--chart-1)" },
  { ticker: "TSLA", value: 24000, fill: "var(--chart-2)" },
  { ticker: "GOOGL", value: 18000, fill: "var(--chart-3)" },
  { ticker: "AMZN", value: 15000, fill: "var(--chart-4)" },
  { ticker: "MSFT", value: 11000, fill: "var(--chart-5)" },
];

const chartConfig = chartData.reduce((config, item, index) => {
  config[item.ticker] = {
    label: item.ticker,
    color: item.fill,
  };
  return config;
}, {} as ChartConfig);

export function ChartPortfolio() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Based on current market value</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="ticker"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          ${totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Value
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Legend
              className="pt-6"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-auto">
        {(() => {
          const leader = chartData.reduce((prev, curr) =>
            curr.value > prev.value ? curr : prev
          );
          const percentage = ((leader.value / totalValue) * 100).toFixed(1);

          return (
            <div className="flex items-center gap-2 leading-none font-medium">
              {leader.ticker} leading portfolio by {percentage}%
              <TrendingUp className="h-4 w-4" />
            </div>
          );
        })()}
        <div className="text-muted-foreground leading-none">
          Showing portfolio breakdown by asset
        </div>
      </CardFooter>
    </Card>
  );
}
