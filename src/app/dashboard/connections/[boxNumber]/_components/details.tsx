"use client";

import { isThisMonth } from "date-fns";
import {
  Calendar,
  Check,
  Copy,
  LoaderCircle,
  MapPin,
  Phone,
  UserPen,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import type { Connection } from "../../_components/columns";
import PaymentsHistory from "./payments";
import type { Payment } from "./types";

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

  const lastPayment = connection.lastPayment
    ? new Date(connection.lastPayment)
    : undefined;
  const paidThisMonth = lastPayment ? isThisMonth(lastPayment) : false;

  const handleCopyPhone = async () => {
    if (connection?.phoneNumber) {
      await navigator.clipboard.writeText(connection.phoneNumber);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const formatLastPayment = () => {
    if (!lastPayment) return "No payment recorded";
    return lastPayment.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  return (
    <main className="m-4 flex flex-col md:flex-row md:justify-between gap-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {connection.name}
          </CardTitle>
          <CardDescription>SMC: #{connection.boxNumber}</CardDescription>
          <CardAction>
            <Button>
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
            <h3 className="font-semibold text-sm text-primary mb-2">
              {connection.basePack.name}
            </h3>
            <div className="flex justify-between text-sm font-semibold">
              <p>LCO: ₹{connection.basePack.lcoPrice}</p>
              <p>MRP: ₹{connection.basePack.customerPrice}</p>
            </div>
          </div>

          {/* Last Payment */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Last Payment:</span>
            <span className="font-medium">{formatLastPayment()}</span>
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
      <PaymentsHistory payments={payments} />
    </main>
  );
}
