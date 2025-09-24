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
import type { Payment } from "./types";

const PaymentCard = ({
  payment,
  deletePayment,
}: {
  payment: Payment;
  deletePayment: (id: number) => Promise<void>;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <CardTitle className="text-md">
        {payment.isMigration ? payment.to?.name : payment.currentPack.name}
      </CardTitle>
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

export default function PaymentsHistory({
  payments,
  deletePayment,
}: {
  payments: Payment[];
  deletePayment: (id: number) => Promise<void>;
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
        {payments.length === 0 && (
          <p className="text-center">{t("noPayments")}</p>
        )}
        {payments.map((payment) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            deletePayment={deletePayment}
          />
        ))}
      </CardContent>
    </Card>
  );
}
