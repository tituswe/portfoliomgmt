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
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Transaction } from "@/lib/types";
import { deleteTransaction } from "@/lib/api";
import { toast } from "sonner";

export function DeleteTransactionButton({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [open, setOpen] = useState(false);

  const handleDelete = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      window.location.href = "/";
    } catch (err) {
      toast(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer focus:bg-gray-100 text-red-600"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4 text-red-600" />
        Delete
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete(transaction.id);
                setOpen(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
