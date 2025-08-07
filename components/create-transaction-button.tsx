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
import { FilePlus2 } from "lucide-react";
import { createTransaction } from "@/lib/api";
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { useState } from "react";

const formSchema = z.object({
  ticker: z.string().min(1, "Ticker is required"),
  quantity: z
    .number()
    .refine((val) => val !== 0, { message: "Quantity cannot be 0" }),
  price: z.number().min(0, "Price must be at least $0.00"),
  transaction_date: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateTransactionButton() {
  const [isBuy, setIsBuy] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_date: new Date(Date.now()).toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createTransaction(values, isBuy);
      window.location.href = "/";
    } catch (err) {
      toast(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8">
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
            <Input
              id="ticker"
              placeholder="AAPL"
              {...register("ticker")}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.toUpperCase();
              }}
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
                className={isBuy ? "text-green-600 w-10" : "text-red-600 w-10"}
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
            <div className="relative flex items-center">
              <span className="absolute left-3 text-muted-foreground text-sm">
                $
              </span>
              <Input
                id="price"
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className="pl-5"
                {...register("price", {
                  valueAsNumber: true,
                  onBlur: (e) => {
                    const n = parseFloat(e.target.value);
                    if (!Number.isNaN(n)) {
                      setValue("price", Number(n.toFixed(2)), {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      e.target.value = n.toFixed(2);
                    }
                  },
                })}
              />
            </div>
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
