import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function useConnectionsSelection() {
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const data = localStorage.bulkPay;
    if (data) {
      setSelected(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(selected).length !== 0) {
      localStorage.bulkPay = JSON.stringify(selected);
    }
  }, [selected]);

  const clear = () => {
    setSelected({});
    localStorage.removeItem("bulkPay");
  };

  const getConsToPay = () =>
    Object.keys(selected).filter((boxNumber) => selected[boxNumber]);

  return { selected, setSelected, clear, getConsToPay };
}

export function BulkPay({
  smcs,
  clear,
}: {
  smcs: string[];
  clear: () => void;
}) {
  const [notPaidCons, setNotPaidCons] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const t = useTranslations("BulkPay");

  const handlePayNow = async () => {
    setIsLoading(true);
    const res = await fetch("/api/payment/bulk", {
      method: "POST",
      body: JSON.stringify({ smcs }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();

      if (data.ignored.length > 0) {
        setNotPaidCons(data.ignored);
      } else {
        toast.success(`${smcs.length} connections paid successfully`);
      }

      const blob = new Blob(
        [["Vc Number", ...data.paid.map((con: string[]) => con[1])].join("\n")],
        { type: "text/csv" },
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${format(new Date(), "MMM-yyyy")}-lists.csv`;
      a.click();
      URL.revokeObjectURL(url);
      clear();
      if (data.ignored.length === 0) {
        window.location.reload();
      }
    } else {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <>
      {smcs.length > 0 && (
        <Item size="sm" variant="outline" className="w-fit">
          <ItemTitle>
            {t("selectedConnections", { count: smcs.length })}
          </ItemTitle>
          <ItemActions>
            <Button size="sm" onClick={handlePayNow}>
              {isLoading ? <Spinner /> : t("payNow")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsClearDialogOpen(true)}
            >
              {t("clearSelection")}
            </Button>
          </ItemActions>
        </Item>
      )}
      <AlertDialog
        open={notPaidCons.length > 0}
        onOpenChange={() => setNotPaidCons([])}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("notPaid", { count: notPaidCons.length })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("notPaidReason")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("boxNumber")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notPaidCons.map((row) => (
                <TableRow key={row[1]}>
                  <TableCell>{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AlertDialogFooter>
            <AlertDialogCancel>Okay</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmClear")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmClearDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clear();
                setIsClearDialogOpen(false);
              }}
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
