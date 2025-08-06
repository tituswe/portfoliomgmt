"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Transaction } from "@/lib/types";
import { updateTransaction } from "@/lib/api";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

const formSchema = z.object({
  ticker: z.string().min(1, "Ticker is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 0"),
  price: z.number().min(1, "Price must be at least 0"),
  transaction_date: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateTransactionButtonProps {
  transaction: Transaction;
}

export function UpdateTransactionButton({
  transaction,
}: UpdateTransactionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isBuy, setIsBuy] = useState(transaction.quantity >= 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...transaction,
      quantity: Math.abs(transaction.quantity),
      transaction_date: new Date(transaction.transaction_date)
        .toISOString()
        .split("T")[0],
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const transactionUpdate: Transaction = {
        ...values,
        id: transaction.id,
        transaction_date: new Date(values.transaction_date).toISOString(),
      };
      await updateTransaction(transactionUpdate, isBuy);
      window.location.href = "/";
    } catch (err) {
      toast(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer focus:bg-gray-100"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update your transaction</DialogTitle>
            <DialogDescription>
              Update the details of the transaction you want to log.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ticker">Ticker</Label>
              <Input
                id="ticker"
                placeholder="AAPL"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.value = input.value.toUpperCase();
                }}
                {...register("ticker")}
              />
              {errors.ticker && (
                <p className="text-sm text-red-500">{errors.ticker.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="quantity"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0"
                  {...register("quantity", { valueAsNumber: true })}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">
                    {errors.quantity.message}
                  </p>
                )}
                <Badge
                  variant={"secondary"}
                  className={isBuy ? "text-green-600" : "text-red-600"}
                >
                  {isBuy ? "Buy" : "Sell"}
                </Badge>
                <Switch
                  id="buy-sell"
                  checked={isBuy}
                  onCheckedChange={setIsBuy}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="any"
                placeholder="$150.00"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction_date">Transaction Date</Label>
              <Input
                id="transaction_date"
                type="date"
                {...register("transaction_date")}
              />
              {errors.transaction_date && (
                <p className="text-sm text-red-500">
                  {errors.transaction_date.message}
                </p>
              )}
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
