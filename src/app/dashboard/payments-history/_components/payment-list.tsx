"use client";

import { format, startOfMonth } from "date-fns";
import { ArrowRight, HardDriveUpload, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import type { Payment } from "../../connections/[boxNumber]/_components/types";

export default function PaymentList({
  defaultPayments,
}: {
  defaultPayments: Payment[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filteredPayments = useMemo(() => {
    return defaultPayments.filter(
      (payment) =>
        payment.isMigration === (searchParams.get("migration") === "true"),
    );
  }, [searchParams, defaultPayments]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const updateSearchParams = useCallback(
    (updates: Record<string, boolean | string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value || typeof value === "boolean") {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  const formatDates = () => {
    if (!startDate || !endDate) {
      return "Pick 2 dates";
    }

    return `${format(startDate, "dd MMM yy")} - ${format(endDate, "dd MMM yy")}`;
  };

  const changeDates = (range?: DateRange) => {
    if (!range?.from || !range?.to) return;
    updateSearchParams({
      start: range.from.toISOString(),
      end: range.to.toISOString(),
    });
  };

  return (
    <main className="p-4">
      <div className="flex gap-1 py-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">{formatDates()}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 m-4">
            <Calendar
              mode="range"
              selected={{
                from: startDate
                  ? new Date(startDate)
                  : startOfMonth(new Date()),
                to: endDate ? new Date(endDate) : new Date(),
              }}
              onSelect={changeDates}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>
        <Toggle
          pressed={searchParams.get("migration") === "true"}
          onPressedChange={(val) => updateSearchParams({ migration: val })}
        >
          <HardDriveUpload />
        </Toggle>
      </div>
      <div className="space-y-2">
        {filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Search className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-sm font-semibold mb-1">No payments found</h3>
              <p className="text-xs text-muted-foreground text-center">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPayments.map((payment, i) => (
            <div key={payment.id}>
              <div className="flex flex-row justify-between p-1">
                <div>
                  <h3 className="text-lg font-bold">
                    {payment.connection.name}
                  </h3>
                  <div className="flex flex-col text-muted-foreground text-xs">
                    {payment.isMigration ? (
                      <span className="flex items-center gap-1">
                        <span>{payment.currentPack.name}</span>
                        <ArrowRight size={10} />
                        <span className="text-blue-600">
                          {payment.to?.name}
                        </span>
                      </span>
                    ) : (
                      <span>{payment.currentPack.name}</span>
                    )}
                    <span>{format(payment.date, "dd MMM yy")}</span>
                  </div>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">
                  MRP: {formatCurrency(payment.customerPrice)}
                </div>
              </div>
              {filteredPayments.length - 1 !== i && (
                <Separator className="w-full" />
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
