"use client";

import { Blocks, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { connectAddon, removeAddon } from "@/actions/addons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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

type Addon = {
  id: string;
  name: string;
  lcoPrice: number;
  customerPrice: number;
};

type ConnectedAddon = {
  id: string;
  addon: Addon;
};

type AddonTotals = {
  addonPrices: number;
  addonLcoPrices: number;
};

export default function ConnectionAddons({
  connectionId,
  availableAddons,
  initialAddons,
  onAddonTotalsChange,
}: {
  connectionId: string;
  availableAddons: Addon[];
  initialAddons: ConnectedAddon[];
  onAddonTotalsChange: (totals: AddonTotals) => void;
}) {
  const [connectionAddons, setConnectionAddons] =
    useState<ConnectedAddon[]>(initialAddons);
  const [addOpen, setAddOpen] = useState(false);
  const [addingAddonId, setAddingAddonId] = useState<string | null>(null);
  const [removingAddonId, setRemovingAddonId] = useState<string | null>(null);

  const unselectedAddons = useMemo(
    () =>
      availableAddons.filter(
        (addon) =>
          !connectionAddons.some(
            (connectionAddon) => connectionAddon.addon.id === addon.id,
          ),
      ),
    [availableAddons, connectionAddons],
  );

  const totalAddonLco = useMemo(
    () =>
      connectionAddons.reduce(
        (sum, connectionAddon) => sum + connectionAddon.addon.lcoPrice,
        0,
      ),
    [connectionAddons],
  );

  const totalAddonMrp = useMemo(
    () =>
      connectionAddons.reduce(
        (sum, connectionAddon) => sum + connectionAddon.addon.customerPrice,
        0,
      ),
    [connectionAddons],
  );

  useEffect(() => {
    onAddonTotalsChange({
      addonPrices: totalAddonMrp,
      addonLcoPrices: totalAddonLco,
    });
  }, [onAddonTotalsChange, totalAddonLco, totalAddonMrp]);

  const addAddonToConnection = async (addonId: string) => {
    const addon = availableAddons.find((item) => item.id === addonId);

    if (!addon) {
      toast.error("Could not find addon");
      return;
    }

    setAddingAddonId(addonId);
    const res = await connectAddon(connectionId, addonId);
    setAddingAddonId(null);

    if (res.success) {
      setConnectionAddons((prev) => [
        ...prev,
        {
          id: res.data[0].id,
          addon,
        },
      ]);

      setAddOpen(false);
      toast.success("Addon added to connection");
    } else {
      toast.error(res.error);
    }
  };

  const deleteAddonFromConnection = async (id: string) => {
    setRemovingAddonId(id);
    const res = await removeAddon(id);
    setRemovingAddonId(null);

    if (res.success) {
      setConnectionAddons((prev) => prev.filter((addon) => addon.id !== id));
      toast.success("Addon removed");
    } else {
      toast.error(res.error ?? "Failed to remove addon");
    }
  };

  return (
    <Card className="flex-1 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks size={20} /> Addons
        </CardTitle>
        <CardDescription>
          Manage optional addons for this connection
        </CardDescription>
        <CardAction>
          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger asChild>
              <Button size="sm" disabled={unselectedAddons.length === 0}>
                <Plus size={14} className="mr-1" />
                Add addon
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Command>
                <CommandInput placeholder="Search addons..." />
                <CommandList>
                  <CommandEmpty>No addon available.</CommandEmpty>
                  <CommandGroup>
                    {unselectedAddons.map((addon) => (
                      <CommandItem
                        key={addon.id}
                        value={`${addon.name} ${addon.id}`}
                        disabled={addingAddonId === addon.id}
                        onSelect={() => addAddonToConnection(addon.id)}
                        className="flex items-center justify-between"
                      >
                        <p className="font-medium">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">
                          MRP: ₹{addon.customerPrice}
                        </p>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {connectionAddons.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-3">
            No addons added yet.
          </p>
        )}
        {connectionAddons.map((connectionAddon) => (
          <div
            key={connectionAddon.id}
            className="rounded-lg border p-3 bg-muted/30 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">
                {connectionAddon.addon.name}
              </p>
              <p className="text-xs text-muted-foreground">
                LCO: ₹{connectionAddon.addon.lcoPrice} • MRP: ₹
                {connectionAddon.addon.customerPrice}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => deleteAddonFromConnection(connectionAddon.id)}
              disabled={removingAddonId === connectionAddon.id}
            >
              {removingAddonId === connectionAddon.id ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Trash2 className="text-red-600" />
              )}
            </Button>
          </div>
        ))}
        <div className="rounded-lg border bg-background p-3 text-sm font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <p>Total addon LCO: ₹{totalAddonLco}</p>
          <p>Total addon MRP: ₹{totalAddonMrp}</p>
        </div>
      </CardContent>
    </Card>
  );
}
