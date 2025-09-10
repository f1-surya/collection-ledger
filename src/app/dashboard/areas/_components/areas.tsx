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
import { deleteArea, editArea } from "@/lib/actions/area";

export type Area = {
  id: number;
  name: string;
  connections: number;
};

export default function AreasList({ areas }: { areas: Area[] }) {
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [areaToEdit, setAreaToEdit] = useState<Area | null>(null);
  const t = useTranslations("Area");

  return (
    <>
      <ul className="space-y-4 mt-4">
        {areas.map((area) => (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle>{area.name}</CardTitle>
              <CardDescription>
                {area.connections}
                {t("connectionsCount")}
              </CardDescription>
              <CardAction className="flex flex-row gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAreaToEdit(area)}
                >
                  <PencilLine />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAreaToDelete(area)}
                >
                  <Trash2 className="text-red-500" />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </ul>
      <Dialog
        open={areaToEdit !== null}
        onOpenChange={() => setAreaToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
          </DialogHeader>
          <form action={editArea}>
            <input name="id" type="hidden" value={areaToEdit?.id} />
            <FormField
              id="name"
              label="Area name"
              required
              defaultValue={areaToEdit?.name}
            />
            <DialogFooter className="mt-4">
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={areaToDelete !== null}
        onOpenChange={() => setAreaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(
                areaToDelete?.connections === 0
                  ? "confirmDelete"
                  : "cantDelete",
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                areaToDelete?.connections === 0
                  ? "deleteDescription"
                  : "reason",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={deleteArea}>
            <input name="id" type="hidden" value={areaToDelete?.id} />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {areaToDelete?.connections === 0 && (
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
