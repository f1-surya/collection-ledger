"use client";

import { format, isThisMonth } from "date-fns";
import {
  Calendar,
  Check,
  Copy,
  Edit,
  LoaderCircle,
  MapPin,
  Phone,
  UserPen,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import {
  deletePayment,
  markConnectionAsPaid,
  migrateConnection,
} from "@/actions/payments";
import type { Area } from "@/app/dashboard/areas/_components/areas";
import type { BasePack } from "@/app/dashboard/base-packs/_components/types";
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
import ConnectionAddons from "./connection-addons";
import PaymentsHistory from "./payments";
import type { Payment } from "./types";
import type { ConnectionUpdateSchema } from "./update-connection";

const UpdateConnection = dynamic(() => import("./update-connection"));
const MigrationDialog = dynamic(() => import("./migration-dialog"));

type Addon = {
  id: string;
  name: string;
  lcoPrice: number;
  customerPrice: number;
};

type ConnectionAddon = {
  id: string;
  addon: Addon;
};

type AddonTotals = {
  addonPrices: number;
  addonLcoPrices: number;
};

export function Details({
  currConnection,
  addons,
  connectionAddons,
}: {
  currConnection: Connection;
  addons: Addon[];
  connectionAddons: ConnectionAddon[];
}) {
  const [connection, setConnection] = useState(currConnection);
  const [addonTotals, setAddonTotals] = useState<AddonTotals>({
    addonPrices: currConnection.addonPrices,
    addonLcoPrices: currConnection.addonLcoPrices,
  });
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [markingAsPaid, setMarkingAsPaid] = useState(false);
  const [basePackOpen, setBasePackOpen] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedPack, setSelectedPack] = useState<BasePack | undefined>();
  const { data } = useSWR<BasePack[]>("/api/packs", fetcher);
  const {
    data: payments = [],
    isLoading: paymentsLoading,
    mutate: mutatePayments,
  } = useSWR<Payment[]>(`/api/payment?connectionId=${connection.id}`, fetcher);

  const paidThisMonth = connection.lastPayment
    ? isThisMonth(connection.lastPayment)
    : false;
  const hasAddons =
    addonTotals.addonPrices > 0 || addonTotals.addonLcoPrices > 0;
  const totalLcoPrice = connection.basePack.lcoPrice + addonTotals.addonLcoPrices;
  const totalCustomerPrice =
    connection.basePack.customerPrice + addonTotals.addonPrices;

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
    const result = await markConnectionAsPaid(connection.id);
    setMarkingAsPaid(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setConnection({ ...connection, lastPayment: result.data.date });
    mutatePayments([result.data, ...payments]);
  };

  const onPackSelect = (id: string) => {
    setBasePackOpen(false);

    if (id === connection.basePack.id) return;

    setSelectedPack(data?.find((pack) => pack.id === id));
  };

  const migrate = async () => {
    if (!selectedPack) return;
    setMigrating(true);

    const result = await migrateConnection(connection.id, selectedPack.id);

    if (!result.success) {
      toast.error(result.error);
      setMigrating(false);
      return;
    }

    const payment = result.data;
    mutatePayments([payment, ...payments]);
    setConnection({
      ...connection,
      basePack: payment.to ?? payment.currentPack,
      lastPayment: payment.date,
    });
    setSelectedPack(undefined);
    setMigrating(false);
  };

  const deleteCurrentPayment = async (id: string) => {
    const loadingToast = toast.loading("Deleting payment...");
    const result = await deletePayment(id);
    toast.dismiss(loadingToast);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Payment deleted successfully.");
    mutatePayments(payments.filter((payment) => payment.id !== id));

    const payment = payments.find((p) => p.id === id);
    const updatedPayments = payments.filter((p) => p.id !== id);
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
        lastPayment: null,
      });
    }
  };

  const handleUpdateConnection = (data: ConnectionUpdateSchema, area: Area) => {
    setConnection({
      ...connection,
      name: data.name,
      phoneNumber: data.phoneNumber ?? null,
      boxNumber: data.boxNumber,
      area,
    });
    setEdit(false);
  };

  return (
    <main className="m-4 flex flex-col md:flex-row md:justify-between gap-4">
      <Card className="flex-1 h-fit">
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
          </div>

          {/* Phone Number */}
          {connection.phoneNumber && (
            <div className="flex items-center justify-between p-3 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
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
                        {(data ?? [])
                          .filter((pack) => pack.id !== connection.basePack.id)
                          .map((pack) => (
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
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-semibold">LCO: ₹{totalLcoPrice}</p>
                {hasAddons && (
                  <p className="text-xs text-muted-foreground">
                    Base ₹{connection.basePack.lcoPrice} + Add-ons ₹
                    {addonTotals.addonLcoPrices}
                  </p>
                )}
              </div>
              <div>
                <p className="font-semibold">MRP: ₹{totalCustomerPrice}</p>
                {hasAddons && (
                  <p className="text-xs text-muted-foreground">
                    Base ₹{connection.basePack.customerPrice} + Add-ons ₹
                    {addonTotals.addonPrices}
                  </p>
                )}
              </div>
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
      <div className="flex-1 space-y-4">
        <ConnectionAddons
          connectionId={connection.id}
          availableAddons={addons}
          initialAddons={connectionAddons}
          onAddonTotalsChange={setAddonTotals}
        />
        <PaymentsHistory
          payments={payments}
          deletePayment={deleteCurrentPayment}
          loading={paymentsLoading}
        />
      </div>
      <MigrationDialog
        selectedPack={selectedPack}
        setSelectedPack={setSelectedPack}
        connection={connection}
        migrate={migrate}
        migrating={migrating}
      />
      <UpdateConnection
        open={edit}
        onOpenChange={setEdit}
        connection={connection}
        callback={handleUpdateConnection}
      />
    </main>
  );
}
