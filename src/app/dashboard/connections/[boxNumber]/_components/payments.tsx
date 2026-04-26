import { format, isThisMonth } from "date-fns";
import { CreditCard, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payment } from "./types";

const PaymentCard = ({
  payment,
  deletePayment,
}: {
  payment: Payment;
  deletePayment: (id: string) => Promise<void>;
}) => {
  const selectedPack = payment.isMigration
    ? payment.to ?? payment.currentPack
    : payment.currentPack;
  const selectedPackId = selectedPack?.id;
  const extraItems = (payment.items ?? []).filter(
    (item) => item.id !== selectedPackId,
  );
  const addonCustomerPrice = extraItems.reduce(
    (sum, item) => sum + item.customerPrice,
    0,
  );
  const addonLcoPrice = extraItems.reduce((sum, item) => sum + item.lcoPrice, 0);
  const hasAddons = addonCustomerPrice > 0 || addonLcoPrice > 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-md">{selectedPack?.name}</CardTitle>
        <CardDescription>
          {format(payment.date, "dd MMM yyyy")}
          {payment.isMigration && (
            <Badge className="ml-4 text-xs">Migration</Badge>
          )}
        </CardDescription>
        {isThisMonth(payment.date) && (
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              onClick={() => deletePayment(payment.id)}
            >
              <Trash className="text-red-600" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm mb-2 font-semibold">
          <span>LCO: ₹{payment.lcoPrice}</span>
          <span>MRP: ₹{payment.customerPrice}</span>
        </div>

        {hasAddons && selectedPack && (
          <div className="mb-2 rounded-md border bg-muted/20 p-2 text-xs text-muted-foreground">
            <p>
              LCO: Base ₹{selectedPack.lcoPrice} + Add-ons ₹{addonLcoPrice}
            </p>
            <p>
              MRP: Base ₹{selectedPack.customerPrice} + Add-ons ₹
              {addonCustomerPrice}
            </p>
          </div>
        )}

        {extraItems.length > 0 && (
          <div className="mt-3 rounded-md border bg-muted/30 p-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Add-ons
            </p>
            <ul className="space-y-1 text-sm">
              {extraItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">
                    ₹{item.customerPrice}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {payment.isMigration && payment.to && (
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Migrated from:{" "}
              <span className="font-medium">{payment.currentPack.name}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function PaymentsHistory({
  payments,
  deletePayment,
  loading,
}: {
  payments: Payment[];
  deletePayment: (id: string) => Promise<void>;
  loading?: boolean;
}) {
  const t = useTranslations("ConnectionPage");

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <CreditCard size={20} /> Payments History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map(() => (
              <Card key={Math.random()}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <p className="text-center">{t("noPayments")}</p>
        ) : (
          payments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              deletePayment={deletePayment}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
