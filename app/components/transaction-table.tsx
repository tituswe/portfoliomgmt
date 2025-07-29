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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/types";

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

  const handleDelete = async (transactionId: string) => {
    // try {
    //   const response = await fetch(
    //     `http://127.0.0.1:8000/transactions/${transactionId}`,
    //     {
    //       method: "DELETE",
    //     }
    //   );
    //   if (!response.ok) throw new Error("Delete failed");
    // } catch (error) {
    //   console.error("Delete error:", error);
    //   setError("Failed to delete transaction");
    // }
  };

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const handleEdit = (transactionId: string) => {
    const transactionToEdit = transactions.find((t) => t.id === transactionId);
    if (transactionToEdit) {
      setEditingTransaction(transactionToEdit);
      // Open your edit modal/dialog here
      console.log("Editing transaction:", transactionToEdit);
    }
  };

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
      <CardHeader className="items-center pb-4">
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Your current stock positions</CardDescription>
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
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Settings</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEdit(transaction.id)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(transaction.id)}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
