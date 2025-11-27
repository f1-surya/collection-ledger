import { format, isThisMonth } from "date-fns";
import {
  Calendar,
  Check,
  Copy,
  LoaderCircle,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { markConnectionAsPaid } from "@/db/payments";
import { tryCatch } from "@/lib/try-catch";
import type { Connection } from "./columns";

interface Props {
  connection?: Connection;
  onOpenChange: Dispatch<SetStateAction<Connection | undefined>>;
  callback: (connectionId: string) => void;
}

export default function ConnectionDetails({
  connection,
  onOpenChange,
  callback,
}: Props) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [markingAsPaid, setMarkingAsPaid] = useState(false);

  if (!connection) return;

  const paidThisMonth = connection.lastPayment
    ? isThisMonth(connection.lastPayment)
    : false;

  const handleCopyPhone = async () => {
    if (connection?.phoneNumber) {
      await navigator.clipboard.writeText(connection.phoneNumber);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const markAsPaid = async () => {
    if (!connection) return;
    setMarkingAsPaid(true);
    const { error } = await tryCatch(markConnectionAsPaid(connection.id));
    setMarkingAsPaid(false);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    callback(connection.id);
    toast.success("Successfully marked as paid");
  };

  return (
    <Dialog
      open={connection !== undefined}
      onOpenChange={() => onOpenChange(undefined)}
    >
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row justify-between">
          <div className="text-start">
            <DialogTitle className="text-xl">{connection.name}</DialogTitle>
            <DialogDescription
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() =>
                navigator.clipboard.writeText(connection.boxNumber)
              }
            >
              SMC #{connection.boxNumber}
            </DialogDescription>
          </div>
          <Link href={`/dashboard/connections/${connection.boxNumber}`}>
            <Button size="icon" className="mr-4">
              <User />
            </Button>
          </Link>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-muted-foreground" />
            <span className="font-medium">{connection.area.name}</span>
          </div>

          {/* Base Pack Information */}
          <div className="border rounded-lg p-3 bg-muted/30">
            <h3 className="font-semibold text-sm text-primary mb-2">
              {connection.basePack.name}
            </h3>
            <div className="flex justify-between text-sm font-semibold">
              <p>LCO price: ₹{connection.basePack.lcoPrice}</p>
              <p>MRP: ₹{connection.basePack.customerPrice}</p>
            </div>
          </div>

          {connection?.phoneNumber && (
            <div className="border rounded-lg p-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Phone
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Contact Number
                    </p>
                    <p className="font-mono text-sm font-semibold">
                      {connection.phoneNumber}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPhone}
                  className="h-8 px-3 bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800"
                >
                  {copiedPhone ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                  <span className="ml-1 text-xs">
                    {copiedPhone ? "Copied!" : "Copy"}
                  </span>
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Last Payment:</span>
            <span className="font-medium">
              {connection.lastPayment
                ? format(connection.lastPayment, "dd MMM yyyy")
                : "No payment recorded"}
            </span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button
            onClick={markAsPaid}
            disabled={markingAsPaid || paidThisMonth}
          >
            {markingAsPaid ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Mark as paid"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
