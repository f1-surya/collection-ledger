"use client";

import { Package, PencilLine, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Addon } from "./types";

export default function AddonList({
  addons: defaultAddons,
}: {
  addons: Addon[];
}) {
  const [addons, setAddons] = useState<Addon[]>(defaultAddons);
  const [createAddon, setCreateAddon] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState<Addon | null>(null);
  const [addonToEdit, setAddonToEdit] = useState<Addon | null>(null);
  const t = useTranslations("Addon");

  const saveAddon = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData(e.currentTarget);
    const prom = fetch("/api/addons", { method: "POST", body });
    toast.promise(prom, {
      loading: "Saving addon...",
      success: `${body.get("name")} has been saved`,
      error: "Something went wrong.",
    });

    const res = await prom;
    if (res.status === 400) {
      const error = await res.json();
      toast.error(error.message);
    } else if (res.ok) {
      const newAddon = await res.json();
      const newAddons: Addon[] = [...addons, newAddon];
      setAddons(newAddons.sort((a, b) => a.name.localeCompare(b.name)));
      setCreateAddon(false);
    }
  };

  const editAddon = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = new FormData(e.currentTarget);
    const prom = fetch("/api/addons", { method: "PUT", body });

    toast.promise(prom, {
      loading: "Saving addon...",
      success: `${body.get("name")} has been saved`,
      error: "Something went wrong.",
    });

    const res = await prom;
    if (res.status === 400) {
      const error = await res.json();
      toast.error(error.message);
    } else {
      const updatedAddon = await res.json();
      if (!addonToEdit) return;

      setAddons((prev) =>
        prev.map((addon) =>
          addon.id === addonToEdit.id ? updatedAddon : addon,
        ),
      );
      setAddonToEdit(null);
    }
  };

  const deleteAddon = async () => {
    if (!addonToDelete) return;

    const prom = fetch(`/api/addons?id=${addonToDelete.id}`, {
      method: "DELETE",
    });
    toast.promise(prom, {
      loading: "Deleting addon...",
      success: `${addonToDelete.name} has been deleted`,
      error: "Something went wrong",
    });

    const res = await prom;
    if (res.ok) {
      setAddons((prev) =>
        prev.filter((addon) => addon.id !== addonToDelete.id),
      );
      setAddonToDelete(null);
    }
  };

  return (
    <>
      {addons.length === 0 && (
        <Empty className="w-fit h-fit m-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
      {addons.length > 0 && (
        <h2 className="font-semibold text-xl p-2">{t("list")}:</h2>
      )}
      <ul className="space-y-4 mt-4">
        {addons.map((addon) => (
          <Card key={addon.id}>
            <CardHeader>
              <CardTitle>{addon.name}</CardTitle>
              <CardDescription>
                MRP: ₹{addon.customerPrice} | LCO: ₹{addon.lcoPrice}
                {addon.connections !== undefined &&
                  ` | Connections: ${addon.connections}`}
              </CardDescription>
              <CardAction className="flex flex-row gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddonToEdit(addon)}
                >
                  <PencilLine />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddonToDelete(addon)}
                >
                  <Trash2 className="text-red-500" />
                </Button>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </ul>
      <Dialog
        open={addonToEdit !== null}
        onOpenChange={() => setAddonToEdit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={editAddon} className="space-y-4">
            <input name="id" type="hidden" value={addonToEdit?.id} />
            <FormField
              id="name"
              label="Addon name"
              required
              defaultValue={addonToEdit?.name}
            />
            <FormField
              id="lcoPrice"
              label="LCO price"
              required
              type="number"
              defaultValue={addonToEdit?.lcoPrice.toString()}
            />
            <FormField
              id="customerPrice"
              label="MRP"
              required
              type="number"
              defaultValue={addonToEdit?.customerPrice.toString()}
            />
            <DialogFooter className="mt-4">
              <DialogClose>Cancel</DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={addonToDelete !== null}
        onOpenChange={() => setAddonToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t(
                (addonToDelete?.connections ?? 0) === 0
                  ? "confirmDelete"
                  : "cantDelete",
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                (addonToDelete?.connections ?? 0) === 0
                  ? "deleteDescription"
                  : "reason",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={deleteAddon}>
            <input name="id" type="hidden" value={addonToDelete?.id} />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {(addonToDelete?.connections ?? 0) === 0 && (
                <Button variant="destructive" type="submit">
                  Delete
                </Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={createAddon} onOpenChange={setCreateAddon}>
        <DialogTrigger asChild>
          <Button className="fixed right-0 bottom-0 m-6 w-14 h-14">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addAddon")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveAddon} className="space-y-4">
            <FormField id="name" label="Addon name" required />
            <FormField id="lcoPrice" type="number" label="LCO price" required />
            <FormField id="customerPrice" type="number" label="MRP" required />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="destructive">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
