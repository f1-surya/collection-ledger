"use client";

import { PencilLine, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FormField } from "@/components/forms/formfield";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteBasePack, editBasePack } from "@/lib/actions/base-packs";

export type BasePack = {
  id: number;
  name: string;
  lcoPrice: number;
  customerPrice: number;
  connections: number;
};

export function BasePackList({ packs }: { packs: BasePack[] }) {
  const [packToDelete, setPackToDelete] = useState<BasePack | null>(null);
  const [packToEdit, setPackToEdit] = useState<BasePack | null>(null);
  const t = useTranslations("BasePack");

  return (
    <>
      <ul className="space-y-4">
        {packs.map((pack) => (
          <Card key={pack.id}>
            <CardHeader>
              <CardTitle>{pack.name}</CardTitle>
              <CardDescription>
                MRP: ₹{pack.customerPrice} | Connections: {pack.connections}
              </CardDescription>
              <CardAction className="flex flex-row gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPackToEdit(pack)}
                >
                  <PencilLine />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPackToDelete(pack)}
                >
                  <Trash2 className="text-red-500" />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </ul>
      <Dialog
        open={packToEdit !== null}
        onOpenChange={() => setPackToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
          </DialogHeader>
          <form action={editBasePack} className="space-y-4">
            <input name="id" type="hidden" value={packToEdit?.id} />
            <FormField
              id="name"
              label="Pack name"
              required
              defaultValue={packToEdit?.name}
            />
            <FormField
              id="lcoPrice"
              label="LCO price"
              required
              type="number"
              defaultValue={packToEdit?.lcoPrice.toString()}
            />
            <FormField
              id="customerPrice"
              label="MRP"
              required
              type="number"
              defaultValue={packToEdit?.customerPrice.toString()}
            />
            <DialogFooter className="mt-4">
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={packToDelete !== null}
        onOpenChange={() => setPackToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(
                packToDelete?.connections === 0
                  ? "confirmDelete"
                  : "cantDelete",
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                packToDelete?.connections === 0
                  ? "deleteDescription"
                  : "reason",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={deleteBasePack}>
            <input name="id" type="hidden" value={packToDelete?.id} />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {packToDelete?.connections === 0 && (
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
