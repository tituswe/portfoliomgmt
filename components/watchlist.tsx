"use client";

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

export const description = "Watchlist";

export function Watchlist() {
  return (
    <Card className="h-[480px]">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>Your tracked assets will appear here</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[300px]">
        <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
          <div>
            <p className="font-medium">Feature in development</p>
            <p className="text-sm">Coming soon</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Track your favorite assets
        </div>
        <div className="text-muted-foreground leading-none">
          Add stocks to monitor
        </div>
      </CardFooter>
    </Card>
  );
}
