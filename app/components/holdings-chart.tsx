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
import { useEffect, useState } from "react"

interface ChartData {
  ticker: string;
  value: number;
  prev_value: number;
}

interface CalculatedData extends ChartData {
  fixed_change: number;
  percentage: string;
}

interface TotalData {
  value: number;
  prev_value: number;
}

// const chartData = [
//   { ticker: "aapl", value: 186, prev_value: 180},
//   { ticker: "tsla", value: 205, prev_value: 230 },
//   { ticker: "nvdia", value: 300, prev_value: 290},
//   { ticker: "msft", value: 173, prev_value: 180 },
//   { ticker: "amzn", value: 209, prev_value: 198 },
// ]

// const totalData = {
//   value: 3000, 
//   prev_value: 2800,
// }

const chartConfig = {
  value: {
    label: "% Change",
  },
} satisfies ChartConfig


const generateDataValues = (data: ChartData[]) : CalculatedData[] => {
  const updatedChartData : CalculatedData[] = data.map((item) => {
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
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalData, setTotalData] = useState<TotalData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const updatedChartData = generateDataValues(chartData); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8000/portfolio/topholdingsperformance"
        );
        if (!response.ok) throw new Error("Failed to fetch holdings data");

        const data = await response.json();
        setChartData(data);

        const totalResponse = await fetch(
          "http://127.0.0.1:8000/portfolio/monthchange"
        );
        if (!totalResponse.ok) throw new Error("Failed to fetch monthly change data");   
        const data2 = await totalResponse.json();
        setTotalData(data2);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };  
    fetchData();
  }, []);

  if (loading)
    return <div className="p-4">Loading holdings data...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (updatedChartData.length === 0) return <div className="p-4">No holdings data available</div>;

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
              const ticker = payload[0].payload.ticker.toUpperCase();
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
                  <strong>{ticker}</strong>
                  {fixed_change > 0 ? <div>${fixed_change?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}</div> : <div>-${Math.abs(fixed_change)?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}</div>}
                  <div>{percentage}% Change</div>
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
      {totalData ? (
        <CardFooter className="flex-col gap-2 text-sm">
          {totalData.value > totalData.prev_value ? 
            <div className="flex items-center gap-2 leading-none font-medium">
              Overall Portfolio up by {Math.abs((totalData.value - totalData.prev_value)/totalData.prev_value).toFixed(2)}% this past month <TrendingUp className="text-green-600"/>  
            </div> 
          : 
            <div className="flex items-center gap-2 leading-none font-medium">
              Overall Portfolio down by {Math.abs((totalData.value - totalData.prev_value)/totalData.prev_value).toFixed(2)}% this past month <TrendingDown className="text-red-600"/> 
            </div> 
          
          }
        </CardFooter>)
        : (
          <CardFooter className="text-muted-foreground text-sm">
            Monthly portfolio data not available
          </CardFooter>
      )}
    </Card>
  )
}
