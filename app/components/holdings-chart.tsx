"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { TrendingDown, TrendingUp } from "lucide-react"

const chartData = [
  { ticker: "aapl", value: 186, prev_value: 180},
  { ticker: "tsla", value: 205, prev_value: 230 },
  { ticker: "nvdia", value: 300, prev_value: 290},
  { ticker: "msft", value: 173, prev_value: 180 },
  { ticker: "amzn", value: 209, prev_value: 198 },
]

const totalData = {
  value: 3000, 
  prev_value: 2800,
}

const chartConfig = {
  value: {
    label: "% Change",
  },
} satisfies ChartConfig


const generateDataValues = (data: typeof chartData) => {
  const updatedChartData = data.map((item) => {
    const fixed_change = item.value - item.prev_value;
    const percentage = item.prev_value !== 0
      ? ((fixed_change / item.prev_value) * 100).toFixed(2)
      : '0.00'; 

    return {
      ...item, 
      fixed_change: fixed_change,
      percentage: percentage,    
    };
  });

  return updatedChartData;
};

export function HoldingsChart() {
  const updatedChartData = generateDataValues(chartData); 

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Top 5 Holdings' Performance</CardTitle>
        <CardDescription>Past 1 Month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="flex-1">
          <BarChart accessibilityLayer data={updatedChartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <ReferenceLine y={0} stroke="#888888" strokeWidth={2} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const fixed_change = payload[0].payload.fixed_change;
              const percentage = payload[0].payload.percentage;
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
                  {fixed_change > 0 ? <div>${fixed_change} USD</div> : <div>-${Math.abs(fixed_change)} USD</div>}
                  <div>{percentage}%</div>
                </div>
              );
            }}
            />
            <Bar dataKey="fixed_change">
              <LabelList position="top" dataKey="ticker" fillOpacity={1} strokeWidth={0.5} formatter={(value : string) => value.toUpperCase()}/>
              {updatedChartData.map((item, index) => (
                <Cell
                  key={item.ticker || index} 
                  fill={item.fixed_change > 0 ? "rgba(15, 157, 88, 0.4)" : "rgba(219, 68, 55, 0.4)"}
                  stroke={item.fixed_change > 0 ? "#0f9d58" : "#db4437"}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {totalData.value > totalData.prev_value ? 
          <div className="flex items-center gap-2 leading-none font-medium"> Overall Portfolio up by {Math.abs((totalData.value - totalData.prev_value)/totalData.prev_value).toFixed(2)}% this past month <TrendingUp className="text-green-600"/>  </div> 
        : <div className="flex items-center gap-2 leading-none font-medium"> Overall Portfolio down by -{Math.abs((totalData.value - totalData.prev_value)/totalData.prev_value).toFixed(2)}% this past month <TrendingDown className="text-red-600"/> </div> 
        }
      </CardFooter>
    </Card>
  )
}
