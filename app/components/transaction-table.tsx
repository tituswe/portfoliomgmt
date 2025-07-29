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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/types";
import { CreateTransactionButton } from "./create-transaction-button";

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://127.0.0.1:8000/transactions");
        console.log(response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        const formattedData = result.data.map((item: any) => ({
          id: item.id,
          ticker: item.ticker,
          stockName: item.name,
          quantity: item.quantity,
          transactionPrice: item.price,
          transactionTime: new Date(item.transaction_date).toISOString(),
        }));

        setTransactions(formattedData);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-[400px]" />;
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
    <Card>
      <CardHeader className="relative items-center pb-4">
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Your current stock positions</CardDescription>
        <div className="absolute top-0 right-6">
          <CreateTransactionButton />
        </div>
      </CardHeader>
      <CardContent>
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  {transaction.ticker}
                </TableCell>
                <TableCell>{transaction.stockName}</TableCell>
                <TableCell className="text-right">
                  {transaction.quantity}
                </TableCell>
                <TableCell className="text-right">
                  ${transaction.transactionPrice}
                </TableCell>
                <TableCell className="text-right">
                  {new Date(transaction.transactionTime).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
