"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/types";

// Mock data
const generateMockTransactions = (count = 5): Transaction[] => {
  const stocks = [
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "GOOGL", name: "Alphabet Inc." },
    { ticker: "MSFT", name: "Microsoft Corporation" },
    { ticker: "AMZN", name: "Amazon.com Inc." },
    { ticker: "TSLA", name: "Tesla Inc." },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `mock-${i}`,
    ticker: stocks[i % stocks.length].ticker,
    stockName: stocks[i % stocks.length].name,
    quantity: Math.floor(Math.random() * 100) + 1,
    transactionPrice: Math.random() * 500 + 50,
    transactionTime: new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

interface TransactionTableProps {
  transactions?: Transaction[];
  isLoading?: boolean;
}

export function TransactionTable({
  transactions,
  isLoading,
}: TransactionTableProps) {
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!transactions) {
      const timer = setTimeout(() => {
        setLocalTransactions(generateMockTransactions(8));
        setLocalLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setLocalLoading(false);
    }
  }, [transactions]);

  const displayTransactions = transactions || localTransactions;
  const displayLoading = isLoading || localLoading;

  if (displayLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <Table>
      <TableCaption>Your recent transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead>Stock Name</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Date/Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-medium">{transaction.ticker}</TableCell>
            <TableCell>{transaction.stockName}</TableCell>
            <TableCell className="text-right">{transaction.quantity}</TableCell>
            <TableCell className="text-right">
              ${transaction.transactionPrice.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              {new Date(transaction.transactionTime).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
