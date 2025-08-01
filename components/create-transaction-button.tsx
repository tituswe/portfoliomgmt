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
import { FilePlus2, Plus } from "lucide-react";
import { createTransaction } from "@/lib/api";

const formSchema = z.object({
  ticker: z.string().min(1, "Ticker is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity must be at least 0"),
  price: z.number().min(1, "Price must be at least 0"),
  transaction_date: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTransactionButton() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      name: "",
      quantity: undefined,
      price: undefined,
      transaction_date: "",
    },
  });

  async function onSubmit(values: FormValues) {
    console.log("Form submitted with values:", values);

    try {
      await createTransaction(values);
      window.location.href = "/";
    } catch (err) {
      console.error("Network or unexpected error:", err);
      alert("An unexpected error occurred");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="h-8">
          <FilePlus2 />
          Log Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a transaction</DialogTitle>
          <DialogDescription>
            Enter the details of the transaction you want to log.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ticker">Ticker</Label>
            <Input id="ticker" placeholder="AAPL" {...register("ticker")} />
            {errors.ticker && (
              <p className="text-sm text-red-500">{errors.ticker.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Apple Inc." {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="any"
              placeholder="0"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
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
  );
}
