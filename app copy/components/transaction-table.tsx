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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Transaction } from "@/lib/types";
import { CreateTransactionButton } from "../../components/create-transaction-button";
import { UpdateTransactionButton } from "./update-transaction-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteTransaction, getTransactions } from "@/lib/api";

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );

  const handleDelete = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      window.location.href = "/transactions";
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTransactions();

        const formattedData = data
          .map((item: Transaction) => ({
            ...item,
            transaction_date: new Date(item.transaction_date).toISOString(),
          }))
          .sort(
            (a, b) =>
              new Date(b.transaction_date).getTime() -
              new Date(a.transaction_date).getTime()
          );

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
    <Card className="h-[calc(100vh-8rem)] flex flex-col pb-0">
      <CardHeader className="relative items-center">
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          Your historical transactions over time
        </CardDescription>
        <div className="absolute top-0 right-6">
          <CreateTransactionButton />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-0 py-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-36 pl-6">Ticker</TableHead>
                <TableHead>Stock Name</TableHead>
                <TableHead className="text-right w-24">Quantity</TableHead>
                <TableHead className="text-right w-32">Price</TableHead>
                <TableHead className="text-right w-48">Date/Time</TableHead>
                <TableHead className="text-right w-24 pr-6"></TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[calc(100vh-17rem)]">
            <Table>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium w-36 pl-6">
                      {transaction.ticker}
                    </TableCell>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell className="text-right w-24">
                      {transaction.quantity}
                    </TableCell>
                    <TableCell className="text-right w-32">
                      ${transaction.price}
                    </TableCell>
                    <TableCell className="text-right w-48">
                      {new Date(transaction.transaction_date).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right w-24 pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <UpdateTransactionButton transaction={transaction} />
                          <DropdownMenuItem
                            onClick={() => {
                              setTransactionToDelete(transaction.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent showCloseButton>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                transaction.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (transactionToDelete) {
                    handleDelete(transactionToDelete);
                    setDeleteDialogOpen(false);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
