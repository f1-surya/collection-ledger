"use client";

import { format, isThisMonth } from "date-fns";
import {
  AlertCircle,
  Calendar,
  Check,
  Copy,
  Edit,
  LoaderCircle,
  MapPin,
  Phone,
  UserPen,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import type { Area } from "@/app/dashboard/areas/_components/areas";
import type { BasePack } from "@/app/dashboard/base-packs/_components/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetcher } from "@/lib/fetcher";
import type { Connection } from "../../_components/columns";
import PaymentsHistory from "./payments";
import type { Payment } from "./types";
import type { ConnectionUpdateSchema } from "./update-connection";
import UpdateConnection from "./update-connection";

export function Details({
  currConnection,
  currPayments,
}: {
  currConnection: Connection;
  currPayments: Payment[];
}) {
  const [connection, setConnection] = useState(currConnection);
  const [payments, setPayments] = useState(currPayments);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [markingAsPaid, setMarkingAsPaid] = useState(false);
  const [basePackOpen, setBasePackOpen] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedPack, setSelectedPack] = useState<BasePack | undefined>();
  const { data } = useSWR<BasePack[]>("/api/packs", fetcher);

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

    const res = await fetch(`/api/payment?connectionId=${connection.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setMarkingAsPaid(false);

    if (!res.ok) {
      const error = await res.json();
      console.error(error);
      toast.error(error.message);
    } else {
      const newPayment: Payment = await res.json();
      setConnection({ ...connection, lastPayment: newPayment.date });
      setPayments([newPayment, ...payments]);
    }
  };

  const onPackSelect = (id: string) => {
    setBasePackOpen(false);

    const packId = Number(id);
    if (packId === connection.basePack.id) return;

    setSelectedPack(data?.find((pack) => pack.id === packId));
  };

  const migrate = async () => {
    if (!selectedPack) return;
    setMigrating(true);

    const res = await fetch(
      `/api/migrate?connectionId=${connection.id}&to=${selectedPack.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (res.ok) {
      const payment: Payment = await res.json();
      if (paidThisMonth) {
        setPayments(payments.map((p) => (p.id === payment.id ? payment : p)));
      } else {
        setPayments([payment, ...payments]);
      }
      setConnection({
        ...connection,
        // @ts-expect-error
        basePack: payment.to,
        lastPayment: payment.date,
      });
      setSelectedPack(undefined);
    } else {
      toast.error("Something went wrong while migrating.");
    }
    setMigrating(false);
  };

  const deletePayment = async (id: number) => {
    const promise = fetch(`/api/payment?paymentId=${id}`, {
      method: "DELETE",
    });

    toast.promise(promise, {
      loading: "Deleting payment...",
      success: "Payment deleted successfully.",
      error: "Something went wrong while deleting the payment.",
    });

    if ((await promise).ok) {
      const payment = payments.find((p) => p.id === id);
      const updatedPayments = payments.filter((p) => p.id !== id);
      setPayments(updatedPayments);
      const lastPayment = updatedPayments[0];
      if (lastPayment) {
        setConnection({
          ...connection,
          basePack: lastPayment.to ?? lastPayment.currentPack,
          lastPayment: lastPayment.date,
        });
      } else if (payment) {
        setConnection({
          ...connection,
          basePack: payment.currentPack,
          lastPayment: undefined,
        });
      }
    }
  };

  const handleUpdateConnection = (data: ConnectionUpdateSchema, area: Area) => {
    setConnection({
      ...connection,
      name: data.name,
      phoneNumber: data.phoneNumber,
      boxNumber: data.boxNumber,
      area,
    });
    setEdit(false);
  };

  return (
    <main className="m-4 flex flex-col md:flex-row md:justify-between gap-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {connection.name}
          </CardTitle>
          <CardDescription>SMC: #{connection.boxNumber}</CardDescription>
          <CardAction>
            <Button onClick={() => setEdit(true)}>
              <UserPen />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Area */}
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <span className="font-medium">{connection.area.name}</span>
            <Badge variant="secondary" className="text-xs">
              Area #{connection.area.id}
            </Badge>
          </div>

          {/* Phone Number */}
          {connection.phoneNumber && (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
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
                className="h-8 px-3 bg-transparent"
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
          )}

          {/* Base Pack */}
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex flex-row justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-primary mb-2">
                {connection.basePack.name}
              </h3>
              <Popover open={basePackOpen} onOpenChange={setBasePackOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    <Edit size={12} className="mr-1" />
                    Change
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search base packs..." />
                    <CommandList>
                      <CommandEmpty>No base pack found.</CommandEmpty>
                      <CommandGroup>
                        {(data ?? []).map((pack) => (
                          <CommandItem
                            key={pack.id}
                            value={pack.id.toString()}
                            onSelect={onPackSelect}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{pack.name}</p>
                              <p className="text-xs text-muted-foreground">
                                LCO: ₹{pack.lcoPrice} • MRP: ₹
                                {pack.customerPrice}
                              </p>
                            </div>
                            {connection.basePack.id === pack.id && (
                              <Check size={16} className="text-primary" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex justify-between text-sm font-semibold">
              <p>LCO: ₹{connection.basePack.lcoPrice}</p>
              <p>MRP: ₹{connection.basePack.customerPrice}</p>
            </div>
          </div>

          {/* Last Payment */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Last Payment:</span>
            <span className="font-medium">
              {connection.lastPayment
                ? format(connection.lastPayment, "dd MMM yyyy")
                : "No payment recorded"}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex-row-reverse">
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
        </CardFooter>
      </Card>
      <PaymentsHistory payments={payments} deletePayment={deletePayment} />
      <AlertDialog
        open={selectedPack !== undefined}
        onOpenChange={() => setSelectedPack(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" />
              Confirm Base Pack Migration
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              Are you sure you want to change the base pack for{" "}
              <strong>{connection.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">{connection.basePack.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium text-primary">
                {selectedPack?.name}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded border">
              <p className="font-medium text-red-700 dark:text-red-300 mb-1">
                Current Pack
              </p>
              <p className="text-xs">LCO: ₹{connection.basePack.lcoPrice}</p>
              <p className="text-xs">
                MRP: ₹{connection.basePack.customerPrice}
              </p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border">
              <p className="font-medium text-green-700 dark:text-green-300 mb-1">
                New Pack
              </p>
              <p className="text-xs">LCO: ₹{selectedPack?.lcoPrice}</p>
              <p className="text-xs">MRP: ₹{selectedPack?.customerPrice}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This action will create a migration record and update the customer's
            billing.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={migrate}
              className="bg-primary"
              disabled={migrating}
            >
              {migrating ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Confirm migration"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <UpdateConnection
        open={edit}
        onOpenChange={setEdit}
        connection={connection}
        callback={handleUpdateConnection}
      />
    </main>
  );
}
