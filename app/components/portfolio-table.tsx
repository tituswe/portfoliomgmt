"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Postition } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPortfolio } from "@/lib/api";

export function PortfolioTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Postition[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await getPortfolio();
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-[calc(100vh-8rem)]" />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-[calc(100vh-8rem)] flex flex-col">
      <CardHeader className="relative items-center">
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Your current portfolio holdings</CardDescription>
        <div className="absolute top-0 right-6">
          <Link href="/transactions">
            <Button variant="outline" className="h-8">
              View Transactions
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-0 py-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-24 pl-6">Ticker</TableHead>
                <TableHead>Stock Name</TableHead>
                <TableHead className="text-right w-28">Avg Price</TableHead>
                <TableHead className="text-right w-28">Market Value</TableHead>
                <TableHead className="text-right w-28">Delta</TableHead>
                <TableHead className="text-right w-28">Open P&L</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <Table>
              <TableBody>
                {data.map((transaction) => (
                  <TableRow key={transaction.id} className="h-16">
                    <TableCell className="font-medium w-24 pl-6">
                      {transaction.ticker}
                    </TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell className="text-right w-28">
                      {transaction.avg_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right w-28">
                      {transaction.live_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right w-28">
                      {transaction.pct_delta.toFixed(1)}%
                    </TableCell>
                    <TableCell
                      className={`text-right w-28 ${
                        transaction.pnl >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.pnl.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
