"use client";

import { Pie, PieChart } from "recharts";

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

export const description = "A pie chart with a label list";

const chartData = [
  { ticker: "aapl", value: 275, fill: "var(--color-blue-100)" },
  { ticker: "tsla", value: 200, fill: "var(--color-blue-200)" },
  { ticker: "nvda", value: 187, fill: "var(--color-blue-300)" },
  { ticker: "msft", value: 173, fill: "var(--color-blue-400)" },
  { ticker: "amzn", value: 123, fill: "var(--color-blue-500)" },
  { ticker: "others", value: 90, fill: "var(--color-blue-600)" },
];

const generateChartConfig = (data: typeof chartData): ChartConfig => {
  const config: ChartConfig = {
    value: {
      label: "Value", 
    },
  };

  data.forEach((item) => {
    config[item.ticker] = {
      label: item.ticker != "others" ? item.ticker.toUpperCase() : "Others", 
      color: item.fill, 
    };
  });
  return config;
};

export function PortfolioChart() {
  const chartConfig = generateChartConfig(chartData);
  const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 Current Holdings Portfolio Distribution</CardTitle>
        <CardDescription>Equities Holdings Cross-Section</CardDescription>
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

              const value = payload[0].payload.value;
              const ticker = payload[0].payload.ticker;
              const percentage = totalValue > 0
                ? ((value / totalValue) * 100).toFixed(1) // Formats to one decimal place
                : "0.0"; // Handle division by zero

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
                  <strong><div>{chartConfig[ticker as keyof typeof chartConfig]?.label || ticker.toUpperCase()}</div></strong>
                  <div>${value} USD</div>
                  <div>{percentage}%</div>
                </div>
              );
            }}
            />
            <Pie data={chartData} dataKey="value" />
            <ChartLegend
              content={<ChartLegendContent nameKey="ticker" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
          
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
