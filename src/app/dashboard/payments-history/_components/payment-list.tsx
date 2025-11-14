"use client";

import { format, startOfYear } from "date-fns";
import { ArrowRight, Download, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import MyPagination from "@/components/my-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Payment } from "../../connections/[boxNumber]/_components/types";

export default function PaymentList({
  payments,
  pages,
}: {
  payments: Payment[];
  pages: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const changeMonth = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", date.toISOString());
    router.replace(`/dashboard/payments-history?${params}`);
  };

  const changePaymentType = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val === "all") {
      params.delete("type");
    } else {
      params.set("type", val);
    }
    router.replace(`/dashboard/payments-history?${params}`);
  };

  const downloadPayments = async () => {
    const currentMonth = month ?? new Date().toISOString();
    const params = new URLSearchParams({ month: currentMonth });

    const response = await fetch(`/api/payment/sheet?${params}`, {
      headers: { "Content-Type": "text/csv" },
    });

    if (!response.ok) {
      throw new Error("Failed to download payments");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${format(currentMonth, "MMM-yyyy")}-payments.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const month = searchParams.get("month");

  return (
    <main className="p-4">
      <div className="flex items-center justify-between gap-1 py-2">
        <div className="flex items-center gap-2">
          <MonthPicker
            value={month ? new Date(month) : new Date()}
            onChange={changeMonth}
            min={startOfYear(new Date())}
            max={new Date()}
          />
          <Select
            value={searchParams.get("type")?.toString() ?? "all"}
            onValueChange={changePaymentType}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              <SelectItem value="payments">Payments</SelectItem>
              <SelectItem value="migrations">Migrations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Download /> Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={downloadPayments}>
              Download Payments
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-2">
        {payments.length === 0 ? (
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
          payments.map((payment, i) => (
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
              {payments.length - 1 !== i && <Separator className="w-full" />}
            </div>
          ))
        )}
      </div>
      <MyPagination pages={pages} />
    </main>
  );
}
